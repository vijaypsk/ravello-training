'use strict';

angular.module('trng.services').factory('AdminService', [
	'AdminProxy',
	function(AdminProxy) {

		var service = {
            updateProfile: function(username, password) {
                return AdminProxy.updateProfile(username, password);
            }
        };
		
		return service;
	}
]);
