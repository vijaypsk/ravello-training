'use strict';


angular.module('trng.trainer.students').controller('singleStudentController', [
    '$scope',
    '$state',
    '$stateParams',
    '$log',
    '$modal',
    '$window',
    'trng.trainer.students.StudentModel',
    'currentStudent',
    'currentClass',
    function ($scope, $state, $stateParams, $log, $modal, $window, studentModel, currentStudent, currentClass) {

        $scope.init = function () {
            $scope.currentStudent = currentStudent;
            $scope.initBpPermissionsDataGrid();
        };

        $scope.initBpPermissionsColumns = function () {
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
                    field: 'restartVms',
                    displayName: 'Restart VMs'
                },
                {
                    field: 'console',
                    displayName: 'Console'
                },
                {
                    displayName: 'Actions',
                    cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="configureBpPermission(row)">' +
                            '<i class="icon-cog" /> Configure Permissions' +
                        '</a>'
                }
            ];
        };

        $scope.initBpPermissionsDataGrid = function () {
            $scope.selectedBps = [];

            $scope.initBpPermissionsColumns();

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
                templateUrl: 'app/pages/trainer/single-student/bp-permissions.html',
                controller: 'bpPermissionsController',
                resolve: {
                    bpPermissions: function() {
                        return {
                            startVms: true,
                            stopVms: true,
                            restartVms: true,
                            console: true
                        };
                    }
                }
            });

            modalInstance.result.then(function(result) {
                $scope.currentStudent.blueprints = _.map($scope.currentStudent.blueprints,
                    function(currentBp) {
                        var selectedBp = _.find($scope.selectedBps, function(currentSelectedBp) {
                            return (currentBp.id === currentSelectedBp.id);
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
                return (currentBp.hasOwnProperty('id') && currentBp.id === bpId);
            });

            var modalInstance = $modal.open({
                templateUrl: 'app/pages/trainer/single-student/bp-permissions.html',
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

        $scope.saveStudent = function() {
            if (!_.contains(currentClass.students, currentStudent)) {
                currentClass.students.push(currentStudent);
            }
            $scope.saveClass();
        };

        $scope.init();
    }
]);

var singleStudentResolver = {
    currentStudent: [
        '$stateParams', 'trng.trainer.students.StudentModel', 'currentClass',
        function($stateParams, studentModel, currentClass) {
            var studentId = $stateParams.studentId;

            if (studentId) {
                return studentModel.getStudent(currentClass, studentId);
            } else {
                return studentModel.createNewStudent(currentClass);
            }
        }
    ]
};