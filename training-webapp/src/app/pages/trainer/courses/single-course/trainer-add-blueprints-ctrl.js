'use strict';

angular.module('trng.trainer.training.courses').controller('trainerAddBlueprintsController', [
    '$scope',
    '$log',
    '$modalInstance',
    'DateUtil',
    'allBlueprints',
    'courseBlueprints',
    function ($scope, $log, $modalInstance, DateUtil, allBlueprints, courseBlueprints) {

		// Deep-clone the original blueprints collections, so that the controller can alter it as will, without affecting the
		// original.
		var allBlueprintsCopy = _.cloneDeep(allBlueprints);

        $scope.init = function () {
			$scope.viewModel = {
				searchText: ''
			};

            $scope.initBlueprints();
            $scope.initBlueprintsDataGrid();
        };

        $scope.initBlueprints = function () {
			// Shallow-clone the collection of blueprints, as the datagridBlueprints collection will change throughout the
			// life of this controller, while the bps collection should remain intact.
            $scope.datagridBlueprints = _.clone(allBlueprintsCopy);

            $scope.courseBlueprints = _.map(courseBlueprints, function (selectedBp) {
				return _.find($scope.datagridBlueprints, {id: selectedBp.id});
            });
        };

        $scope.initBlueprintsColumns = function () {
            $scope.allBlueprintsColumns = [
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
                }
            ];
        };

        $scope.initBlueprintsDataGrid = function () {
            $scope.initBlueprintsColumns();
            $scope.allBlueprintsDataGrid = {
                data: 'datagridBlueprints',
                columnDefs: $scope.allBlueprintsColumns,
                selectedItems: $scope.courseBlueprints,
                showSelectionCheckbox: true,
                selectWithCheckboxOnly: true,
                enableColumnResize: true,
                enableHighlighting: true
            };
        };

        $scope.ok = function () {
            $modalInstance.close($scope.courseBlueprints);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

		$scope.filterBlueprints = function() {
			if (!$scope.viewModel.searchText) {
				$scope.datagridBlueprints = _.clone(allBlueprintsCopy);
				return;
			}

			var filteredBps = _.filter(allBlueprintsCopy, function(bp) {
				return ((bp.name && bp.name.toLowerCase().indexOf($scope.viewModel.searchText.toLowerCase()) != -1) ||
					(bp.description && bp.description.toLowerCase().indexOf($scope.viewModel.searchText.toLowerCase()) != -1) ||
					(bp.owner && bp.owner.toLowerCase().indexOf($scope.viewModel.searchText.toLowerCase()) != -1));
			});

			$scope.datagridBlueprints = filteredBps;
		};

        $scope.init();
    }
]);