'use strict';


angular.module('trng.students').controller('singleStudentController', [
    '$scope',
    '$state',
    '$stateParams',
    '$log',
    '$modal',
    'trng.courses.classes.ClassModel',
    'trng.services.ClassesService',
    'trng.common.utils.DateUtil',
    function ($scope, $state, $stateParams, $log, $modal, classModel, classesService, dateUtil) {

        var classId = undefined;
        var studentId = undefined;

        $scope.init = function () {
            classId = $stateParams['classId'];
            studentId = $stateParams['studentId'];

            $scope.initStudent();
            $scope.initBpPermissionsColumns();
            $scope.initBpPermissionsDataGrid();
        };

        $scope.initStudent = function() {
            if (classId && studentId) {
                classModel.getClassesById(classId).then(function(result) {
                    $scope.currentStudent = _.find(result.students, function(currentStudent) {
                        return (currentStudent && currentStudent.hasOwnProperty('id') && currentStudent['id'] === studentId);
                    });
                });
            } else {
                $scope.currentStudent = {};
            }

            $scope.selectedBps = [];
        };

        $scope.initBpPermissionsColumns = function () {
            $scope.bpPermissionsColumns = [
                {
                    field: 'blueprint.name',
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
                    cellTemplate: '<a href="" class="btn btn-small btn-link" ng-click="configureBpPermission(row)"><i class="icon-edit" /> Configure permissions</a>'
                }
            ];
        };

        $scope.initBpPermissionsDataGrid = function () {
            $scope.bpPermissionsDataGrid = {
                data: 'currentStudent.blueprintPermissions',
                columnDefs: $scope.bpPermissionsColumns,
                selectedItems: $scope.selectedBps,
                showSelectionCheckbox: true,
                selectWithCheckboxOnly: true
            };
        };

        $scope.configureBpPermissions = function() {

        };

        $scope.configureBpPermission = function(bpToConfigure) {
            var bpId = bpToConfigure.getProperty('blueprint')['id'];

            var bpPermissions = _.find($scope.currentStudent.blueprintPermissions, function(currentBp) {
                return (currentBp.hasOwnProperty('blueprint') && currentBp['blueprint']['id'] === bpId);
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
