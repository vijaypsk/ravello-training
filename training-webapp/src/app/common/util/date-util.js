'use strict';

angular.module('trng.common.utils').factory('trng.common.utils.DateUtil', [function () {
    var dateUtil = {
        dateFormat: 'dd/MM/yyyy',
        timeFormat: 'hh:mm:ss',
        dateTimeFormat: 'dd/MM/yyyy hh:mm:ss'
    };

    return dateUtil;
}]);


