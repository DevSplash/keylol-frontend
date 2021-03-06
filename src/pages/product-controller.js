﻿(function () {
    class ProductController {
        constructor ($scope, pageHead, stateTree, pageLoad, $state) {

            let promise;
            if (stateTree.empty || stateTree.aggregation && stateTree.aggregation.point
                && stateTree.aggregation.point.basicInfo && stateTree.aggregation.point.basicInfo.idCode === $state.params.point_id_code ) {
                promise = pageLoad('aggregation.point.product');
            } else {
                promise = pageLoad('aggregation.point', { entrance: 'Product' });
            }
            promise.then(() => {
                pageHead.setTitle(
                    `作品 - ${stateTree.aggregation.point.basicInfo.chineseName ? `${stateTree.aggregation.point.basicInfo.chineseName} - ` : ''}`
                    + `${stateTree.aggregation.point.basicInfo.englishName} - 其乐`);
                pageHead.setDescription(`${stateTree.aggregation.point.basicInfo.chineseName
                || stateTree.aggregation.point.basicInfo.englishName} 社区`);
                const keywords = [stateTree.aggregation.point.basicInfo.englishName, '好玩吗, 怎么样, 下载, 破解, 多少钱, 教程, 攻略, steam, 杉果, 评测, 社区, 折扣, 史低'];
                if (stateTree.aggregation.point.basicInfo.chineseName) {
                    keywords.unshift(stateTree.aggregation.point.basicInfo.chineseName);
                }
                pageHead.setKeywords(keywords);

                $scope.currentPage = 0;
                switch (stateTree.aggregation.point.basicInfo.type) {
                    case 'vendor':
                        this.productCount = stateTree.aggregation.point.product.products.length;
                        $scope.tabArray = [
                            { name: `共 ${this.productCount} 部作品` },
                        ];
                        $scope.productParts = this.divide(stateTree.aggregation.point.product.products,'vendor');
                        for (let i = 1 ; i !== $scope.productParts.length; i++) {
                            $scope.tabArray.push({
                                name: `${$scope.productParts[i].header.mainTitle} ${$scope.productParts[i].cards.length} 部` ,
                            });
                        }
                        break;
                    case 'category':
                        this.productCount = stateTree.aggregation.point.product.products.length;
                        $scope.tabArray = [
                            { name: `共 ${this.productCount} 部作品` },
                        ];
                        $scope.productParts = this.divide(stateTree.aggregation.point.product.products,'category');
                        for (let i = 1 ; i !== $scope.productParts.length; i++) {
                            $scope.tabArray.push({
                                name: `${$scope.productParts[i].cards.length} 部作为${$scope.productParts[i].header.mainTitle}` ,
                            });
                        }
                        break;
                    case 'platform':
                        this.productCount = stateTree.aggregation.point.product.products.length;
                        $scope.tabArray = [
                            { name: `共 ${this.productCount} 部作品` },
                        ];
                        $scope.productParts = [{
                            header: {
                                mainTitle: '作品',
                                subTitle: `共 ${this.productCount} 部作品`,
                                type: 'theme',
                            },
                            cards: stateTree.aggregation.point.product.products,
                        }];
                        break;
                }
            });

            $scope.changePage = function (index) {
                if ($scope.currentPage !== index) {
                    $scope.currentPage = index;
                }
            };

            $scope.stateTree = stateTree;
        }

        divide(arr, type) {
            const parts = [];
            let list = [];
            parts.push({
                header: {
                    mainTitle: '作品',
                    subTitle: `共 ${this.productCount} 部作品`,
                    type: 'theme',
                },
                cards: arr,
            });
            switch (type) {
                case 'vendor':
                    for (let i = 0;i !== arr.length; i++) {
                        if ($.inArray('developer', arr[i].roles) !== -1)
                            list.push(arr[i]);
                    }
                    if (list.length > 0) {
                        parts.push({
                            header: {
                                mainTitle: '开发',
                                subTitle: `旗下 ${this.productCount} 部作品中有 ${list.length} 部为其开发`,
                                type: 'theme',
                            },
                            cards: list,
                        });
                    }

                    list = [];
                    for (let i = 0;i !== arr.length; i++) {
                        if ($.inArray('publisher', arr[i].roles) !== -1)
                            list.push(arr[i]);
                    }
                    if (list.length > 0) {
                        parts.push({
                            header: {
                                mainTitle: '发行',
                                subTitle: `旗下 ${this.productCount} 部作品中有 ${list.length} 部为其发行`,
                                type: 'theme',
                            },
                            cards: list,
                        });
                    }

                    list = [];
                    for (let i = 0;i !== arr.length; i++) {
                        if ($.inArray('manufacturer', arr[i].roles) !== -1)
                            list.push(arr[i]);
                    }
                    if (list.length > 0) {
                        parts.push({
                            header: {
                                mainTitle: '制造',
                                subTitle: `旗下 ${this.productCount} 部作品中有 ${list.length} 部为其制造`,
                                type: 'theme',
                            },
                            cards: list,
                        });
                    }

                    list = [];
                    for (let i = 0;i !== arr.length; i++) {
                        if ($.inArray('reseller', arr[i].roles) !== -1)
                            list.push(arr[i]);
                    }
                    if (list.length > 0) {
                        parts.push({
                            header: {
                                mainTitle: '代理',
                                subTitle: `旗下 ${this.productCount} 部作品中有 ${list.length} 部为其代理`,
                                type: 'theme',
                            },
                            cards: list,
                        });
                    }
                    break;
                case 'category':
                    for (let i = 0;i !== arr.length; i++) {
                        if ($.inArray('genre', arr[i].roles) !== -1)
                            list.push(arr[i]);
                    }
                    if (list.length > 0) {
                        parts.push({
                            header: {
                                mainTitle: '特性',
                                subTitle: `此类 ${this.productCount} 部作品中有 ${list.length} 部属于此特性`,
                                type: 'theme',
                            },
                            cards: list,
                        });
                    }

                    list = [];
                    for (let i = 0;i !== arr.length; i++) {
                        if ($.inArray('series', arr[i].roles) !== -1)
                            list.push(arr[i]);
                    }
                    if (list.length > 0) {
                        parts.push({
                            header: {
                                mainTitle: '系列',
                                subTitle: `此类 ${this.productCount} 部作品中有 ${list.length} 部属于此系列`,
                                type: 'theme',
                            },
                            cards: list,
                        });
                    }

                    list = [];
                    for (let i = 0;i !== arr.length; i++) {
                        if ($.inArray('tag', arr[i].roles) !== -1)
                            list.push(arr[i]);
                    }
                    if (list.length > 0) {
                        parts.push({
                            header: {
                                mainTitle: '流派',
                                subTitle: `此类 ${this.productCount} 部作品中有 ${list.length} 部属于此流派`,
                                type: 'theme',
                            },
                            cards: list,
                        });
                    }
                    break;
            }
            return parts;
        }
    }

    keylolApp.controller('ProductController', ProductController);
}());
