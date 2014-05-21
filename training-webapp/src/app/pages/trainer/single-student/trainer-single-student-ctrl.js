'use strict';


angular.module('trng.trainer.students').controller('trainerSingleStudentController', [
    '$scope',
    '$state',
    '$stateParams',
    '$log',
    '$modal',
    '$window',
    'growl',
    'ClassModel',
    'StudentModel',
    'currentStudent',
    'currentClass',
    function ($scope, $state, $stateParams, $log, $modal, $window, growl, ClassModel, StudentModel, currentStudent, currentClass) {

        $scope.init = function () {
            $scope.currentStudent = currentStudent;
            $scope.currentClass = currentClass;

            $scope.initBpPermissionsDataGrid();

            // Show the ravello credentials of the student if:
            // 1) There are no ravello credentials at all
            // 2) One of username/password is missing
            // 3) There are no ravello credentials at the class level
            // 4) One of username/password is missing in class level
            // The idea behind this logic is to draw attention to this part, only if its empty (and thus shall be filled)
            // or if there are no credentials set at the class level (in which case they must be set at the student level).
            $scope.isRavelloCredentials =
                (!$scope.currentStudent.ravelloCredentials ||
                (!$scope.currentStudent.ravelloCredentials.username && !$scope.currentStudent.ravelloCredentials.password)) ||
                !$scope.currentClass.ravelloCredentials ||
                (!$scope.currentClass.ravelloCredentials.username && !$scope.currentClass.ravelloCredentials.password);
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
                templateUrl: 'app/pages/trainer/single-student/trainer-bp-permissions.html',
                controller: 'trainerBpPermissionsController',
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
                templateUrl: 'app/pages/trainer/single-student/trainer-bp-permissions.html',
                controller: 'trainerBpPermissionsController',
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
            var validationStatus = $scope.getValidationStatus();

            if (!_.isEmpty(validationStatus)) {
                var finalMessage = _.reduce(validationStatus, function(sum, current) {
                    return sum += ", " + current;
                });

                finalMessage = "Could not save, please fill required fields: [" + finalMessage + "]";

                growl.addErrorMessage(finalMessage);

                return;
            }

            // If the current student is a new student (find it using the id field),
            // then that student has to be added to the class list of students.
            var existingStudent = _.find($scope.currentClass.students, {id: $scope.currentStudent.id});

            if (!existingStudent) {
                $scope.currentClass.students.push(currentStudent);
            }

            ClassModel.save($scope.currentClass).then(
                function(persistedClass) {
                    // Also notice that if the student is a new one, then the student object held in the $scope
                    // has no id field. After the save, we need to assign the $scope student with the
                    // newly persisted student.
                    if (!existingStudent) {
                        $scope.currentStudent = persistedClass.students[persistedClass.students.length - 1];
                    }
                    $state.go("trainer.training.single-class.edit-class", {classId: $scope.currentClass.id});
                }
            ).catch(
                function(error) {
                    // This is important - if a new student was added to the class, but saving it failed, it must be removed
                    // from the class upon failure.
                    // Alternatively, we could have added the student to the class only upon success, but this way, we wouldn't
                    // have an updated class (with the newly added student) to save in the first place...
                    if (!existingStudent) {
                        $scope.currentClass.students.pop();
                    }
                }
            );
        };

        $scope.getValidationStatus = function() {
            var validationStatus = [];

            $scope.currentStudent.user && !$scope.currentStudent.user.firstName && validationStatus.push("First name");
            $scope.currentStudent.user && !$scope.currentStudent.user.username && validationStatus.push("username");

            !$scope.currentStudent.id && $scope.currentStudent.user &&
                !$scope.currentStudent.user.password && validationStatus.push("password");

            return validationStatus;
        };

        $scope.init();
    }
]);

var singleStudentResolver = {
    currentStudent: [
        '$stateParams', 'StudentModel', 'currentClass',
        function($stateParams, StudentModel, currentClass) {
            var studentId = $stateParams.studentId;

            if (studentId) {
                return StudentModel.getStudent(currentClass, studentId);
            } else {
                return StudentModel.createNewStudent(currentClass);
            }
        }
    ]
};