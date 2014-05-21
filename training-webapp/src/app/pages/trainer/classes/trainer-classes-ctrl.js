'use strict';


angular.module('trng.trainer.training.classes').controller('trainerClassesController', [
    '$scope',
    '$rootScope',
    '$state',
    '$log',
    '$dialogs',
    'ClassModel',
    'ClassesService',
    'CourseModel',
    'DateUtil',
    'classes',
    function ($scope, $rootScope, $state, $log, $dialogs, ClassModel, ClassesService, CourseModel, DateUtil, classes) {

        $scope.init = function () {
            $scope.initClassesDataGrid();
            $scope.getAllClasses();
        };

        $scope.getAllClasses = function () {
            $scope.classes = classes;
        };

        $scope.initClassesColumns = function () {
            $scope.classesColumns = [
                {
                    field: 'name',
                    displayName: 'Name'
                },
                {
                    field: 'course.name',
                    displayName: 'Course'
                },
                {
                    field: 'startDate',
                    displayName: 'Start date',
                    cellFilter: 'date:\'' + DateUtil.angular.dateTimeFormat + '\''
                },
                {
                    field: 'endDate',
                    displayName: 'End date',
                    cellFilter: 'date:\'' + DateUtil.angular.dateTimeFormat + '\''
                },
                {
                    displayName: 'Actions',
                    width: '25%',
                    cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="editClass(row)">' +
                            '<i class="fa fa-pencil" /> Edit' +
                        '</a>' +
                        '<a href="" class="btn btn-small btn-link" ng-click="monitorClass(row)">' +
                            '<i class="fa fa-desktop" /> Applications' +
                        '</a>' +
                        '<a href="" class="btn btn-small btn-link" ng-click="deleteClass(row)">' +
                            '<i class="fa fa-trash-o" /> Delete' +
                        '</a>'
                }
            ];
        };

        $scope.initClassesDataGrid = function () {
            $scope.selectedClasses = [];

            $scope.initClassesColumns();

            $scope.classesDataGrid = {
                data: 'classes',
                columnDefs: $scope.classesColumns,
                selectedItems: $scope.selectedClasses,
                showSelectionCheckbox: true,
                selectWithCheckboxOnly: true
            };
        };

        $scope.addClass = function () {
            $state.go('^.single-class.add-class');
        };

        $scope.editClass = function (theClass) {
            var classId = theClass.getProperty('id');
            $state.go('^.single-class.edit-class', {classId: classId});
        };

        $scope.monitorClass = function (theClass) {
            var classId = theClass.getProperty('id');
            $state.go('^.single-class.monitor-class', {classId: classId});
        };

        $scope.deleteClasses = function () {
            var dialog = $dialogs.confirm("Delete classes", "Are you sure you want to delete the classes?");
            dialog.result.then(function(result) {
                _.forEach($scope.selectedClasses, function(currentClass) {
                    ClassModel.deleteClassById($scope.classes, currentClass.id);
                });
            });
        };

        $scope.deleteClass = function(classToDelete) {
            var dialog = $dialogs.confirm("Delete class", "Are you sure you want to delete the class?");
            dialog.result.then(function(result) {
                var classId = classToDelete.getProperty('id');
                ClassModel.deleteClassById($scope.classes, classId);
            });
        };

        $scope.init();
    }
]);

