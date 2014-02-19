'use strict';

angular.module('trng.services').factory('trng.services.LoginService', [
    'trng.proxies.LoginProxy',
	function(loginProxy) {

		var service = {
            login: function(username, password) {
                return loginProxy.login(username, password).then(
                    function(result) {
                        var dto = result.data;

                        var entity = _.cloneDeep(dto);
                        entity.id = entity._id;
                        entity = _.omit(entity, '_id');

                        return entity;
                    }
                );
            }
        };
		
		return service;
}]);
