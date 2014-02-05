'use strict';

angular.module('trng.proxies').factory('trng.proxies.ClassesProxy', ['$http', '$q', function($http, $q) {
	return {
		getAllClasses: function() {
			var promise = $http.get('/rest/classes');
			
			promise.then(function(result) {
				return result;
			});
			
			return promise;
		},

        add: function(classToSave) {
            return $http.post('/rest/classes', classToSave);
        },

        update: function(classToSave) {
            return $http.put('/rest/classes/' + classToSave['id'], classToSave);
        }
	};
}]);
