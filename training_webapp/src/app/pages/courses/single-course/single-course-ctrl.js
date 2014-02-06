'use strict';


angular.module('trng.courses.courses').controller('singleCourseController', [
    '$scope',
    '$state',
    '$stateParams',
    '$log',
    'trng.courses.courses.CourseModel',
    function ($scope, $state, $stateParams, $log, courseModel) {

        var courseId = undefined;

        $scope.init = function () {
            courseId = $stateParams['courseId'];

            $scope.initCourse();
            $scope.initBlueprintsDataGrid();
        };

        $scope.initCourse = function() {
            if (!courseId) {
                courseModel.setCurrentCourse({});
            }

            courseModel.getCurrentCourse(courseId).
                then(function(result) {
                    $scope.currentCourse = result;
                });

            $scope.selectedBlueprints = [];
        };

        $scope.initBlueprintsColumns = function () {
            $scope.blueprintsColumns = [
                {
                    field: 'name',
                    displayName: 'name'
                },
                {
                    field: 'description',
                    displayName: 'description'
                },
                {
                    field: 'creationTime',
                    displayName: 'Creation time'
                },
                {
                    field: 'owner',
                    displayName: 'owner'
                },
                {
                    field: 'displayForStudents',
                    displayName: 'Display name for students'
                },
                {
                    displayName: 'Actions',
                    cellTemplate: '<a href="" class="btn btn-small btn-link" ng-click="deleteBlueprint(row)"><i class="icon-trash" /> Delete</a>'
                }
            ];
        };

        $scope.initBlueprintsDataGrid = function () {
            $scope.initBlueprintsColumns();
            $scope.blueprintsDataGrid = {
                data: 'currentCourse.blueprints',
                columnDefs: $scope.blueprintsColumns,
                selectedItems: $scope.selectedBlueprints,
                showSelectionCheckbox: true,
                selectWithCheckboxOnly: true
            };
        };

        $scope.addBlueprint = function() {
        };

        $scope.deleteBlueprints = function() {
            _.forEach($scope.selectedBlueprints, function(currentBp) {
                courseModel.deleteBlueprintById($scope.currentCourse, currentBp['id']);
            });
        };

        $scope.deleteBlueprint = function(bpToDelete) {
            var bpId = bpToDelete.getProperty('id');
            courseModel.deleteBlueprintById($scope.currentCourse, bpId);
        };

        $scope.save = function() {
            courseModel.save($scope.currentCourse);
            courseModel.setCurrentCourse(null);
            $state.go('^.courses');
        };

        $scope.cancel = function() {
            courseModel.setCurrentCourse(null);
            $state.go('^.courses');
        };

        $scope.init();
    }
]);
