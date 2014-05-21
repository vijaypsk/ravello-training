'use strict';

var adminTrainerResolver = {
    trainers: [
        'AdminTrainerModel',
        function(AdminTrainerModel) {
            return _.cloneDeep(AdminTrainerModel.getAllTrainers());
        }
    ]
};
