'use strict';


angular.module('trng.trainer.training.classes').controller('trainerSingleClassMonitorController', [
    '$log',
    '$scope',
    '$rootScope',
    '$q',
    '$state',
    '$dialogs',
    '$timeout',
    'CommonConstants',
    'StatesNames',
    'DateUtil',
    'ClassesService',
    'CoursesService',
    'AppsService',
    'classApps',
    'currentClass',
    function ($log, $scope, $rootScope, $q, $state, $dialogs, $timeout, CommonConstants, StatesNames, DateUtil, ClassesService, CoursesService,
			  AppsService, classApps, currentClass) {

        $scope.init = function () {
            $scope.currentClass = currentClass;
            
            $scope.viewModel = {
                apps: [],
                selectedApps: []
            };

            $scope.initData();
            $scope.initDates();
            $scope.initAppsDataGrid();
			$scope.initAutoRefresh();
        };

        $scope.initData = function() {
            // This is kind of a voodoo to me currently - but it seems that changing the reference of the selectsApps array
            // breaks the selection of the dataGrid. the apps array, on the contrary, must be changed by reference, in order
            // for the dataGrid to be actually updated (as the watch on the array is based on reference or length).
            $scope.viewModel.apps = [];
            $scope.matchApps();
        };

        $scope.matchApps = function() {
            // The idea here is to display a table that will show all of the students, and for each one
            // all of the BPs of the class. This way, the trainer can monitor the apps created for each
            // student for each BP. If an app has been created for the student from that BP, the trainer
            // would see the app info. Otherwise, the app info should be blank, but a row for that pair
            // of student-BP must still appear.
			_.forEach($scope.currentClass.students, function(currentStudent) {

                // Thus, the iteration is done through the BPs of the course, and NOT the apps of the student.
                _.forEach($scope.currentClass.course.blueprints, function(currentBp) {

					var matchingStudentAppsObject = _.find(classApps.students, {_id: currentStudent.id});

					// Then, an app matching the current BP is searched for the specific student.
                    var appViewObject = _.find(matchingStudentAppsObject.apps, {blueprintId: currentBp.id});

                    // If not found, an empty object is created, so that the app fields will be blank.
                    if (!appViewObject) {
                        appViewObject = {};
                    }

                    var studentViewObject = _.omit(_.cloneDeep(currentStudent), 'apps');

                    appViewObject.id = studentViewObject.user.username + '-' + currentBp.id;
					appViewObject.student = studentViewObject;
                    appViewObject.blueprint = currentBp;

					appViewObject.publishDetails = _.find($scope.currentClass.bpPublishDetailsList, {bpId: currentBp.id});

					determineAppStatus(appViewObject);

                    $scope.viewModel.apps.push(appViewObject);
                });
            });
        };

        $scope.initAppsColumns = function() {
            $scope.viewModel.appsColumns = [
                {
                    field: 'student.user.username',
                    displayName: 'Student'
                },
                {
                    field: 'name',
                    displayName: 'Name'
                },
                {
                    field: 'blueprint.name',
                    displayName: 'Blueprint Name'
                },
                {
                    field: 'creationTime',
                    displayName: 'Creation Time',
                    cellFilter: 'date:\'' + DateUtil.angular.dateTimeFormat + '\'',
					width: '175px'
                },
                {
                    field: 'status',
                    displayName: 'Status',
					width: '75px'
                }
            ];
        };

        $scope.initAppsDataGrid = function() {
            $scope.initAppsColumns();

            $scope.viewModel.appsDataGrid = {
                data: 'viewModel.apps',
				primaryKey: 'id',
                columnDefs: $scope.viewModel.appsColumns,
                selectedItems: $scope.viewModel.selectedApps,
                showSelectionCheckbox: true,
                selectWithCheckboxOnly: true,
                enableColumnResize: true,
				enableHighlighting: true
            };
        };

		$scope.initAutoRefresh = function() {
			$scope.shouldAutoRefresh = true;
			$scope.autoRefresh();

			$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
				if (fromState && fromState.name === StatesNames.trainer.training.singleClass.monitorClass.name) {
					$scope.shouldAutoRefresh = false;
				}
			});
		};

		$scope.autoRefresh = function() {
			$timeout(function() {
				if ($scope.shouldAutoRefresh) {
					$scope.refreshState(false);
					$scope.autoRefresh();
				}
			}, CommonConstants.autoRefreshDuration);
		};

		$scope.refreshState = function(track) {
			return fetchClassApps(track);
		};

		$scope.createApps = function() {
			var onlyAppsToCreate = _.filter(getSelectedApps(), function(app) {
				return !app.creationTime;
			});

			var appsData = _.map(onlyAppsToCreate, function(app) {
				var appName =
					$scope.currentClass.name + '##' +
						app.blueprint.name + '##' +
						app.student.user.username;

				var appDesc =
					'App for student ' + app.student.user.username +
						' from BP ' + app.blueprint.name +
						' for class ' + $scope.currentClass.name;

				return {
					appName: appName,
					appDescription: appDesc,
					userId: app.student.user.id,
					blueprintId: app.blueprint.id,
					publishDetails: app.publishDetails
				};
			});

			return ClassesService.createAppForStudents($scope.currentClass.id, appsData).then(fetchClassApps);
		};

        $scope.deleteApp = function() {
            if (!$scope.isDeleteDisabled()) {
                var dialog = $dialogs.confirm('Delete application', 'Are you sure you want to delete the selected applications?');
                return dialog.result.then(
                    function() {
                        return $q.all(_.map(getSelectedApps(), function(app) {
                            return app.creationTime &&
                                ClassesService.deleteAppForStudent($scope.currentClass.id, app.student.user.id, app.ravelloId);
                        })).then(fetchClassApps);
                    }
                );
            }
        };

		$scope.startApps = function() {
			var appsForAction = prepareAppsForAction();
			return AppsService.startBatchApps($scope.currentClass.id, appsForAction);
		};

		$scope.stopApps = function() {
			var appsForAction = prepareAppsForAction();
			return AppsService.stopBatchApps($scope.currentClass.id, appsForAction);
		};

		$scope.isCreateDisabled = function() {
            return $scope.viewModel.selectedApps.length <= 0;
		};

		$scope.isDeleteDisabled = function() {
            return $scope.viewModel.selectedApps.length <= 0;
        };

		$scope.isStartDisabled = function() {
			return $scope.viewModel.selectedApps.length <= 0;
		};

		$scope.isStopDisabled = function() {
			return $scope.viewModel.selectedApps.length <= 0;
		};

		/* --- Private functions --- */

        function fetchClassApps(track) {
			return ClassesService.getClassById($scope.currentClass.id, track).then(
				function (theClass) {
					$scope.currentClass = _.cloneDeep(theClass);
					return ClassesService.getClassApps($scope.currentClass.id, track).then(
						function(results) {
							classApps = results;
							$scope.viewModel.apps = [];
							$scope.matchApps();
						}
					);
				}
			);
        }

		function getSelectedApps() {
			return _.filter($scope.viewModel.apps, function(app) {
				return _.find($scope.viewModel.selectedApps, {id: app.id});
			});
		}

		function determineAppStatus(app) {
			if (!app.ravelloId) {
				app.status = '-';
			} else if (app.numOfRunningVms > 0) {
				app.status = 'Started';
			} else {
				app.status = 'Stopped';
			}
		}

		function prepareAppsForAction() {
			return _.map(getSelectedApps(), function(app) {
				return {
					ravelloId: app.ravelloId,
					bpId: app.blueprint.id
				};
			});
		}

        /* --- Init --- */

        $scope.init();
    }
]);
