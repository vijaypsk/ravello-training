'use strict';


angular.module('trng.trainer.training.classes').controller('classesController', [
    '$scope',
    '$rootScope',
    '$state',
    '$log',
    '$dialogs',
    'trng.trainer.training.classes.ClassModel',
    'trng.services.ClassesService',
    'trng.trainer.training.courses.CourseModel',
    'trng.common.utils.DateUtil',
    'classes',
    function ($scope, $rootScope, $state, $log, $dialogs, classModel, classesService, courseModel, dateUtil, classes) {

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
                    cellFilter: 'date:\'' + dateUtil.dateTimeFormat + '\''
                },
                {
                    field: 'endDate',
                    displayName: 'End date',
                    cellFilter: 'date:\'' + dateUtil.dateTimeFormat + '\''
                },
                {
                    displayName: 'Actions',
                    cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="editClass(row)">' +
                            '<i class="icon-pencil" /> Edit' +
                        '</a>' +
                        '<a href="" class="btn btn-small btn-link" ng-click="deleteClass(row)">' +
                            '<i class="icon-trash" /> Delete' +
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

        $scope.editClass = function (classToEdit) {
            var classId = classToEdit.getProperty('id');

            classModel.getClassById(classId).then(function(result) {
                $state.go('^.single-class.edit-class', {classId: classId});
            });
        };

        $scope.deleteClasses = function () {
            var dialog = $dialogs.confirm("Delete classes", "Are you sure you want to delete the classes?");
            dialog.result.then(function(result) {
                _.forEach($scope.selectedClasses, function(currentClass) {
                    classModel.deleteClassById($scope.classes, currentClass.id);
                });
            });
        };

        $scope.deleteClass = function(classToDelete) {
            var dialog = $dialogs.confirm("Delete class", "Are you sure you want to delete the class?");
            dialog.result.then(function(result) {
                var classId = classToDelete.getProperty('id');
                classModel.deleteClassById($scope.classes, classId);
            });
        };

        $scope.init();
    }
]);

var classesResolver = {
    classes: ['$q', 'trng.trainer.training.classes.ClassModel',
        function($q, classModel) {
            return classModel.getAllClasses().
                then(function (result) {
                    return _.cloneDeep(result);
                });
        }
    ]
};
