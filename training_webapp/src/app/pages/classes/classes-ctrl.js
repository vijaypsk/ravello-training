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
            $scope.classes = [];
            $scope.selectedClasses = [];
            $scope.classesAvailable = false;

            $scope.initClassesDataGrid();
            $scope.getAllClasses();
        };

        $scope.getAllClasses = function () {
            classModel.getAllClasses().
                then(function (result) {
                    _.forEach(result, function(currentClass) {
                        $scope.classes.push(_.cloneDeep(currentClass));
                    });
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
            $state.go('^.single-class.add-class');
        };

        $scope.editClass = function (classToEdit) {
            var classId = classToEdit.getProperty('id');

            classModel.getClassById(classId).then(function(result) {
                $state.go('^.single-class.edit-class', {classId: classId});
            });
        };

        $scope.deleteClasses = function () {
            _.forEach($scope.selectedClasses, function(currentClass) {
                classModel.deleteClassById($scope.classes, currentClass['id']);
            });
        };

        $scope.deleteClass = function(classToDelete) {
            var classId = classToDelete.getProperty('id');
            classModel.deleteClassById($scope.classes, classId);
        };

        $scope.init();
    }]);
