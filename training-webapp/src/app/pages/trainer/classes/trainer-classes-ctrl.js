'use strict';


angular.module('trng.trainer.training.classes').controller('trainerClassesController', [
    '$scope',
    '$rootScope',
    '$state',
    '$log',
    '$q',
    '$dialogs',
    'StatesNames',
    'ClassesService',
    'AppsService',
    'DateUtil',
    'classes',
    function ($scope, $rootScope, $state, $log, $q, $dialogs, StatesNames, ClassesService, AppsService, DateUtil, classes) {

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
                    field: 'active',
                    displayName: 'Active',
                    width: '60px',
                    cellTemplate:
                        '<div class="ngCellText text-center class-row-active-cell" ng-class="col.colIndex()">' +
                            '<span ng-cell-text class="fa" ng-class="{\'active fa-check\': row.getProperty(col.field), \'not-active fa-times\': !row.getProperty(col.field)}"></span>' +
                        '</div>'
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
            $state.go(StatesNames.trainer.training.singleClass.addClass.name);
        };

        $scope.editClass = function (theClass) {
            var classId = theClass.getProperty('id');
            $state.go(StatesNames.trainer.training.singleClass.editClass.name, {classId: classId});
        };

        $scope.monitorClass = function (theClass) {
            var classId = theClass.getProperty('id');
            $state.go(StatesNames.trainer.training.singleClass.monitorClass.name, {classId: classId});
        };

        $scope.deleteClasses = function () {
            var dialog = $dialogs.confirm("Delete classes", "Are you sure you want to delete the classes?");
            return dialog.result.then(function(result) {
                return _.map($scope.selectedClasses, function(currentClass) {
                    return deleteClassById(currentClass);
                });
            });
        };

        $scope.deleteClass = function(classRow) {
            var dialog = $dialogs.confirm("Delete class", "Are you sure you want to delete the class?");
            return dialog.result.then(function(result) {
                var classId = classRow.getProperty('id');
                var theClass = _.find($scope.classes, {id: classId});
                return deleteClassById(theClass);
            });
        };

        /* --- Private functions --- */

        function fetchClasses() {
            return ClassesService.getAllClasses().then(
                function(classes) {
                    $scope.classes = _.cloneDeep(classes);
                    return classes;
                }
            );
        }

        function deleteClassById(theClass) {
            return ClassesService.deleteById(theClass.id).then(
                function(result) {
                    return fetchClasses();
                }
            );
        }

        $scope.init();
    }
]);

