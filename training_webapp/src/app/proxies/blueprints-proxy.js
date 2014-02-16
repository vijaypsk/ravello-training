'use strict';

angular.module('trng.proxies').factory('trng.proxies.BlueprintsProxy', [
    '$http',
    '$q',
    'app.config',
    function($http, $q, config) {
        return {
            getAllBlueprints: function() {
                return $http.get(config.baseUrl + '/rest/blueprints');
            }
        };
    }
]);
