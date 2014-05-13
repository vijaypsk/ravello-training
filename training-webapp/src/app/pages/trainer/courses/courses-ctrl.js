'use strict';


angular.module('trng.trainer.training.courses').controller('coursesController', [
    '$scope',
    '$state',
    '$log',
    '$dialogs',
    'trng.trainer.training.courses.CourseModel',
    'courses',
    function ($scope, $state, $log, $dialogs,  courseModel, courses) {

        $scope.init = function() {
            $scope.initCourses();
            $scope.initCoursesDataGrid();
        };

        $scope.initCourses = function() {
            $scope.courses = courses;
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
                    cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="editCourse(row)">' +
                            '<i class="fa fa-pencil" /> Edit' +
                        '</a>' +
                        '<a href="" class="btn btn-small btn-link" ng-click="deleteCourse(row)">' +
                            '<i class="fa fa-trash-o" /> Delete' +
                        '</a>'
                }
            ];
        };

        $scope.initCoursesDataGrid = function () {
            $scope.selectedCourses = [];

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
            $state.go('^.single-course');
        };

        $scope.editCourse = function(courseToEdit) {
            var courseId = courseToEdit.getProperty('id');
            $state.go('^.single-course', {courseId: courseId});
        };

        $scope.deleteCourse = function(courseToDelete) {
            var dialog = $dialogs.confirm("Delete courses", "Are you sure you want to delete the courses?");
            dialog.result.then(function(result) {
                var courseId = courseToDelete.getProperty('id');
                courseModel.deleteCourseById($scope.courses, courseId);
            });
        };

        $scope.deleteCourses = function() {
            var dialog = $dialogs.confirm("Delete course", "Are you sure you want to delete the course?");
            dialog.result.then(function(result) {
                _.forEach($scope.selectedCourses, function(currentCourse) {
                    courseModel.deleteCourseById($scope.courses, currentCourse.id);
                });
            });
        };

        $scope.init();
    }
]);

var coursesResolver = {
    courses: ['$q', 'trng.trainer.training.courses.CourseModel', function($q, courseModel) {
        return courseModel.getAllCourses().
            then(function(result) {
                return _.cloneDeep(result);
            });
    }]
};
