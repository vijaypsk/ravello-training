'use strict';


angular.module('trng.courses.classes').controller('singleClassController', [
    '$scope',
    '$state',
    '$stateParams',
    '$log',
    'trng.courses.classes.ClassModel',
    'trng.services.ClassesService',
    'trng.courses.courses.CourseModel',
    'trng.common.utils.DateUtil',
    function ($scope, $state, $stateParams, $log, classModel, classesService, courseModel, dateUtil) {

        var classId = undefined;

        $scope.init = function () {
            classId = $stateParams['classId'];

            $scope.initStudent();
//            $scope.initCourseOptions();
            $scope.initDates();
            $scope.initBpPermissionsColumns();
            $scope.initStudentsDataGrid();
        };

        $scope.initStudent = function() {
            if (classId) {
                classModel.getClassesById(classId).then(function(result) {
                    $scope.currentClass = result;
                    $scope.initCourseOptions();
                });
            } else {
                $scope.currentClass = {};
                $scope.initCourseOptions();
            }

            $scope.selectedStudents = [];
        };

        $scope.initCourseOptions = function() {
            $scope.courses = courseModel.courses;
            courseModel.getAllCourses().then(function(result) {
                $scope.currentClass.course = _.find($scope.courses, function(currentCourse) {
                   return currentCourse.hasOwnProperty('id') && $scope.currentClass.hasOwnProperty('course') &&
                       currentCourse['id'] === $scope.currentClass.course['id'];
                });

                if (_.isUndefined($scope.currentClass.course)) {
                    $scope.currentClass.course = _.first($scope.courses);
                }
            });
        };

        $scope.initDates = function() {
            $scope.dateFormat = dateUtil.dateFormat;

            $scope.dateOptions = {
                dateFormat: $scope.dateFormat,
                showOn: 'button'
            };
        };

        $scope.initBpPermissionsColumns = function () {
            $scope.bpPermissionsColumns = [
                {
                    field: 'username',
                    displayName: 'Student email'
                },
                {
                    field: 'ravelloUsername',
                    displayName: 'Ravello user'
                },
                {
                    displayName: 'Actions',
                    cellTemplate: '<a href="" class="btn btn-small btn-link" ng-click="editStudent(row)"><i class="icon-edit" /> Edit</a><a href="" class="btn btn-small btn-link" ng-click="deleteStudent(row)"><i class="icon-trash" /> Delete</a>'
                }
            ];
        };

        $scope.initStudentsDataGrid = function () {
            $scope.initBpPermissionsColumns();
            $scope.studentsDataGrid = {
                data: 'currentClass.students',
                columnDefs: $scope.bpPermissionsColumns,
                selectedItems: $scope.selectedStudents,
                showSelectionCheckbox: true,
                selectWithCheckboxOnly: true
            };
        };

        $scope.addStudent = function() {
            $state.go('^.single-student', {classId: $scope.currentClass['id']});
        };

        $scope.editStudent = function(studentToEdit) {
            var studentId = studentToEdit.getProperty('id');
            $state.go('^.single-student', {classId: $scope.currentClass['id'], studentId: studentId});
        };

        $scope.deleteStudents = function() {
            classModel.deleteStudents($scope.currentClass, $scope.studentsDataGrid.selectedItems);
        };

        $scope.deleteStudent = function(studentToDelete) {
            var studentId = studentToDelete.getProperty('id');
            classModel.deleteStudent($scope.currentClass, studentId);
        };

        $scope.init();
    }
]);
