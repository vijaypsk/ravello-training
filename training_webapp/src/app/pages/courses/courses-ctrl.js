'use strict';


angular.module('trng.courses.courses').controller('coursesController', [
    '$scope',
    '$state',
    '$log',
    'trng.courses.courses.CourseModel',
    function ($scope, $state, $log,  courseModel) {

        $scope.init = function() {
            $scope.coursesAvailable = false;
            $scope.selectedCourses = [];

            $scope.initCourses();
            $scope.initCoursesDataGrid();
        };

        $scope.initCourses = function() {
            $scope.courses = [];
            courseModel.getAllCourses().
                then(function(result) {
                    _.forEach(result, function(currentCourse) {
                        $scope.courses.push(_.cloneDeep(currentCourse));
                    });

                    $scope.coursesAvailable = true;
                });
        };

        $scope.initCourseColumns = function () {
            $scope.coursesColumns = [
                {
                    field: 'name',
                    displayName: 'Name'
                },
                {
                    field: 'description',
                    displayName: 'Description'
                },
                {
                    displayName: 'Actions',
                    cellTemplate: '<a href="" class="btn btn-small btn-link" ng-click="editCourse(row)"><i class="icon-edit" /> Edit</a><a href="" class="btn btn-small btn-link" ng-click="deleteCourse(row)"><i class="icon-trash" /> Delete</a>'
                }
            ];
        };

        $scope.initCoursesDataGrid = function () {
            $scope.initCourseColumns();
            $scope.coursesDataGrid = {
                data: 'courses',
                columnDefs: $scope.coursesColumns,
                selectedItems: $scope.selectedCourses,
                showSelectionCheckbox: true,
                selectWithCheckboxOnly: true
            };
        };

        $scope.addCourse = function() {
            courseModel.setCurrentCourse({});
            $state.go('^.single-course');
        };

        $scope.editCourse = function(courseToEdit) {
            var courseId = courseToEdit.getProperty('id');
            courseModel.setCurrentCourseById(courseId);
            $state.go('^.single-course', {courseId: courseId});
        };

        $scope.deleteCourse = function(courseToDelete) {
            var courseId = courseToDelete.getProperty('id');
            courseModel.deleteCourseById($scope.courses, courseId);
        };

        $scope.deleteCourses = function() {
            _.forEach($scope.selectedCourses, function(currentCourse) {
                courseModel.deleteCourseById($scope.courses, currentCourse['id']);
            });
        };

        $scope.init();
    }
]);
