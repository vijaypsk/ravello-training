'use strict';


angular.module('trng.students').controller('singleStudentController', [
    '$scope',
    '$state',
    '$stateParams',
    '$log',
    '$modal',
    'trng.students.StudentModel',
    function ($scope, $state, $stateParams, $log, $modal, studentModel) {

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
            if (classId && studentId) {
                studentModel.getStudentById(classId, studentId).then(function(result) {
                    $scope.currentStudent = _.cloneDeep(result);
                });
            } else {
                studentModel.createNewStudent(classId).
                    then(function(student) {
                        $scope.currentStudent = student;
                    });
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
                    cellTemplate: '<a href="" class="btn btn-small btn-link" ng-click="configureBpPermission(row)"><i class="icon-edit" /> Configure permissions</a>'
                }
            ];
        };

        $scope.initBpPermissionsDataGrid = function () {
            $scope.bpPermissionsDataGrid = {
                data: 'currentStudent.blueprintPermissions',
                columnDefs: $scope.studentsColumns,
                selectedItems: $scope.selectedBps,
                showSelectionCheckbox: true,
                selectWithCheckboxOnly: true
            };
        };

        $scope.configureBpPermissions = function() {

        };

        $scope.configureBpPermission = function(bpToConfigure) {
            var bpId = bpToConfigure.getProperty('id');

            var bpPermissions = _.find($scope.currentStudent.blueprintPermissions, function(currentBp) {
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

        $scope.approve = function() {
            studentModel.setStudent(classId, $scope.currentStudent);
            $state.go('^.single-class', {classId: classId});
        };

        $scope.cancel = function() {
            $state.go('^.single-class', {classId: classId});
        };

        $scope.init();
    }
]);
