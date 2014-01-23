'use strict';

(function (angular) {
  var commonUtil = angular.module('trng.common.utils', []);
  
  commonUtil.factory('trng.common.utils.Cloner', [function() {
        var commonService = {
        	cloneObject: function (source, origTarget) {
    			var target = origTarget || {};
    			angular.forEach(source, function (value, key) {
    				target[key] = value;
    			});
    			
    			return target;
        	}
        };
        
        return commonService;
  }]);
})(angular);


