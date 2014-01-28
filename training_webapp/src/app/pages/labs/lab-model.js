'use strict';

(function (angular) {
    angular.module('trng.labs.labs').factory('trng.labs.labs.LabModel', [
        '$q', '$log', 'trng.services.LabsService',
        function ($q, $log, labsService) {

            var labsLoaded = false;

            var labs = [];

            var service = {

                labs: function() {
                    return labs;
                },

                getAllLabs: function () {
                    if (labsLoaded) {
                        var deferred = $q.defer();
                        var promise = deferred.promise;
                        deferred.resolve(labs);
                        return promise;
                    }

                    return labsService.getAllLabs().then(function(result) {
                        for (var i = 0; i < result.length; i++) {
                            labs.push(result[i]);
                        }

                        labsLoaded = true;

                        return labs;
                    });
                }
            };

            return service;
        }]);
})(angular);