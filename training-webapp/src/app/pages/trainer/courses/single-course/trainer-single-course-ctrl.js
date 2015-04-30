'use strict';


angular.module('trng.trainer.training.courses').controller('trainerSingleCourseController', [
    '$scope',
    '$state',
    '$stateParams',
    '$window',
    '$modal',
    '$log',
    'StatesNames',
    'CoursesService',
    'BlueprintsService',
    'DateUtil',
    'currentCourse',
    function ($scope, $state, $stateParams, $window, $modal, $log, StatesNames, CoursesService, BlueprintsService,
              DateUtil, currentCourse) {

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
                    width: '180px',
                    cellFilter: 'date:\'' + DateUtil.angular.dateTimeFormat + '\''
                },
                {
                    field: 'owner',
                    width: '140px',
                    displayName: 'owner'
                },
                {
                    field: 'displayForStudents',
                    displayName: 'Display name for students',
                    width: '220px',
                    cellTemplate:
                        '<div class="ngCellText" ng-class="col.colIndex()">' +
                            '<div ng-cell-text>' +
                                '<span click-to-edit="row.entity.displayForStudents"></span>' +
                            '</div>' +
                        '</div>'
                },
                {
                    displayName: 'Actions',
                    width: '120px',
                    cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="deleteBlueprint(row)">' +
                            '<i class="fa fa-trash-o" /> Delete' +
                        '</a>'
                }
            ];
        };

        $scope.editDisplayName = function() {
            console.log('editDisplayName');
            if ($scope.textBtnForm) {
                console.log('has textBtnForm');
            }
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
                    windowClass: 'all-blueprints-popup',
                    resolve: {
                        allBlueprints: function() {
                            return blueprints;
                        },
                        courseBlueprints: function() {
                            return $scope.currentCourse.blueprints;
                        }
                    }
                });

                modalInstance.result.then(function(result) {
					$scope.currentCourse.blueprints = _.map(result, function(newBp) {
						var existingBp = _.find($scope.currentCourse.blueprints, {id: newBp.id});
						if (!existingBp) {
							newBp = _.cloneDeep(newBp);
							newBp.displayForStudents = newBp.name;
							return newBp;
						}
						return existingBp;
					});
                });
            });
        };

        $scope.deleteBlueprints = function() {
            _.forEach($scope.selectedBlueprints, function(currentBp) {
                _.remove($scope.currentCourse.blueprints, {id: currentBp.id});
            });
        };

        $scope.deleteBlueprint = function(bpToDelete) {
            var bpId = bpToDelete.getProperty('id');
            _.remove($scope.currentCourse.blueprints, {id: bpId});
        };

        $scope.save = function() {
            return CoursesService.saveOrUpdate($scope.currentCourse).then(
                function(persistedCourse) {
                    $state.go(StatesNames.trainer.training.courses.name);
                }
            );
        };

        $scope.back = function() {
            $window.history.back();
        };

        $scope.init();
    }
]);
