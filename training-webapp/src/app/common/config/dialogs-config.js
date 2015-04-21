'use strict';

angular.module('trng.config').config(['$provide', 'CommonConstants', function($provide, CommonConstants) {
	$provide.decorator('$dialogs', ['$delegate', '$q', function($delegate, $q) {

		var activeDialogs = {
			'error': 0,
			'wait': 0,
			'notify': 0,
			'confirm': 0,
			'create': 0
		};

		function wrap(func, funcKey) {
			return function() {
				// Run the function only if the currently active dialogs do not exceed the maximum.
				if (activeDialogs[funcKey] < CommonConstants.maximumActiveDialogs) {
					activeDialogs[funcKey]++;

					// Run the function.
					var modalInstance = func.apply($delegate, arguments);

					// Remember to update the count of active dialogs, when the dialog is closed in any way.
					if (modalInstance && modalInstance.result) {
						modalInstance.result.finally(
							function() {
								activeDialogs[funcKey]--;
							}
						);
						return modalInstance;
					} else {
						activeDialogs[funcKey]--;
					}
				}

				// For the sake of others using the original service, we need to return the expected value.
				return {
					close: function() {},
					dismiss: function() {},
					result: $q.when({}),
					opened: $q.when({})
				};
			}
		}

		return {
			error: wrap($delegate.error, 'error'),
			wait: wrap($delegate.wait, 'wait'),
			notify: wrap($delegate.notify, 'notify'),
			confirm: wrap($delegate.confirm, 'confirm'),
			create: wrap($delegate.create, 'create')
		}
	}]);
}]);
