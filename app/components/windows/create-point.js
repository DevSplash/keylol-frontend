﻿(function () {
    "use strict";

    keylolApp.controller("CreatePointController", [
        "$scope", "close", "$http", "apiEndpoint", "utils", "notification", "vm", "avatarUrlFilter",
        function ($scope, close, $http, apiEndpoint, utils, notification, vm, avatarUrlFilter) {
            $scope.radioId = [utils.uniqueId(), utils.uniqueId(), utils.uniqueId(), utils.uniqueId()];

            var init = function () {
                if (vm) {
                    $scope.vm = $.extend({}, vm);
                    $scope.inline = {
                        avatarImageFull: avatarUrlFilter(vm.AvatarImage),
                        backgroundImageFull: "https://keylol.b0.upaiyun.com/" + vm.BackgroundImage,
                        associatedPoints: vm.AssociatedPoints
                    }
                } else {
                    $scope.vm = {
                        Type: "Game",
                        ChineseName: "",
                        EnglishName: "",
                        ChineseAliases: "",
                        EnglishAliases: "",
                        IdCode: "",
                        StoreLink: ""
                    };
                    $scope.inline = {
                        avatarImageFull: "",
                        backgroundImageFull: "",
                        associatedPoints: []
                    }
                }
            };
            init();

            $scope.cancel = function () {
                close();
            };

            $scope.$watchCollection("inline.associatedPoints", function (newValue) {
                $scope.vm.AssociatedPointsId = [];
                if (newValue)
                    for (var i = 0; i < newValue.length; ++i) {
                        $scope.vm.AssociatedPointsId.push(newValue[i].Id);
                    }
            });

            $scope.submit = function () {
                var regex = /^(?:http:|https:)?\/\/keylol\.b0\.upaiyun\.com\/(.*?)(?:!.*)?$/i;
                var avatarMatch = $scope.inline.avatarImageFull.match(regex);
                if (!avatarMatch) {
                    notification.error("据点头像输入有误，请检查");
                    return;
                }
                $scope.vm.AvatarImage = "keylol://avatars/" + avatarMatch[1];
                var backgroundMatch = $scope.inline.backgroundImageFull.match(regex);
                if (!backgroundMatch) {
                    notification.error("据点背景图输入有误，请检查");
                    return;
                }
                $scope.vm.BackgroundImage = backgroundMatch[1];
                if ($scope.vm.Type === "Game" && !/(http:|https:)\/\/store\.steampowered\.com\/app\/(\d+)/i.test($scope.vm.StoreLink)) {
                    notification.error("商店链接输入有误，请检查");
                    return;
                }
                $scope.vm.IdCode = $scope.vm.IdCode.toUpperCase();
                if (vm) {
                    $http.put(apiEndpoint + "normal-point/" + $scope.vm.Id, $scope.vm).then(function () {
                        notification.success("据点编辑成功");
                        close();
                    }, function (response) {
                        if (response.status === 400) {
                            notification.error(response.data);
                        } else if (response.status === 404) {
                            notification.error("指定据点不存在");
                        }
                    });
                } else {
                    $http.post(apiEndpoint + "normal-point", $scope.vm).then(function () {
                        notification.success("据点创建成功");
                        init();
                    }, function (response) {
                        if (response.status === 400) {
                            notification.error(response.data);
                        } else {
                            notification.error("未知错误", response);
                        }
                    });
                }
            };
        }
    ]);
})();