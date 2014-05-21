'use strict';


angular.module('trng.trainer.training.classes').controller('trainerSingleClassEditController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$log',
    '$window',
    '$dialogs',
    'StatesNames',
    'ClassesService',
    'DateUtil',
    'currentClass',
    'courses',
    function ($scope, $rootScope, $state, $stateParams, $log, $window, $dialogs, StatesNames, ClassesService,
              DateUtil, currentClass, courses) {

        $scope.init = function () {
            $scope.apps = [];
            $scope.courses = courses;

            $scope.initClass();
            $scope.initDates();
            $scope.initStudentsDataGrid();
        };

        $scope.initClass = function() {
            $scope.currentClass = currentClass;

            $scope.isRavelloCredentials =
                (!$scope.currentClass.ravelloCredentials ||
                (!$scope.currentClass.ravelloCredentials.username && !$scope.currentClass.ravelloCredentials.password));
        };

        $scope.initDates = function() {
            $scope.dateFormat = DateUtil.angular.dateFormat;
            $scope.timeFormat = DateUtil.angular.timeFormat;
            $scope.dateTimeFormat = DateUtil.angular.dateTimeFormat;
        };

        $scope.initStudentsColumns = function () {
            $scope.studentsColumns = [
                {
                    field: 'user.fullName',
                    displayName: 'Full name'
                },
                {
                    field: 'user.username',
                    displayName: 'Username'
                },
                {
                    displayName: 'Actions',
                    cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="editStudent(row)">' +
                            '<i class="fa fa-pencil" /> Edit' +
                        '</a>' +
                        '<a href="" class="btn btn-small btn-link" ng-click="deleteStudent(row)">' +
                            '<i class="fa fa-trash-o" /> Delete' +
                        '</a>'
                }
            ];
        };

        $scope.initStudentsDataGrid = function () {
            $scope.selectedStudents = [];

            $scope.initStudentsColumns();
            $scope.studentsDataGrid = {
                data: 'currentClass.students',
                columnDefs: $scope.studentsColumns,
                selectedItems: $scope.selectedStudents,
                showSelectionCheckbox: false,
                selectWithCheckboxOnly: true
            };
        };

        $scope.addStudent = function() {
            $state.go(StatesNames.trainer.training.singleClass.singleStudent.name, {classId: $scope.currentClass.id});
        };

        $scope.editStudent = function(studentToEdit) {
            var studentId = studentToEdit.getProperty('id');
            $state.go(StatesNames.trainer.training.singleClass.singleStudent.name, {classId: $scope.currentClass.id, studentId: studentId});
        };

        $scope.deleteStudent = function(studentToDelete) {
            var dialog = $dialogs.confirm("Delete student", "Are you sure you want to delete the student?");
            dialog.result.then(function(result) {
                var studentId = studentToDelete.getProperty('id');
                _.remove($scope.currentClass.students, {id: studentId});
            });
        };

        $scope.saveClass = function() {
            return ClassesService.saveOrUpdate($scope.currentClass).then(
                function(result) {
                    $state.go(StatesNames.trainer.training.classes.name);
                }
            );
        };

        $scope.back = function() {
            $window.history.back();
        };

        $scope.addToEdit = function() {
            $state.go(StatesNames.trainer.training.singleClass.editClass.name);
        };

        $scope.init();
    }
]);

