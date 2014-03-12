'use strict';

angular.module('trng.admin.trainers').controller('adminTrainersController', [
    '$log',
    '$scope',
    '$state',
    '$dialogs',
    'trng.admin.trainers.trainersModel',
    'trainers',
    function($log, $scope, $state, $dialogs, trainersModel, trainers) {

        $scope.init = function() {
            $scope.trainers = trainers;
            $scope.initTrainersDatagrid();
        };

        $scope.initTrainersColumns = function() {
            $scope.trainersColumns = [
                {
                    field: 'fullName',
                    displayName: 'Name'
                },
                {
                    field: 'username',
                    displayName: 'username'
                },
                {
                    displayName: 'Actions',
                    width: '25%',
                    cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="editTrainer(row)">' +
                            '<i class="icon-pencil" /> Edit' +
                        '</a>' +
                        '<a href="" class="btn btn-small btn-link" ng-click="deleteTrainer(row)">' +
                            '<i class="icon-trash" /> Delete' +
                        '</a>'
                }
            ];
        };

        $scope.initTrainersDatagrid = function() {
            $scope.selectedTrainers = [];

            $scope.initTrainersColumns();

            $scope.trainersDataGrid = {
                data: 'trainers',
                columnDefs: $scope.trainersColumns,
                selectedItems: $scope.selectedTrainers,
                showSelectionCheckbox: true,
                selectWithCheckboxOnly: true
            };
        };

        $scope.addTrainer = function() {
            $state.go('^.single-trainer');
        };

        $scope.editTrainer = function(trainerToEdit) {
            var trainerId = trainerToEdit.getProperty('id');
            $state.go('^.single-trainer', {trainerId: trainerId});
        };

        $scope.deleteTrainer = function(trainerToDelete) {
            var dialog = $dialogs.confirm("Delete trainer", "Are you sure you want to delete the trainer?");
            dialog.result.then(function(result) {
                var trainerId = trainerToDelete.getProperty('id');
                trainersModel.deleteTrainer(trainerId);
            });
        };

        $scope.deleteTrainers = function() {
            var dialog = $dialogs.confirm("Delete trainers", "Are you sure you want to delete the trainers?");
            dialog.result.then(function(result) {
                _.forEach($scope.selectedTrainers, function(trainer) {
                    trainersModel.deleteTrainer(trainer.id);
                });
            });
        };

        $scope.init();
    }
]);


var adminTrainerResolver = {
    trainers: [
        'trng.admin.trainers.trainersModel',
        function(trainersModel) {
            return _.cloneDeep(trainersModel.getAllTrainers());
        }
    ]
};
