'use strict';

angular.module('trng.proxies').factory('trng.proxies.BlueprintsProxy', [
    '$http',
    '$q',
    'app.config',
    'trainingTracker',
    function($http, $q, config, trainingTracker) {
        return {
            getAllBlueprints: function() {
                var promise = $http.get(config.baseUrl + '/rest/blueprints');
                trainingTracker.addPromise(promise);
                return promise;
            }
        };
    }
]);
