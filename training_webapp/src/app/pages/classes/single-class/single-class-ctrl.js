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
            $scope.initDates();
            $scope.initBpPermissionsColumns();
            $scope.initStudentsDataGrid();
        };

        $scope.initStudent = function() {
            if (!classId) {
                classModel.setCurrentClass({});
            }

            classModel.getCurrentClass(classId).then(function(result) {
                $scope.currentClass = result;
                $scope.matchCourses();
            });

            $scope.selectedStudents = [];
        };

        $scope.matchCourses = function() {
            $scope.courses = courseModel.courses;

            // It's important to make sure the courses are really loaded, since if the user refreshes this
            // view without visiting the previous view first, the course might not be loaded.
            courseModel.getAllCourses().
                then(function(result) {
                    $scope.currentClass['course'] = _.find($scope.courses, function(course) {
                        return (course && course.hasOwnProperty('id') && course['id'] === $scope.currentClass['courseId']);
                    });
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
                    field: 'ravelloCredentials.username',
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

        $scope.save = function() {
            classModel.save($scope.currentClass);
            $state.go('^.classes');
        };

        $scope.cancel = function() {
            $state.go('^.classes');
        };

        $scope.init();
    }
]);
