'use strict';


angular.module('trng.trainer.training.courses').controller('trainerSingleCourseController', [
    '$scope',
    '$state',
    '$stateParams',
    '$window',
    '$modal',
    '$log',
    'CourseModel',
    'BlueprintsService',
    'DateUtil',
    'currentCourse',
    function ($scope, $state, $stateParams, $window, $modal, $log, CourseModel, BlueprintsService, DateUtil, currentCourse) {

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
                    displayName: 'Creation time',
                    cellFilter: 'date:\'' + DateUtil.angular.dateTimeFormat + '\''
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
                            '<i class="fa fa-trash-o" /> Delete' +
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
            BlueprintsService.getAllBlueprints().then(function(blueprints) {
                var modalInstance = $modal.open({
                    templateUrl: 'app/pages/trainer/courses/single-course/trainer-add-blueprints.html',
                    controller: 'trainerAddBlueprintsController',
                    windowClass: 'allBlueprintsPopup',
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
                    _.forEach(result, function(newSelectedBp) {
                        var matching = _.find($scope.currentCourse['blueprints'], function(existingBp) {
                            return (existingBp && newSelectedBp &&
                                existingBp.hasOwnProperty('id') && newSelectedBp.hasOwnProperty('id') &&
                                existingBp['id'] === newSelectedBp['id']);
                        });

                        if (!$scope.currentCourse['blueprints']) {
                            $scope.currentCourse['blueprints'] = [];
                        }

                        if (!matching) {
                            var newBp = _.cloneDeep(newSelectedBp);
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
            });
        };

        $scope.deleteBlueprints = function() {
            _.forEach($scope.selectedBlueprints, function(currentBp) {
                CourseModel.deleteBlueprintById($scope.currentCourse, currentBp['id']);
            });
        };

        $scope.deleteBlueprint = function(bpToDelete) {
            var bpId = bpToDelete.getProperty('id');
            CourseModel.deleteBlueprintById($scope.currentCourse, bpId);
        };

        $scope.save = function() {
            return CourseModel.save($scope.currentCourse).then(
                function(result) {
                    $state.go('^.courses');
                }
            );
        };

        $scope.back = function() {
            $window.history.back();
        };

        $scope.init();
    }
]);
