'use strict';

angular.module('trng.student').controller('studentAppController', [
    '$log',
    '$scope',
    '$state',
    '$modal',
    'trng.services.AppsService',
    'student',
    'currentApp',
    function($log, $scope, $state, $modal, appsSerivce, student, currentApp) {
        $scope.init = function() {
            $scope.currentApp = currentApp;
            $scope.initPermissions();
            $scope.initVmsDataGrid();
        };

        $scope.initPermissions = function() {
            var bpId = currentApp['blueprintId'];
            $scope.bpPermissions = student['class']['blueprintPermissions'][bpId];
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
                    field: 'dns.name',
                    displayName: 'DNS'
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
                appsSerivce.startVm(currentApp['id'], vm['id']);
            });
        };

        $scope.stopVm = function() {
            _.forEach($scope.selectedVms, function(vm) {
                appsSerivce.stopVm(currentApp['id'], vm['id']);
            });
        };

        $scope.consoleVm = function() {

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

            return studentsService.getStudentClassSingleApp("1", student['class']['id'], appId);
        }
    ]
};