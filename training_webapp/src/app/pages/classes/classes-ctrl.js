'use strict';


angular.module('trng.courses.classes').controller('classesController', [
    '$scope',
    '$state',
    '$log',
    'trng.courses.classes.ClassModel',
    'trng.services.ClassesService',
    'trng.courses.courses.CourseModel',
    'classes',
    function ($scope, $state, $log, classModel, classesService, courseModel, classes) {

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
    }
]);

var classesResolver = {
    classes: ['$q', 'trng.courses.classes.ClassModel',
        function($q, classModel) {
            return classModel.getAllClasses().
                then(function (result) {
                    return _.cloneDeep(result);
                });
        }
    ]
};
