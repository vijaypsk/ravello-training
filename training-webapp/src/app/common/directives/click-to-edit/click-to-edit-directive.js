'use strict';

angular.module('trng.common.directives').directive('clickToEdit', function() {
	return {
		restrict: 'A',
		templateUrl: 'app/common/directives/click-to-edit/click-to-edit-directive.html',
		scope: {
			value: '=clickToEdit'
		},
		controller: 'clickToEditController'
	}
});

angular.module('trng.common.directives').controller('clickToEditController', ['$scope', function($scope) {
	function init() {
		$scope.edit = false;
		$scope.viewModel = {
			isEdit: false,
			value: $scope.value
		};
	}

	$scope.toggleEdit = function() {
		$scope.viewModel.isEdit = !$scope.viewModel.isEdit;
	};

	$scope.isEdit = function() {
		return $scope.viewModel.isEdit;
	};

	$scope.confirm = function() {
		$scope.value = $scope.viewModel.value;
		$scope.toggleEdit();
	};

	$scope.cancel = function() {
		$scope.viewModel.value = $scope.value;
		$scope.toggleEdit();
	};

	init();
}]);