'use strict';

angular.module('trng.common.utils').factory('trng.common.utils.Cloner', [function () {
    var cloner = {
        cloneObject: function (source, origTarget) {
            var target = origTarget || {};
            angular.forEach(source, function (value, key) {
                target[key] = value;
            });

            return target;
        }
    };

    return cloner;
}]);


