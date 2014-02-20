'use strict';

angular.module('trng.student').controller('studentAppController', [
    '$log',
    '$scope',
    '$state',
    '$modal',
    '$window',
    'trng.services.AppsService',
    'trng.services.StudentsService',
    'student',
    'currentApp',
    function($log, $scope, $state, $modal, $window, appsSerivce, studentsService, student, currentApp) {
        $scope.init = function() {
            $scope.currentApp = currentApp;
            $scope.initPermissions();
            $scope.initVmsDataGrid();
        };

        $scope.initPermissions = function() {
            var bpId = currentApp['blueprintId'];
            $scope.bpPermissions = student['userClass']['blueprintPermissions'][bpId];
        };

        $scope.initVmsColumns= function() {
            $scope.vmsColumns = [
                {
                    field: 'name',
                    displayName: 'VM name'
                },
                {
                    field: 'status',
                    displayName: 'Status'
                },
                {
                    field: 'firstDns.name',
                    displayName: 'DNS',
                    enableCellEdit: true,
                    width: '30%'
                },
                {
                    displayName: 'Details',
                    cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="showDetails(row)">' +
                            '<i class="icon-edit" /> More' +
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
                selectWithCheckboxOnly: true
            };
        };

        $scope.showDetails = function(vmToExpand) {
            var vmId = vmToExpand.getProperty('id');
            var selectedVm = _.find($scope.currentApp['vms'], function(currentVm) {
                return (currentVm && currentVm.hasOwnProperty('id') && currentVm['id'] === vmId);
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
                appsSerivce.startVm(currentApp['id'], vm['id']).then(function(result) {
                    if (result.status === 202) {
                        $scope.refreshState();
                    } else {
                        alert("Could not perform action on VM: " + result.message);
                    }
                });
            });
        };

        $scope.stopVm = function() {
            _.forEach($scope.selectedVms, function(vm) {
                appsSerivce.stopVm(currentApp['id'], vm['id']).then(function(result) {
                    if (result.status === 202) {
                        $scope.refreshState();
                    } else {
                        alert("Could not perform action on VM: " + result.message);
                    }
                });
            });
        };

        $scope.consoleVm = function() {
            if ($scope.selectedVms.length == 1) {
                var vm = $scope.selectedVms[0];

                appsSerivce.consoleVm($scope.currentApp.id, vm.id).then(function(result) {
                    if (result.status === 200) {
                        var vncUrl = result.data;
                        $window.open(vncUrl);
                    } else {
                        $log.info("Didn't get VNC URL, status: " + result.status);
                    }
                }).catch(function(error) {
                    $log.info("Didn't get VNC URL, status: " + error);
                });
            }
        };

        $scope.startButtonDisabled = function() {
            return ($scope.selectedVms.length < 1 ||
                !$scope.bpPermissions.startVms);
        };

        $scope.stopButtonDisabled = function() {
            return ($scope.selectedVms.length < 1 ||
                !$scope.bpPermissions.stopVms);
        };

        $scope.consoleButtonDisabled = function() {
            return ($scope.selectedVms.length != 1 ||
                    !$scope.bpPermissions.console);
        };

        $scope.refreshState = function() {
            return studentsService.getStudentClassSingleApp(
                    student._id, student['userClass']['_id'], $scope.currentApp.id).then(
                function(result) {
                    $scope.currentApp = result;
                }
            );
        };

        $scope.init();
    }
]);

var studentAppResolver = {
    currentApp: [
        '$q', '$stateParams', 'trng.services.StudentsService', 'student',
        function($q, $stateParams, studentsService, student) {
            var appId = $stateParams['appId'];

            if (!appId || !student) {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            }

            return studentsService.getStudentClassSingleApp(student._id, student['userClass']['_id'], appId);
        }
    ]
};