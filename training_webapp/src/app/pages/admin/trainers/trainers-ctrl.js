'use strict';

angular.module('trng.admin.trainers').controller('adminTrainersController', [
    '$log',
    '$scope',
    '$state',
    'trng.admin.trainers.trainersModel',
    'trainers',
    function($log, $scope, $state, trainersModel, trainers) {

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

        };

        $scope.editTrainer = function(trainerToEdit) {

        };

        $scope.deleteTrainer = function(trainerToDelete) {

        };

        $scope.deleteTrainers = function() {
            _.forEach($scope.selectedTrainers, function(trainer) {
                trainersModel.deleteTrainer(trainer.id);
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
