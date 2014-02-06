'use strict';

(function(angular) {
	angular.module('trng.courses.classes', ['ngGrid', 'ngQuickDate', 'ui.bootstrap', 'trng.services', 'trng.students']).
        config(['ngQuickDateDefaultsProvider',
            function(ngQuickDateDefaultsProvider) {
                ngQuickDateDefaultsProvider.set('parseDateFunction', function(str) {
                    return Date.parse(str);
                });
            }
        ]);
})(angular);
