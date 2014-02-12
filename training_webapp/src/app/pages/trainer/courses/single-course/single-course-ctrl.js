'use strict';


angular.module('trng.courses.courses').controller('singleCourseController', [
    '$scope',
    '$state',
    '$stateParams',
    '$window',
    '$modal',
    '$log',
    'trng.courses.courses.CourseModel',
    'currentCourse',
    'blueprints',
    function ($scope, $state, $stateParams, $window, $modal, $log, courseModel, currentCourse, blueprints) {

        $scope.init = function () {
            $scope.initCourse();
            $scope.initBlueprintsDataGrid();
        };

        $scope.initCourse = function() {
            $scope.currentCourse = currentCourse;
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
                    displayName: 'Display name for students',
                    enableCellEdit: true,
                    width: '35%'
                },
                {
                    displayName: 'Actions',
                    cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="deleteBlueprint(row)">' +
                            '<i class="icon-trash" /> Delete' +
                        '</a>'
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
            var modalInstance = $modal.open({
                templateUrl: 'app/pages/trainer/courses/single-course/add-blueprints.html',
                controller: 'addBlueprintsController',
                resolve: {
                    allBlueprints: function() {
                        return blueprints;
                    },
                    courseBlueprints: function() {
                        return $scope.currentCourse['blueprints'];
                    }
                }
            });

            modalInstance.result.then(function(result) {
                _.forEach(result, function(newlySelectedBp) {
                    var matching = _.find($scope.currentCourse['blueprints'], function(existingBp) {
                        return (existingBp && newlySelectedBp &&
                            existingBp.hasOwnProperty('id') && newlySelectedBp.hasOwnProperty('id') &&
                            existingBp['id'] === newlySelectedBp['id']);
                    });

                    if (!matching) {
                        var newBp = _.cloneDeep(newlySelectedBp);
                        newBp['displayForStudents'] = newBp['name'];
                        $scope.currentCourse['blueprints'].push(newBp);
                    }
                });

                _.remove($scope.currentCourse['blueprints'], function(existingBp) {
                    var matching = _.find(result, function(newlySelectedBp) {
                        return (existingBp && newlySelectedBp &&
                            existingBp.hasOwnProperty('id') && newlySelectedBp.hasOwnProperty('id') &&
                            existingBp['id'] === newlySelectedBp['id']);
                    });

                    return !matching;
                });
            });
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
        };

        $scope.back = function() {
            $window.history.back();
        };

        $scope.init();
    }
]);

var singleCourseResolver = {
    currentCourse: ['$q', '$stateParams', 'trng.courses.courses.CourseModel',
        function ($q, $stateParams, courseModel) {

            var courseId = $stateParams['courseId'];;

            if (courseId) {
                return courseModel.getAllCourses().then(function (courses) {
                        return _.cloneDeep(_.find(courses, function (course) {
                            return (course && course.hasOwnProperty('id') &&
                                course['id'] === courseId);
                        }));
                    });
            }

            var deferred = $q.defer();
            deferred.resolve({});
            return deferred.promise;
        }
    ],

    blueprints: ['trng.services.BlueprintsService',
        function(blueprintsService) {
            return blueprintsService.getAllBlueprints();
        }
    ]
}