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
    'FeatureTogglesService',
    'classApps',
    'currentClass',
    function ($log, $scope, $rootScope, $q, $state, $dialogs, $timeout, CommonConstants, StatesNames, DateUtil, ClassesService, CoursesService,
			  AppsService, FeatureTogglesService, classApps, currentClass) {

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
					width: '105px',
					cellTemplate:
						'<div class="ngCellText" ng-class="col.colIndex()">' +
							'<span ng-cell-text class="{{determineAppStatusStyle(row.entity)}}">{{COL_FIELD}}</span>' +
						'</div>'
				},
				{
					field: 'expirationTime',
					displayName: 'Auto-stop',
					width: '100px',
					cellTemplate:
						'<div class="ngCellText" ng-class="col.colIndex()">' +
							'<span ng-cell-text>{{getAppExpirationTime(row.entity)}}</span>' +
						'</div>'
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
			return createFetchFunc(track)();
		};

		$scope.createApps = function() {
			function createAppsData() {
				var onlyAppsToCreate = _.filter(getSelectedApps(), function(app) {
					return !app.creationTime;
				});

				return _.map(onlyAppsToCreate, function(app) {
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
						publishDetails: app.publishDetails,
						bucketId: $scope.currentClass.bucketId
					};
				});
			}

			var appsData = createAppsData();

			var modalInstance = $dialogs.create('app/pages/trainer/classes/single-class/trainer-publish-dialog.html', 'trainerPublishController', appsData);
			return modalInstance.result.then(
				function(startAfterPublish) {
					_.forEach(appsData, function(app) {
						app.publishDetails.startAfterPublish = startAfterPublish;
					});
					return ClassesService.createAppForStudents($scope.currentClass.id, appsData).then(showErrors).then(createFetchFunc());
				}
			);
		};

		$scope.deleteApps = function() {
			if (!$scope.isDeleteDisabled()) {
				var dialog = $dialogs.confirm('Delete applications', 'Are you sure you want to delete the selected applications?');
				return dialog.result.then(
					function() {
						var appsData = prepareAppsForDelete();
						return ClassesService.deleteAppForStudents($scope.currentClass.id, appsData).then(createFetchFunc());
					}
				);
			}
		};

		$scope.startApps = function() {
			if (!$scope.isStartDisabled()) {
				var dialog = $dialogs.confirm('Start applications', 'Are you sure you want to start the selected applications?');
				return dialog.result.then(
					function() {
						var appsForAction = prepareAppsForAction();
						return AppsService.startBatchApps($scope.currentClass.id, appsForAction);
					}
				);
			}
		};

		$scope.stopApps = function() {
			if (!$scope.isStartDisabled()) {
				var dialog = $dialogs.confirm('Stop applications', 'Are you sure you want to stop the selected applications?');
				return dialog.result.then(
					function() {
						var appsForAction = prepareAppsForAction();
						return AppsService.stopBatchApps($scope.currentClass.id, appsForAction);
					}
				);
			}
		};

		$scope.autoStopApps = function() {
			var modalInstance = $dialogs.create('app/pages/trainer/classes/single-class/trainer-auto-stop-dialog.html', 'trainerAutoStopController');
			return modalInstance.result.then(
				function(autoStopMinutes) {
					var appsForAction = prepareAppsForAction();
					return AppsService.autoStopBatchApps(appsForAction, autoStopMinutes).then(createFetchFunc());
				}
			);
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

		$scope.isAutoStopDisabled = function() {
			return $scope.viewModel.selectedApps.length <= 0;
		};

		$scope.isExportCsvDisabled = function() {
			return $scope.viewModel.selectedApps.length <= 0;
		};

		$scope.getAppExpirationTime = function(app) {
			if (!app || !app.numOfRunningVms) {
				return '-';
			}

			if (!app.expirationTime || app.expirationTime === '-1') {
				return 'Never';
			}

			var expirationMoment = moment(parseInt(app.expirationTime));
			var diff = expirationMoment.diff(moment());
			return moment.utc(diff).format('HH:mm') + 'hr';
		};

		$scope.determineAppStatusStyle = function(app) {
			return app.status === 'Not published' ? 'status-warn' : '';
		};

		$scope.showExportCsv = function() {
			return FeatureTogglesService.hasFeatureToggle(CommonConstants.EXPORT_STUDENT_APPS_TO_CSV_TOGGLE);
		};

		$scope.exportAppsToCsv = function() {
			var filteredApps = _.filter(getSelectedApps(), function(app) {
				return app && app.creationTime && app.numOfRunningVms > 0;
			});

			var appIds = _.pluck(filteredApps, 'ravelloId');

			ClassesService.exportAppsToCsv($scope.currentClass.id, appIds);
		};

		/* --- Private functions --- */

		function showErrors(response) {
			if (response.data && response.data.errors && response.data.errors.length > 0) {
				var msg = _.reduce(response.data.errors, function(msg, error) {
					return msg + error.appName + ': ' + error.errorMsg + '<br>';
				}, '');
				$dialogs.error('Error', msg, response.data.errors);
			}
			return response.data;
		}

		function createFetchFunc(track) {

			return function() {
				return ClassesService.getClassById($scope.currentClass.id, track).then(
					function (theClass) {
						
						// Bug fix: the bpPublishDetails we receive on the currentClass injected to this ctrl,
						// contains relevant publishLocation data. 
						// We need to preserve this data wen replacing currentClass.
						var  bpPublishDetailsList = _.cloneDeep($scope.currentClass.bpPublishDetailsList);
						$scope.currentClass = _.cloneDeep(theClass);
						$scope.currentClass.bpPublishDetailsList = bpPublishDetailsList;

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
		}

		function getSelectedApps() {
			return _.filter($scope.viewModel.apps, function(app) {
				return _.find($scope.viewModel.selectedApps, {id: app.id});
			});
		}

		function determineAppStatus(app) {
			if (!app.ravelloId) {
				app.status = '-';
			} else if (!app.hasDeployment) {
				app.status = 'Not published';
			} else if (app.numOfRunningVms > 0) {
				app.status = 'Started';
			} else {
				app.status = 'Stopped';
			}
		}

		function prepareAppsForAction() {
			var filteredApps = _.filter(getSelectedApps(), function(app) {
				return app && app.creationTime;
			});

			return _.map(filteredApps, function(app) {
				return {
					ravelloId: app.ravelloId,
					bpId: app.blueprint.id
				};
			});
		}

		function prepareAppsForDelete() {
			var filteredApps = _.filter(getSelectedApps(), function(app) {
				return app && app.creationTime;
			});

			return _.map(filteredApps, function(app) {
				return {
					ravelloId: app.ravelloId,
					userId: app.student.user.id
				};
			});
		}

		/* --- Init --- */

        $scope.init();
    }
]);
