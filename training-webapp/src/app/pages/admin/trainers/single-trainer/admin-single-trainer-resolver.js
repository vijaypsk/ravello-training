'use strict';

var adminSingleTrainerResolver = {
    currentTrainer: [
        '$q',
        '$stateParams',
        'AdminTrainerModel',
        function($q, $stateParams, AdminTrainerModel) {
            var trainerId = $stateParams.trainerId;

            if (!trainerId) {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            }

            return AdminTrainerModel.getAllTrainers().then(function(trainers) {
                return _.find(trainers, function(currentTrainer) {
                    return currentTrainer.id == trainerId;
                });
            });
        }
    ]
};
