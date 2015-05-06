'use strict';

angular.module('trng.admin.trainers').controller('adminTrainersController', [
    '$log',
    '$scope',
    '$state',
    '$dialogs',
    'StatesNames',
    'TrainersService',
    'trainers',
    function($log, $scope, $state, $dialogs, StatesNames, TrainersService, trainers) {

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
                    width: '180px',
                    cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="editTrainer(row)">' +
                            '<i class="fa fa-pencil" /> Edit' +
                        '</a>' +
                        '<a href="" class="btn btn-small btn-link" ng-click="deleteTrainer(row)">' +
                            '<i class="fa fa-trash-o" /> Delete' +
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
                selectWithCheckboxOnly: true,
                enableHighlighting: true
            };
        };

        $scope.addTrainer = function() {
            $state.go(StatesNames.admin.singleTrainer.name);
        };

        $scope.editTrainer = function(trainerToEdit) {
            var trainerId = trainerToEdit.getProperty('id');
            $state.go(StatesNames.admin.singleTrainer.name, {trainerId: trainerId});
        };

        $scope.deleteTrainer = function(trainerToDelete) {
            var dialog = $dialogs.confirm("Delete trainer", "Are you sure you want to delete the trainer?");
            return dialog.result.then(function(result) {
                var trainerId = trainerToDelete.getProperty('id');
                return TrainersService.deleteTrainer(trainerId);
            });
        };

        $scope.deleteTrainers = function() {
            var dialog = $dialogs.confirm("Delete trainers", "Are you sure you want to delete the trainers?");
            return dialog.result.then(function(result) {
                return _.map($scope.selectedTrainers, function(trainer) {
                    return TrainersService.deleteTrainer(trainer.id);
                });
            });
        };

        $scope.init();
    }
]);

