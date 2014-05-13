'use strict';

angular.module('trng.services').factory('trng.services.AdminService', [
	'trng.proxies.AdminProxy',
	function(adminProxy) {

		var service = {
            updateProfile: function(username, password) {
                return adminProxy.updateProfile(username, password);
            }
        };
		
		return service;
}]);
