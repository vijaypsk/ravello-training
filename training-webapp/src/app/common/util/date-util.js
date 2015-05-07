'use strict';

angular.module('trng.common.utils').factory('DateUtil', [
    function () {
        var dateUtil = {
            angular: {
                dateFormat: 'dd/MM/yyyy',
                timeFormat: 'hh:mm:ss a',
                dateTimeFormat: 'dd/MM/yyyy hh:mm:ss a'
            }
        };

        return dateUtil;
    }
]);


