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

		
		$scope.timezoneChange = function () {
    	}

		$scope.toTimeZone= function (time, zone) {
			var format = 'YYYY/MM/DD HH:mm:ss ZZ';
			// console.log("Local timezone offset ",time.getTimezoneOffset());
			// console.log("Offset for zone ",zone," is ",moment.tz(time,zone).zone());
			//console.log('time is ',time,' type is ',typeof(time));
			var hroffset = (moment.tz(time,zone).zone() - time.getTimezoneOffset())/60;
			return moment.tz(time,zone).add(hroffset,'hours').toDate();
		}

		$scope.timezone = {value:null};

		$scope.ok = function () {
			let sch = {startTime:$scope.startD.value,endTime:$scope.endD.value,timeZone:$scope.timezone.value};

			$modalInstance.close(sch);
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		init();


		Date.prototype.addHours= function(h){
			this.setHours(this.getHours()+h);
			return this;
		}

		$scope.initDate = new Date();
		$scope.initEndDate = function(){
			var res = $scope.startD.value.addHours(1);
			//console.log('res ',res);
			return res;
		}
		$scope.today = function () {
			$scope.startD = {value:roundMinutes($scope.initDate)};
			//$scope.startD = {value:roundMinutes(new Date(1485451000000))};
			$scope.endD = {value:roundMinutes($scope.initEndDate())};

			function roundMinutes(date) {
				// var minIncr = Math.round(date.getMinutes()/60);
				// if(minIncr==0)minIncr=1;
				date.setHours(date.getHours() + 1);
				date.setMinutes(0);
				return date;
			}
		};
		$scope.today();


		$scope.clear = function () {
			$scope.startD = null;
			$scope.endD = null;
		};


		$scope.$watch("startD.value", function(newValue, oldValue) {
            //update end date value if start date is set to greater than end date
			if(newValue>$scope.endD.value){
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
			minDate:$scope.initDate,
			timezone: $scope.timezone.value,
			showWeeks: true
		};
      
		$scope.endDateOptions = {
			customClass: $scope.getDayClass,
			dateDisabled: disabled,
			minDate:  $scope.initEndDate(),
			timezone: $scope.timezone.value,
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