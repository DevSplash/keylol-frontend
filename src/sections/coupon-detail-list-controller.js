﻿(function () {
    class CouponDetailListController {
        constructor ($http, apiEndpoint, $filter, $element, utils) {
            $.extend(this, {
                $http,
                apiEndpoint,
                $filter,
                $element,
                utils,
            });
            this.currentPage = 1;
            this.pre(this.list);
        }

        scrollToTop() {
            this.utils.scrollTo(this.$element);
        }

        changePage(newPage, oldPage) {
            if (!this.changePageLock) {
                this.changePageLock = true;
                this.$http.get(`${this.apiEndpoint}states/coupon/detail/coupon-logs?page=${newPage}`,{
                    params: this.requestParams,
                }).then(response => {
                    this.currentPage = newPage;
                    this.isToNext = newPage > oldPage;
                    this.list = response.data;
                    this.pre(this.list);
                    this.changePageLock = false;
                    this.scrollToTop();
                }, response => {
                    this.changePageLock = false;
                });
            }
            return true;
        }

        abs (num) {
            return Math.abs(num);
        }

        pre (list) {
            for (let i = 0; i !== list.length; i++) {
                const item = list[i];

                if (typeof item.description !== 'object')
                    continue;

                if (item.description.ArticleComment) {
                    item.description.link = `article/${item.description.ArticleComment.ArticleAuthorIdCode}/${item.description.ArticleComment.SidForAuthor}`;
                    item.description.content = `「${this.$filter('maxLength')(item.description.ArticleComment.Content, 9)}」`;
                } else if (item.description.Article) {
                    item.description.link = `article/${item.description.Article.IdCode}/${item.description.Article.SidForAuthor}`;
                    item.description.content = `《${this.$filter('maxLength')(item.description.Article.Title, 9)}》`;
                } else if (item.description.Activity) {
                    item.description.link = `activity/${item.description.Activity.IdCode}/${item.description.Activity.SidForAuthor}`;
                    item.description.content = `「${this.$filter('maxLength')(item.description.Activity.Content, 9)}」`;
                } else if (item.description.ActivityComment) {
                    item.description.link = `activity/${item.description.ActivityComment.ArticleAuthorIdCode}/${item.description.ActivityComment.SidForAuthor}`;
                    item.description.content = `「${this.$filter('maxLength')(item.description.ActivityComment.Content, 9)}」`;
                }

                if (item.description.Operator) {
                    item.description.operatorLink = `user/${item.description.Operator.IdCode}`;
                    item.description.username = item.description.Operator.UserName;
                }
            }
        }
    }

    keylolApp.component('couponDetailList', {
        templateUrl: 'src/sections/coupon-detail-list.html',
        controller: CouponDetailListController,
        controllerAs: 'couponDetailList',
        bindings: {
            list: '<',
            totalPage: '<',
            object: '<',
        },
    });
}());
