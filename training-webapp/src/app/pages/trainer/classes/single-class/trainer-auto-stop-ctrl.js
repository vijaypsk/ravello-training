'use strict';

angular.module('trng.trainer.training.classes').controller('trainerAutoStopController', [
	'$scope',
	'$log',
	'$modalInstance',
	function($scope, $log, $modalInstance) {

		$scope.init = function() {
			$scope.viewModel = {
				autoStopMinutes: 120
			};
		};

		$scope.ok = function() {
			$modalInstance.close($scope.viewModel.autoStopMinutes);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};

		$scope.init();
	}
]);