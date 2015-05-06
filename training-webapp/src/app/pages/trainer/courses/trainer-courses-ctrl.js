'use strict';


angular.module('trng.trainer.training.courses').controller('trainerCoursesController', [
    '$scope',
    '$state',
    '$log',
    '$dialogs',
    '$q',
    'StatesNames',
    'CoursesService',
    'courses',
    function ($scope, $state, $log, $dialogs, $q, StatesNames, CoursesService, courses) {

        /* --- Public functions --- */

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
                    width: '180px',
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
                selectWithCheckboxOnly: true,
                enableColumnResize: true,
                enableHighlighting: true
            };
        };

        $scope.addCourse = function() {
            $state.go(StatesNames.trainer.training.singleCourse.name);
        };

        $scope.editCourse = function(courseToEdit) {
            var courseId = courseToEdit.getProperty('id');
            $state.go(StatesNames.trainer.training.singleCourse.name, {courseId: courseId});
        };

        $scope.deleteCourse = function(courseToDelete) {
            var dialog = $dialogs.confirm("Delete courses", "Are you sure you want to delete the courses?");
            return dialog.result.then(function(result) {
                var courseId = courseToDelete.getProperty('id');
                return CoursesService.deleteById(courseId).then(fetchCourses);
            });
        };

        $scope.deleteCourses = function() {
            var dialog = $dialogs.confirm("Delete course", "Are you sure you want to delete the course?");
            return dialog.result.then(function(result) {
                return $q.all(_.map($scope.selectedCourses, function(currentCourse) {
                    return CoursesService.deleteById(currentCourse.id);
                })).then(fetchCourses);
            });
        };

        /* --- Private functions --- */

        function fetchCourses() {
            return CoursesService.getAllCourses().then(
                function(courses) {
                    $scope.courses = _.cloneDeep(courses);
                }
            );
        }

        /* --- Init --- */

        $scope.init();
    }
]);

