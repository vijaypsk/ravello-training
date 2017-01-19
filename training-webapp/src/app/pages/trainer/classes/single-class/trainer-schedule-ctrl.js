'use strict';
angular.module('trng.trainer.training.classes').controller('trainerScheduleController',
	function ($scope, $log, $modalInstance, data) {

		function init() {
			$scope.viewModel = {
				startAfterPublish: false,
				groupedApps: []
			};
			//console.log(data);
			var groupedAppsByPublishMethod = _.groupBy(data, function (app) {
				if (app.publishDetails.method === 'PERFORMANCE_OPTIMIZED') {
					return 'on ' + app.publishDetails.location.locationDisplayName;
				} else {
					return "as Cost-optimized";
				}
			});
			_.forOwn(groupedAppsByPublishMethod, function (value, key) {
				$scope.viewModel.groupedApps.push({
					publishedMethod: key,
					apps: value
				});
			});
		}

		$scope.ok = function () {
			let sch = {startTime:$scope.startD.value,endTime:$scope.endD.value};
			$modalInstance.close(sch);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		init();



		$scope.today = function () {
			$scope.startD = {value:new Date()};
			$scope.endD = {value:new Date()};
		};
		$scope.today();


		$scope.clear = function () {
			$scope.startD = null;
			$scope.endD = null;
		};


		$scope.$watch("startD.value", function(newValue, oldValue) {
            //update end date value if start date is set to greater than end date
			if(newValue>$scope.endD.value){
    		// console.log("Old Value : ", oldValue);
			// console.log("New Value : ", newValue);
				$scope.endD.value=newValue;
			}
		});


		// Disable weekend selection
		function disabled(data) {
			var date = data.date,
			mode = data.mode;
			return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
		}
		$scope.dateOptions = {
			customClass: $scope.getDayClass,
			dateDisabled: disabled,
			minDate: new Date(),
			showWeeks: true
		};

		
		$scope.open1 = function ($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.startd.opened = true;
		};
		$scope.open2 = function ($event) {
			 	$event.preventDefault();
    			$event.stopPropagation();
				$scope.endd.opened = true;
				console.log($scope.endD.value)
		};

		$scope.formats = ['dd-MMMM-yyyy hh:mm:ss', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[0];

		
		$scope.startd = {
			opened: false
		};
		$scope.endd = {
			opened: false
		};


		var tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		var afterTomorrow = new Date();
		afterTomorrow.setDate(tomorrow.getDate() + 2);
		$scope.events =
			[
				{
					date: tomorrow,
					status: 'full'
				},
				{
					date: afterTomorrow,
					status: 'partially'
				}
			];

		$scope.getDayClass = function (date, mode) {
			if (mode === 'day') {
				var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

				for (var i = 0; i < $scope.events.length; i++) {
					var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

					if (dayToCheck === currentDay) {
						return $scope.events[i].status;
					}
				}
			}

			return '';
		};

	}
);