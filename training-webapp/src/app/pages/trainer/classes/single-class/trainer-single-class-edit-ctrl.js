'use strict';


angular.module('trng.trainer.training.classes').controller('trainerSingleClassEditController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$log',
    '$window',
    '$dialogs',
    'StatesNames',
    'ClassesService',
	'BlueprintsService',
	'LoginModel',
	'DateUtil',
    'currentClass',
    'courses',
	'buckets',
	function ($scope, $rootScope, $state, $stateParams, $log, $window, $dialogs, StatesNames, ClassesService,
			  BlueprintsService,  LoginModel, DateUtil, currentClass, courses, buckets) {

		$scope.init = function () {
			$scope.apps = [];
			$scope.courses = courses;
			$scope.buckets = buckets;
			$scope.initAbstract();
			$scope.initClass();
			$scope.initDates();
			$scope.initStudentsDataGrid();
			$scope.initPublishDetailsOptions();
			initCostBuckets();
		};

		function initCostBuckets() {
			$scope.viewModel = {
				selectedCostBucket: getInitalSelectedCostBucket()
			};
			$scope.isCostBucketsOpen = isCostBucketsOpen();
		}

		function getInitalSelectedCostBucket() {
			if (currentClass.bucketId) {
				return  _.find($scope.buckets, { id: currentClass.bucketId});
			}
			if ($scope.buckets.length === 1) {
				return $scope.buckets[0];
			}
			return null;
		}

		function isCostBucketsOpen() {
			if ($scope.currentClass.bucketId) {
				return false;
			}
			return $scope.buckets.length > 1;
		}

		$scope.initAbstract = function() {
			$scope.abstract = {};
		};

		$scope.initPublishDetailsOptions = function() {
			$scope.publishMethods = [
				{
					name: 'Cost',
					value: 'COST_OPTIMIZED'
				},
				{
					name: 'Performance',
					value: 'PERFORMANCE_OPTIMIZED'
				}
			];

			fetchBpsCloudsAndRegions();
		};


		function fetchBpsCloudsAndRegions() {
			$scope.bpIdToLocations = {};
			_.forEach($scope.currentClass.course.blueprints, function(blueprint) {
				var bpId = blueprint.id;
				BlueprintsService.getPublishLocations(bpId).then(function (locations) {
					var bpLocations = [];
					_.forEach(locations, function(location) {
						var bpLocation = {
							region: location.regionName,
							locationDisplayName: location.regionDisplayName
						};
						bpLocations.push(bpLocation);
					});
					$scope.bpIdToLocations[bpId] = bpLocations;
					setSelectedLocations(bpId, bpLocations);
				});
			});
		}

		$scope.getLocations = function(bpId) {
			return $scope.bpIdToLocations[bpId];
		};

		function setSelectedLocations(bpId, bpLocations) {
			var bpPublishDetailsList = $scope.currentClass.bpPublishDetailsList;
			var bpPublishDetails = _.find(bpPublishDetailsList, { bpId: bpId });
			if (bpPublishDetails) {
				if (bpPublishDetails.region) {
					bpPublishDetails.location = _.find(bpLocations, { region: bpPublishDetails.region });
				} else {
					bpPublishDetails.location = bpLocations[0];
				}
			}
		}

		$scope.isLocationVisible = function(bpPublishDetails) {
			return bpPublishDetails && bpPublishDetails.method !== 'COST_OPTIMIZED';
		};

		$scope.locationChanged = function(bpPublishDetails) {
			bpPublishDetails.region = bpPublishDetails.location.region;
		};

		$scope.initClass = function() {
			$scope.currentClass = currentClass;
			if ($scope.courses && $scope.courses.length) {
				if (!$scope.currentClass.courseId) {
					$scope.currentClass.course = $scope.courses[0];
					$scope.currentClass.courseId = $scope.courses[0].id;
				} else {
					$scope.currentClass.course = _.find($scope.courses, function(course) {
						return course.id === currentClass.courseId;
					});
				}
			} else {
				$scope.currentClass.course = null;
			}

			$scope.isRavelloCredentials = false;
			$scope.isScheduling = false;

			$scope.$watch('currentClass.ravelloCredentials.overrideTrainerCredentials', function(newVal, oldVal) {
				if (newVal !== oldVal) {
					if (!newVal) {
						$scope.currentClass.ravelloCredentials.username = LoginModel.user.ravelloCredentials.username;
						$scope.currentClass.ravelloCredentials.password = LoginModel.user.ravelloCredentials.password;
					}
				}
			});

			$scope.$watch('viewModel.selectedCostBucket', function(newVal, oldVal) {
				if (newVal !== oldVal) {
					$scope.currentClass.bucketId = newVal.id;
				}
			});

			$scope.$watch('currentClass.bpPublishDetailsList', function(newVal, oldVal) {
				if (newVal !== oldVal) {
					fetchBpsCloudsAndRegions();
				}
			});
		};

		$scope.initDates = function() {
			$scope.dateFormat = DateUtil.angular.dateFormat;
			$scope.timeFormat = DateUtil.angular.timeFormat;
			$scope.dateTimeFormat = DateUtil.angular.dateTimeFormat;
			$scope.initSchedule();
		};

		$scope.initStudentsColumns = function () {
			$scope.studentsColumns = [
				{
					field: 'user.fullName',
					displayName: 'Full name'
				},
				{
					field: 'user.username',
					displayName: 'Username'
				},
				{
					displayName: 'Actions',
					width: '180px',
					resizable: false,
					cellTemplate:
					'<a href="" class="btn btn-small btn-link" ng-click="editStudent(row)">' +
					'<i class="fa fa-pencil" /> Edit' +
					'</a>' +
					'<a href="" class="btn btn-small btn-link" ng-click="deleteStudent(row)">' +
					'<i class="fa fa-trash-o" /> Delete' +
					'</a>'
				}
			];
		};

		$scope.initStudentsDataGrid = function () {
			$scope.selectedStudents = [];

			$scope.initStudentsColumns();
			$scope.studentsDataGrid = {
				data: 'currentClass.students',
				columnDefs: $scope.studentsColumns,
				selectedItems: $scope.selectedStudents,
				showSelectionCheckbox: false,
				selectWithCheckboxOnly: true,
				enableColumnResize: true,
				enableHighlighting: true,
				enableRowSelection: false
			};
		};

		$scope.addStudent = function() {
			$state.go(StatesNames.trainer.training.singleClass.singleStudent.name, {classId: $scope.currentClass.id});
		};

		$scope.editStudent = function(studentToEdit) {
			var studentId = studentToEdit.getProperty('id');
			$state.go(StatesNames.trainer.training.singleClass.singleStudent.name, {classId: $scope.currentClass.id, studentId: studentId});
		};

		$scope.deleteStudent = function(studentToDelete) {
			var dialog = $dialogs.confirm("Delete student", "Are you sure you want to delete the student?");
			dialog.result.then(function(result) {
				var studentId = studentToDelete.getProperty('id');
				_.remove($scope.currentClass.students, {id: studentId});
			});
		};

		$scope.saveClass = function() {
			return ClassesService.saveOrUpdate($scope.currentClass).then(
				function(result) {
					$state.go(StatesNames.trainer.training.classes.name);
				}
			);
		};

		$scope.back = function() {
			$window.history.back();
		};

		$scope.addToEdit = function() {
			currentClass = ClassesService.createEmptyClass(currentClass.course);
			$scope.currentClass = currentClass;
			fetchBpsCloudsAndRegions();

			$state.go(StatesNames.trainer.training.singleClass.editClass.name);
		};

		$scope.showActive = function() {
			return $state.is(StatesNames.trainer.training.singleClass.editClass.name) ||
				$state.is(StatesNames.trainer.training.singleClass.singleStudent.name);
		};

		$scope.toggleActive = function() {
			$scope.currentClass.active = !$scope.currentClass.active;
		};

		$scope.addToEditDisabled = function() {
			return !$scope.currentClass.course;
		};

		$scope.getTitle = function() {
			var title = $scope.currentClass.name || 'New class';
			title += $scope.abstract.getStudentName ? ' > ' + $scope.abstract.getStudentName() : '';
			return title;
		};

		

		$scope.timezoneChange = function () {
			//console.log('startD ',$scope.toTimeZone($scope.startD.value,$scope.timezone.value));
			//console.log('endD ',$scope.toTimeZone($scope.endD.value,$scope.timezone.value));
    	}

		$scope.toTimeZone= function (time, zone) {
			//console.log("time is ",time,' zone is ',zone);
			if(time && zone){
				var format = 'YYYY/MM/DD HH:mm:ss ZZ';
				var hroffset = (moment.tz(time,zone).zone() - time.getTimezoneOffset())/60;
				return moment.tz(time,zone).add(hroffset,'hours').toDate();
			}
		}

		$scope.displayTime= function (time, zone) {
			//console.log("time is ",time,' zone is ',zone);
			if(time && zone){
				var format = 'YYYY/MM/DD HH:mm:ss ZZ';
				var hroffset = (moment.tz(time,zone).zone() - time.getTimezoneOffset())/60;
				return moment.tz(time,zone).subtract(hroffset,'hours').toDate();
			}
		}

		$scope.timezone = {value:null};

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


		$scope.setClassSchedule=function(){
			
		  let sch = {
				       startTime:$scope.toTimeZone($scope.startD.value,$scope.timezone.value),
				       endTime:$scope.toTimeZone($scope.endD.value,$scope.timezone.value),
					   timeZone:$scope.timezone.value
					};
			$scope.currentClass.schedule = sch;		
             //reset any scheduled apps  
			 _.forEach($scope.currentClass.students, function(student) {
                            student.scheduledApps.length=0
            });
		};

		


		$scope.initSchedule = function () {
			
			if ($scope.currentClass && $scope.currentClass.schedule) {
				var currSchedule = $scope.currentClass.schedule;
				$scope.startD.value = $scope.displayTime(new Date(currSchedule.startTime),currSchedule.timeZone);
				$scope.endD.value = $scope.displayTime(new Date(currSchedule.endTime),currSchedule.timeZone);
				$scope.timezone.value = currSchedule.timeZone;
			}
			$scope.$watch("startD.value", function (newValue, oldValue) {
				//update end date value if start date is set to greater than end date
				if (newValue > $scope.endD.value) {
					$scope.endD.value = newValue;
				}
				$scope.setClassSchedule();
			});

			$scope.$watch("endD.value", function (newValue, oldValue) {
				//update end date value if start date is set to greater than end date
				if (newValue < $scope.startD.value) {
					$scope.startD.value = newValue;
				}
				$scope.setClassSchedule();
			});

			$scope.$watch("timezone.value", function (newValue, oldValue) {
				$scope.setClassSchedule();
			});
		}

		


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

		$scope.formats = ['dd-MMMM-yyyy hh:mm:ss','yyyy/MM/dd hh:mm a', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[1];

		
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

		$scope.init();
	}
]);

