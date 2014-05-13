'use strict';

angular.module('trng.student').controller('studentAppController', [
    '$log',
    '$scope',
    '$state',
    '$modal',
    '$window',
    '$timeout',
    '$dialogs',
    'app.config',
    'trng.services.AppsService',
    'trng.services.StudentsService',
    'student',
    'currentApp',
    function ($log, $scope, $state, $modal, $window, $timeout, $dialogs, config, appsSerivce, studentsService,
              student, currentApp) {

        $scope.init = function() {
            $scope.currentApp = currentApp;
            $scope.initPermissions();
            $scope.initVmsDataGrid();
            $scope.initAutoRefresh();
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
                    width: '25%'
                },
                {
                    field: 'status',
                    enableCellEdit: false,
                    displayName: 'Status',
                    width: '9%'
                },
                {
                    field: 'firstDns.name',
                    displayName: 'DNS',
                    enableCellEdit: true,
                    width: '45%'
                },
                {
                    displayName: 'Actions',
                    enableCellEdit: false,
                    cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="showDetails(row)">' +
                            '<i class="fa fa-plus"></i> More' +
                        '</a>' +
                        '<a href="" class="btn btn-small btn-link" ng-click="consoleVm(row)" ng-disabled="consoleButtonDisabled()">' +
                            '<i class="fa fa-terminal"></i> Console' +
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
                templateUrl: 'app/pages/student/class/vm-details.html',
                controller: 'vmDetailsController',
                resolve: {
                    selectedVm: function() {
                        return selectedVm;
                    }
                }
            });
        };

        $scope.startVm = function() {
            _.forEach($scope.selectedVms, function(vm) {
                appsSerivce.startVm(currentApp.id, vm.id).then(function(result) {
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
                    appsSerivce.stopVm(currentApp.id, vm.id).then(function(result) {
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
                    appsSerivce.restartVm(currentApp.id, vm.id).then(function(result) {
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
            appsSerivce.consoleVm($scope.currentApp.id, vmId).then(function(result) {
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

        $scope.consoleButtonDisabled = function() {
            return !$scope.bpPermissions.console;
        };

        $scope.refreshButtonDisabled = function() {
            return ($scope.busy);
        };

        $scope.refreshState = function (track) {
            return studentsService.getStudentClassSingleApp(student._id, student['userClass']['_id'],
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
            }, config.autoRefreshDuration);
        };

        $scope.back = function() {
            $scope.shouldAutoRefresh = false;
            $window.history.back();
        };

        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            if (fromState && fromState.name === 'student.class.single-app') {
                $scope.shouldAutoRefresh = false;
            }
        });

        $scope.init();
    }
]);

var studentAppResolver = {
    currentApp: [
        '$q', '$stateParams', 'trng.services.StudentsService', 'student',
        function($q, $stateParams, studentsService, student) {
            var appId = $stateParams.appId;

            if (!appId || !student) {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            }

            return studentsService.getStudentClassSingleApp(student._id, student.userClass._id, appId);
        }
    ]
};