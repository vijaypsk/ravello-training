'use strict';


angular.module('trng.students').controller('singleStudentController', [
    '$scope',
    '$state',
    '$stateParams',
    '$log',
    '$modal',
    '$window',
    'trng.students.StudentModel',
    'currentClass',
    function ($scope, $state, $stateParams, $log, $modal, $window, studentModel, currentClass) {

        var classId = undefined;
        var studentId = undefined;

        $scope.init = function () {
            classId = $stateParams['classId'];
            studentId = $stateParams['studentId'];

            $scope.initStudent();
            $scope.initStudentsColumns();
            $scope.initBpPermissionsDataGrid();
        };

        $scope.initStudent = function() {
            if (studentId) {
                $scope.currentStudent = studentModel.getStudent(currentClass, studentId);
            } else {
                $scope.currentStudent = studentModel.createNewStudent(classId);
            }

            $scope.selectedBps = [];
        };

        $scope.initStudentsColumns = function () {
            $scope.studentsColumns = [
                {
                    field: 'name',
                    displayName: 'Blueprint'
                },
                {
                    field: 'startVms',
                    displayName: 'Start VMs'
                },
                {
                    field: 'stopVms',
                    displayName: 'Stop VMs'
                },
                {
                    field: 'console',
                    displayName: 'Console'
                },
                {
                    displayName: 'Actions',
                    cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="configureBpPermission(row)">' +
                            '<i class="icon-edit" /> Configure permissions' +
                        '</a>'
                }
            ];
        };

        $scope.initBpPermissionsDataGrid = function () {
            $scope.bpPermissionsDataGrid = {
                data: 'currentStudent.blueprints',
                columnDefs: $scope.studentsColumns,
                selectedItems: $scope.selectedBps,
                showSelectionCheckbox: true,
                selectWithCheckboxOnly: true
            };
        };

        $scope.configurBpPermissions = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/pages/single-student/bp-permissions.html',
                controller: 'bpPermissionsController',
                resolve: {
                    bpPermissions: function() {
                        return {
                            startVms: true,
                            stopVms: true,
                            console: true
                        };
                    }
                }
            });

            modalInstance.result.then(function(result) {
                $scope.currentStudent['blueprints'] = _.map($scope.currentStudent['blueprints'],
                    function(currentBp) {
                        var selectedBp = _.find($scope.selectedBps, function(currentSelectedBp) {
                            return (currentBp['id'] === currentSelectedBp['id']);
                        });

                        if (selectedBp) {
                            return _.assign(currentBp, result);
                        }

                        return currentBp;
                    }
                );
            });
        };

        $scope.configureBpPermission = function(bpToConfigure) {
            var bpId = bpToConfigure.getProperty('id');

            var bpPermissions = _.find($scope.currentStudent.blueprints, function(currentBp) {
                return (currentBp.hasOwnProperty('id') && currentBp['id'] === bpId);
            });

            var modalInstance = $modal.open({
                templateUrl: 'app/pages/single-student/bp-permissions.html',
                controller: 'bpPermissionsController',
                resolve: {
                    bpPermissions: function() {
                        return bpPermissions;
                    }
                }
            });

            modalInstance.result.then(function(result) {
                _.assign(bpPermissions, result);
            });
        };

        $scope.init();
    }
]);
