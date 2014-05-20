'use strict';

angular.module('trng.common.utils').factory('trng.common.utils.DateUtil', [function () {
    var dateUtil = {
        dateJs: {
            dateFormat: 'dd/MM/yyyy',
            timeFormat: 'hh:mm:ss tt',
            dateTimeFormat: 'dd/MM/yyyy hh:mm:ss tt'
        },

        angular: {
            dateFormat: 'dd/MM/yyyy',
            timeFormat: 'hh:mm:ss a',
            dateTimeFormat: 'dd/MM/yyyy hh:mm:ss a'
        }
    };

    return dateUtil;
}]);


