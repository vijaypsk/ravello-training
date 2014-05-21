'use strict';

angular.module('trng.services').factory('LoginService', [
    'LoginProxy',
	function(LoginProxy) {

		var service = {
            login: function(username, password) {
                return LoginProxy.login(username, password).then(
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
    }
]);
