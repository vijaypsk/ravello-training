'use strict';


angular.module('trng.courses.classes').controller('classesController', [
    '$scope',
    '$state',
    '$log',
    'trng.courses.classes.ClassModel',
    'trng.services.ClassesService',
    'trng.courses.courses.CourseModel',
    function ($scope, $state, $log, classModel, classesService, courseModel) {

        $scope.init = function () {
            $scope.classes = classModel.classes;
            $scope.selectedClasses = [];
            $scope.classesAvailable = false;

            $scope.initClassesDataGrid();
            $scope.getAllClasses();
        };

        $scope.getAllClasses = function () {
            var promise = classModel.getAllClasses();

            // First get the classes.
            promise.then(function (result) {
                $scope.classesAvailable = true;
            });
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
                    cellFilter: 'date:"dd/MM/yyyy"'
                },
                {
                    field: 'endDate',
                    displayName: 'End date',
                    cellFilter: 'date:"dd/MM/yyyy"'
                },
                {
                    displayName: 'Actions',
                    cellTemplate: '<a href="" class="btn btn-small btn-link" ng-click="editClass(row)"><i class="icon-edit" /> Edit</a><a href="" class="btn btn-small btn-link" ng-click="deleteClass(row)"><i class="icon-trash" /> Delete</a>'
                }
            ];
        };

        $scope.initClassesDataGrid = function () {
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
            $state.go('^.single-class');
        };

        $scope.editClass = function (classToEdit) {
            var classId = classToEdit.getProperty('id');
            $state.go('^.single-class', {classId: classId});
        };

        $scope.deleteClasses = function () {
            classModel.deleteClasses($scope.classesDataGrid.selectedItems);
        };

        $scope.deleteClass = function(classToDelete) {
            var classId = classToDelete.getProperty('id');
            classModel.deleteClassById(classId);
        };

        $scope.init();
    }]);
