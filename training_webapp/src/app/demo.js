angular.module('app', ['ngAnimate','ajoslin.promise-tracker','cgBusy']);

angular.module('app').controller('DemoCtrl',function($scope,promiseTracker,$q,$timeout,$http){

    $scope.delay1 = $scope.delay2 = 2000;

    $scope.demoBusy = function(trackerName,delay){

        //For the demo we're using a simple promise not $http since thats easier to control
//        var testPromise = $q.defer();
//        var tracker = promiseTracker(trackerName).addPromise(testPromise.promise);
//        $timeout(function(){
//            testPromise.resolve();
//        },delay);

        var tracker = promiseTracker(trackerName);

        var promise = $http.get('http://localhost:8888/rest/students/111111111111111111111111/class/cacacacacacacacacaca2222/apps/42434647',
            {
                tracker: tracker,
                headers: {
                    Authorization: 'Basic ZGFuaWVsOmE='
                }
            }
        );

        tracker.addPromise(promise);
    };

});