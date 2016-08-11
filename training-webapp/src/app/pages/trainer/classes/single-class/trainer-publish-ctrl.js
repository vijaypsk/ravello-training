'use strict';

angular.module('trng.trainer.training.classes').controller('trainerPublishController',
	function($scope, $log, $modalInstance, data) {

		function init() {
			$scope.viewModel = {
				startAfterPublish: true,
				groupedApps: []
			};
			var groupedAppsByPublishMethod = _.groupBy(data, function(app) {
				if (app.publishDetails.method === 'PERFORMANCE_OPTIMIZED') {
					return 'on ' + app.publishDetails.location.locationDisplayName;
				} else {
					return "as Cost-optimized";
				}
			});
			_.forOwn(groupedAppsByPublishMethod, function(value, key) {
				$scope.viewModel.groupedApps.push({
					publishedMethod: key,
					apps: value
				});
			});
		}

		$scope.ok = function() {
			$modalInstance.close($scope.viewModel.startAfterPublish);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};

		init();
	}
);