'use strict';

angular.module('trng.proxies').factory('BlueprintsProxy', [
    '$http',
    '$q',
    'CommonConstants',
    'TrainingMainTracker',
    function($http, $q, CommonConstants, TrainingMainTracker) {
        return {
            getAllBlueprints: function() {
                var promise = $http.get(CommonConstants.baseUrl + '/rest/blueprints');
                TrainingMainTracker.addPromise(promise);
                return promise;
            }
        };
    }
]);
