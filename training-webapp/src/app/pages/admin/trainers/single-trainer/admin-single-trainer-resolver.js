'use strict';

var adminSingleTrainerResolver = {
    currentTrainer: [
        '$q',
        '$stateParams',
        'TrainersService',
        function($q, $stateParams, TrainersService) {
            var trainerId = $stateParams.trainerId;

            if (!trainerId) {
                return $q.when({});
            }

            return TrainersService.getTrainerById(trainerId).then(
                function(trainer) {
                    return _.cloneDeep(trainer);
                }
            );
        }
    ]
};
