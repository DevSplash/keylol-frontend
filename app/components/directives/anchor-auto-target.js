(function () {
    "use strict";

    keylolApp.directive("a", function () {
        return {
            restrict: "E",
            link: function (scope, element, attrs) {
                attrs.$observe("href", function () {
                    var a = element[0];
                    if (location.host.indexOf(a.hostname) !== 0)
                        a.target = "_blank";
                });
            }
        }
    });
})();