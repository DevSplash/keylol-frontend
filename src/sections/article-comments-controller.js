﻿(function () {
    class ArticleCommentsController {
        constructor (stateTree, $http, apiEndpoint, $element, $timeout, notification, union, window, utils) {
            $.extend(this, {
                stateTree,
                $http,
                apiEndpoint,
                $element,
                $timeout,
                notification,
                window,
                utils,
            });

            this.currentPage = 1;
            this.vm = {
                articleId: this.article.id,
                content: '',
            };

            this.setCommentsHeight();

            union.updateCommentsHeight = () => {
                this.setCommentsHeight();
            };

            this.showArchivePopup = [];
            this.showWarnPopup = [];

            if (!stateTree.currentUser) {
                this.currentIdCode = '';
                this.isManager = false;
            } else {
                this.currentIdCode = stateTree.currentUser.idCode;
                this.isManager = (stateTree.currentUser.roles.indexOf('Operator') > -1);
            }
        }

        authorize_view (comment) {
            return !comment.archived || (comment.authorIdCode === this.currentIdCode || this.isManager);
        }

        authorize_edit (comment) {
            return (comment.authorIdCode === this.currentIdCode && this.currentIdCode === this.article.authorBasicInfo.idCode ) || this.isManager;
        }

        changePage (newPage, oldPage, scrollToTop) {
            if (!this.changePageLock) {
                this.changePageLock = true;
                this.$http.get(`${this.apiEndpoint}states/content/article/comments`,{
                    params: {
                        article_id: this.article.id,
                        page: newPage,
                    },
                }).then(response => {
                    this.currentPage = newPage;
                    this.isToNext = newPage > oldPage;
                    this.article.comments = response.data;
                    this.changePageLock = false;
                    this.setCommentsHeight();
                    if (scrollToTop)
                        this.scrollToTop();
                }, response => {
                    this.changePageLock = false;
                });
            }
            return true;
        }

        setCommentsHeight () {
            this.$timeout(() => {
                this.commentsHeight = this.$element.find('.comments>ul').height();
            });
        }

        scrollToTop() {
            this.utils.scrollTo(this.$element);
        }

        reply (comment) {
            this.replyToComment = comment;

            $('html, body').animate({
                scrollTop: this.$element.find('.sender').offset().top - 64,
            });
        }

        cancelReply () {
            delete this.replyToComment;
        }

        edit ($index) {
            this.window.show({
                templateUrl: 'src/windows/comment-editor.html',
                controller: 'CommentEditorController',
                controllerAs: 'commentEditor',
                inputs: {
                    comment: this.article.comments[$index],
                    theme: this.theme,
                    options: {
                        isGame: this.article.pointBasicInfo.type === 'game',
                    },
                },
            }).then(window => {
                return window.close;
            }).then(result => {
                if (result) {
                    this.article.comments[$index] = result;
                }
            });
        }

        submit () {
            if (this.submitLock) return;
            this.submitLock = true;

            if (this.replyToComment) {
                this.vm.replyToComment = this.replyToComment.sidForArticle;
            } else {
                delete this.vm.replyToComment;
            }

            this.$http.post(`${this.apiEndpoint}article-comment`, this.vm).then(response => {
                this.notification.success({ message: '发送评论成功' });
                this.article.comments.push({
                    authorAvatarImage: this.stateTree.currentUser.avatarImage,
                    authorIdCode: this.stateTree.currentUser.idCode,
                    authorUserName: this.stateTree.currentUser.userName,
                    content: this.vm.content,
                    likeCount: 0,
                    publishTime: new Date().toISOString(),
                    sidForArticle: response.data,
                    replyToComment: this.replyToComment,
                    authorPlayedTime: this.article.pointBasicInfo.totalPlayedTime,
                });
                this.vm = {
                    articleId: this.article.id,
                    content: '',
                };
                delete this.replyToComment;
                this.setCommentsHeight();
                this.article.commentPageCount = Math.floor((response.data - 1) / 10) + 1;
                this.article.commentCount = response.data;
                this.article.latestCommentTime = this.article.comments[this.article.comments.length - 1].publishTime;
                this.submitLock = false;
            }, response => {
                this.notification.error({ message: '发生未知错误，请重试或与站务职员联系' }, response);
                this.submitLock = false;
            });
        }

        showArchive($index, $event, comment) {
            this.showArchivePopup[$index]({
                templateUrl: 'src/popup/operation-panel.html',
                controller: 'OperationPanelController as operationPanel',
                event: $event,
                attachSide: 'bottom',
                align: 'center',
                offsetX: 0,
                offsetY: -90,
                inputs: {
                    options: {
                        contentId: comment.id,
                        contentType: 'article-comment',
                        operationType: `${comment.archived ? 'Un' : ''}Archived`,
                    },
                },
            }).then(popup => {
                return popup.close;
            }).then(result => {
                if (result !== undefined) {
                    comment.archived = result;
                }
            });
        }

        showWarn($index, $event, comment) {
            this.showWarnPopup[$index]({
                templateUrl: 'src/popup/operation-panel.html',
                controller: 'OperationPanelController as operationPanel',
                event: $event,
                attachSide: 'bottom',
                align: 'center',
                offsetX: 0,
                offsetY: -90,
                inputs: {
                    options: {
                        contentId: comment.id,
                        contentType: 'article-comment',
                        operationType: `${comment.warned ? 'Un' : ''}Warned`,
                    },
                },
            }).then(popup => {
                return popup.close;
            }).then(result => {
                if (result !== undefined) {
                    comment.warned = result;
                }
            });
        }
    }

    keylolApp.component('articleComments', {
        templateUrl: 'src/sections/article-comments.html',
        controller: ArticleCommentsController,
        controllerAs: 'articleComments',
        bindings: {
            article: '<',
            theme: '<',
        },
    });
}());
