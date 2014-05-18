'use strict';


angular.module('trng.trainer.students').controller('singleStudentController', [
    '$scope',
    '$state',
    '$stateParams',
    '$log',
    '$modal',
    '$window',
    'trng.trainer.training.classes.ClassModel',
    'trng.trainer.students.StudentModel',
    'currentStudent',
    'currentClass',
    function ($scope, $state, $stateParams, $log, $modal, $window, classModel, studentModel, currentStudent, currentClass) {

        $scope.init = function () {
            $scope.currentStudent = currentStudent;
            $scope.currentClass = currentClass;

            $scope.initBpPermissionsDataGrid();

            $scope.isRavelloCredentials =
                (!$scope.currentStudent.ravelloCredentials ||
                (!$scope.currentStudent.ravelloCredentials.username && !$scope.currentStudent.ravelloCredentials.password));
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
                            '<i class="fa fa-cog" /> Configure Permissions' +
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

        $scope.isConfigurePermissionsDisabled = function() {
            return $scope.selectedBps && $scope.selectedBps.length <= 0;
        };

        $scope.saveStudent = function() {
            // If the current student is a new student (find it using the id field),
            // then that student has to be added to the class list of students.
            var existingStudent = _.find($scope.currentClass.students, function(student) {
                return student && student.id && student.id == $scope.currentStudent.id;
            });

            if (!existingStudent) {
                $scope.currentClass.students.push(currentStudent);
            }

            classModel.save($scope.currentClass).then(
                function(persistedClass) {
                    // Also notice that if the student is a new one, then the student object held in the $scope
                    // has no id field. After the save, we need to assign the $scope student with the
                    // newly persisted student.
                    if (!existingStudent) {
                        $scope.currentStudent = persistedClass.students[persistedClass.students.length - 1];
                    }
                    $state.go("trainer.training.single-class.edit-class", {classId: $scope.currentClass.id});
                }
            );
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