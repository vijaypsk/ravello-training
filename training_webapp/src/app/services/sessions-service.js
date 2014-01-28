'use strict';

angular.module('trng.services').factory('trng.services.SessionsService', [
	'trng.proxies.SessionsProxy',
	'trng.transformers.SessionsTransformer',
	function(sessionsProxy, sessionTrans) {
		
		var service = {
			getAllSessions: function() {
				var promise = sessionsProxy.getAllSessions();
				
				var sessionEntities = [];

				return promise.then(function(result) {
                    _.forEach(result.data, function(currentSessionDto) {
						var currentSessionEntity = sessionTrans.dtoToEntity(currentSessionDto);
                        sessionEntities.push(currentSessionEntity);

                    });
					return sessionEntities;
				});
			}
		};
		
		return service;
}]);
