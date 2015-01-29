'use strict';

angular.module('trng.student').controller('studentClassController', [
    '$log',
    '$scope',
    '$state',
    '$window',
    'StatesNames',
    'StudentsService',
    'AppsService',
    'student',
    'course',
    'apps',
    function($log, $scope, $state, $window, StatesNames, StudentsService, AppsService, student, course, apps) {
        $scope.init = function() {
            $scope.name = student.firstName + ' ' + student.surname;
            $scope.student = student;
            $scope.apps = apps;

            $scope.initDescription();
            $scope.initAppsDataGrid();

			StudentsService.goAtInit(go);
        };

        $scope.initDescription = function() {
            $scope.description = course.description +  ' ' + $scope.student.userClass.description;
        };

        $scope.initAppsColumns = function() {
            $scope.appsColumns = [
                {
                    field: 'name',
                    displayName: 'Name',
                    cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="view(row)">' +
                            '<i></i> {{row.getProperty(col.field)}}' +
                        '</a>'
                },
                {
                    field: 'numOfVms',
                    displayName: '# of VMs'
                },
                {
                    field: 'numOfRunningVms',
                    displayName: '# of running VMs'
                },
                {
                    displayName: 'Actions',
                    cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="view(row)">' +
                            '<i class="fa fa-search"></i> View' +
                        '</a>'
                }
            ];
        };

        $scope.initAppsDataGrid = function() {
            $scope.selectedApps = [];

            $scope.initAppsColumns();

            $scope.studentAppsDataGird = {
                data: 'apps',
                columnDefs: $scope.appsColumns,
                selectedItems: $scope.selectedApps
            };
        };

        $scope.view = function(appToView) {
            var appId = appToView.getProperty("id");
            $state.go(StatesNames.student.studentClass.singleApp.name, {appId: appId});
        };

		$scope.isGoDisabled = function() {
			return !onlySingleApp();
		};

		$scope.rdpVm = function(vm) {
			if (vm && vm.firstDns && vm.firstDns.name && vm.firstDns.services && vm.firstDns.services.length > 0) {
				var httpService = _.find(vm.firstDns.services, {port: '80'});
				if (httpService) {
					$window.open('http://' + vm.firstDns.name + ':' + httpService.externalPort + '/client.xhtml?id=c%2FRDP', '_blank');
				}
			}
		};

		$scope.rdpButtonDisabled = function(vm) {
			return !vm || !vm.firstDns || !vm.firstDns.name;
		};

		$scope.rdpButtonVisible = function(vm) {
			return vm && vm.allDns && vm.allDns.length > 0 &&
				_.some(vm.allDns, function(dns) {
					return dns && dns.services && dns.services.length > 0 &&
						_.some(dns.services, function(service) {
							return service && service.port && service.port.toString() === "80";
						});
				});
		};

		$scope.go = go;

		function go() {
			if (onlySingleApp()) {
				_.forEach($scope.apps[0].vms, function(vm) {
					if ($scope.rdpButtonVisible(vm)) {
						$scope.rdpVm(vm);
					}
				});
			}
		}

		function onlySingleApp() {
			return $scope.apps && $scope.apps.length === 1;
		}

		$scope.init();
    }
]);
