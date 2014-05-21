'use strict';

var adminTrainerResolver = {
    trainers: [
        'TrainersService',
        function(TrainersService) {
            return TrainersService.getAllTrainers().then(
                function(trainers) {
                    return _.cloneDeep(trainers);
                }
            );
        }
    ]
};
