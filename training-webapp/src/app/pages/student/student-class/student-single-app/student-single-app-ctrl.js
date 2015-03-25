'use strict';

angular.module('trng.student').controller('studentSingleAppController', [
    '$log',
    '$scope',
    '$state',
    '$modal',
    '$window',
    '$timeout',
    '$dialogs',
    'CommonConstants',
    'StatesNames',
    'AppsService',
    'StudentsService',
    'student',
    'currentApp',
    function ($log, $scope, $state, $modal, $window, $timeout, $dialogs, CommonConstants, StatesNames, AppsService,
                            StudentsService, student, currentApp) {

        $scope.init = function() {
            $scope.currentApp = currentApp;
            $scope.initPermissions();
            $scope.initVmsDataGrid();
//            $scope.initAutoRefresh();
        };

        $scope.initAutoRefresh = function() {
            $scope.shouldAutoRefresh = true;
            $scope.autoRefresh();
        };

        $scope.initPermissions = function() {
            $scope.bpPermissions = _.find(student.blueprintPermissions, function(currentBpPermissions) {
                return currentBpPermissions.bpId == currentApp.blueprintId;
            });
        };

        $scope.initVmsColumns= function() {
            $scope.vmsColumns = [
                {
                    field: 'name',
                    enableCellEdit: false,
                    displayName: 'VM name',
                    width: '19%'
                },
                {
                    field: 'status',
                    enableCellEdit: false,
                    displayName: 'Status',
                    width: '9%'
                },
                {
                    field: 'firstDns.ip',
                    displayName: 'IP',
                    enableCellEdit: true,
                    width: '12%'
                },
                {
                    field: 'firstDns.name',
                    displayName: 'DNS',
                    enableCellEdit: true,
                    width: '20%'
                },
                {
                    displayName: 'Actions',
                    enableCellEdit: false,
                    cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="showDetails(row)">' +
                            '<i class="fa fa-plus"></i> More' +
                        '</a>' +
						'<a href="" class="btn btn-small btn-link go-link" ng-click="rdpVm(row.entity)" ng-if="rdpButtonVisible(row.entity)" ng-disabled="rdpButtonDisabled(row.entity)">' +
							'<i class="fa fa-terminal go-link"></i> Go!' +
						'</a>'
                }
            ];
        };

        $scope.initVmsDataGrid = function() {
            $scope.selectedVms = [];

            $scope.initVmsColumns();

            $scope.studentVmsDataGird = {
                data: 'currentApp.vms',
                columnDefs: $scope.vmsColumns,
                selectedItems: $scope.selectedVms,
                showSelectionCheckbox: true,
                selectWithCheckboxOnly: true,
                enableCellEditOnFocus: true
            };
        };

        $scope.showDetails = function(vmToExpand) {
            var vmId = vmToExpand.getProperty('id');
            var selectedVm = _.find($scope.currentApp.vms, function(currentVm) {
                return (currentVm && currentVm.hasOwnProperty('id') && currentVm.id === vmId);
            });

            var modalInstance = $modal.open({
                templateUrl: 'app/pages/student/student-class/student-single-app/vm-details.html',
                controller: 'studentVmDetailsController',
                resolve: {
                    selectedVm: function() {
                        return selectedVm;
                    }
                }
            });
        };

        $scope.startVm = function() {
            _.forEach($scope.selectedVms, function(vm) {
                AppsService.startVm(currentApp.id, vm.id).then(function(result) {
                    if (result.status === 202) {
                        $scope.refreshState();
                    } else {
                        alert("Could not perform action on VM: " + result.message);
                    }
                });
            });
        };

        $scope.stopVm = function() {
            var dialog = $dialogs.confirm("Stop VMs", "Are you sure you want to stop the VMs?");
            dialog.result.then(function(result) {
                _.forEach($scope.selectedVms, function(vm) {
                    AppsService.stopVm(currentApp.id, vm.id).then(function(result) {
                        if (result.status === 202) {
                            $scope.refreshState();
                        } else {
                            alert("Could not perform action on VM: " + result.message);
                        }
                    });
                });
            });
        };

        $scope.restartVm = function() {
            var dialog = $dialogs.confirm("Restart VMs", "Are you sure you want to restart the VMs?");
            dialog.result.then(function(result) {
                _.forEach($scope.selectedVms, function(vm) {
                    AppsService.restartVm(currentApp.id, vm.id).then(function(result) {
                        if (result.status === 202) {
                            $scope.refreshState();
                        } else {
                            alert("Could not perform action on VM: " + result.message);
                        }
                    });
                });
            });
        };

        $scope.consoleVm = function(vm) {
            var vmId = vm.getProperty('id');
            AppsService.consoleVm($scope.currentApp.id, vmId).then(function(result) {
                if (result.status === 200) {
                    var vncUrl = result.data;
                    $window.open(vncUrl);
                } else {
                    $log.info("Didn't get VNC URL, status: " + result.status);
                }
            }).catch(function(error) {
                $log.info("Didn't get VNC URL, status: " + error);
            });
        };

		$scope.startButtonDisabled = function() {
            return ($scope.selectedVms.length < 1 ||
                !$scope.bpPermissions.startVms);
        };

        $scope.stopButtonDisabled = function() {
            return ($scope.selectedVms.length < 1 ||
                !$scope.bpPermissions.stopVms);
        };

        $scope.restartButtonDisabled = function() {
            return ($scope.selectedVms.length < 1 ||
                !$scope.bpPermissions.restartVms);
        };

        $scope.consoleButtonDisabled = function(vm) {
            return vm.name && vm.name !== 'Hero3' ? !$scope.bpPermissions.console : true;
        };

        $scope.refreshButtonDisabled = function() {
            return ($scope.busy);
        };

        $scope.refreshState = function (track) {
            return StudentsService.getStudentClassSingleApp(student._id, student.userClass._id,
                    $scope.currentApp.id, track).
                then(function (result) {
                    _.forEach($scope.currentApp.vms, function(vm) {
                        var newVm = _.find(result.vms, function(vmDto) {
                            return vm.id === vmDto.id;
                        });

                        if (newVm) {
                            angular.copy(newVm, vm);
                        }
                    });
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

        $scope.back = function() {
            $scope.shouldAutoRefresh = false;
            $window.history.back();
        };

        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            if (fromState && fromState.name === StatesNames.student.studentClass.singleApp.name) {
                $scope.shouldAutoRefresh = false;
            }
        });

        $scope.init();
    }
]);
