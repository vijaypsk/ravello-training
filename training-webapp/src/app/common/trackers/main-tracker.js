'use strict';

angular.module('trng.trackers').factory('TrainingMainTracker', [
    'promiseTracker',
    function(promiseTracker) {
        var tracker = promiseTracker('TrainingMainTracker');
        return tracker;
    }
]);
