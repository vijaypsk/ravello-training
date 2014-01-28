'use strict';


angular.module('trng.labs.sessions').controller('singleSessionController', [
    '$scope',
    '$state',
    '$stateParams',
    '$log',
    'trng.labs.sessions.SessionModel',
    'trng.services.SessionsService',
    'trng.labs.labs.LabModel',
    'trng.common.utils.DateUtil',
    function ($scope, $state, $stateParams, $log, sessionModel, sessionsService, labsModel, dateUtil) {

        var sessionId = undefined;

        $scope.init = function () {
            sessionId = $stateParams['sessionId'];

            $scope.initStudent();
//            $scope.initLabOptions();
            $scope.initDates();
            $scope.initBpPermissionsColumns();
            $scope.initStudentsDataGrid();
        };

        $scope.initStudent = function() {
            if (sessionId) {
                sessionModel.getSessionById(sessionId).then(function(result) {
                    $scope.currentSession = result;
                    $scope.initLabOptions();
                });
            } else {
                $scope.currentSession = {};
                $scope.initLabOptions();
            }

            $scope.selectedStudents = [];
        };

        $scope.initLabOptions = function() {
            $scope.labs = labsModel.labs();
            labsModel.getAllLabs().then(function(result) {
                $scope.currentSession.lab = _.find($scope.labs, function(currentLab) {
                   return currentLab.hasOwnProperty('id') && $scope.currentSession.hasOwnProperty('lab') &&
                       currentLab['id'] === $scope.currentSession.lab['id'];
                });

                if (_.isUndefined($scope.currentSession.lab)) {
                    $scope.currentSession.lab = _.first($scope.labs);
                }
            });
        };

        $scope.initDates = function() {
            $scope.dateFormat = dateUtil.dateFormat;

            $scope.dateOptions = {
                dateFormat: $scope.dateFormat,
                showOn: 'button'
            };
        };

        $scope.initBpPermissionsColumns = function () {
            $scope.bpPermissionsColumns = [
                {
                    field: 'username',
                    displayName: 'Student email'
                },
                {
                    field: 'ravelloUsername',
                    displayName: 'Ravello user'
                },
                {
                    displayName: 'Actions',
                    cellTemplate: '<a href="" class="btn btn-small btn-link" ng-click="editStudent(row)"><i class="icon-edit" /> Edit</a><a href="" class="btn btn-small btn-link" ng-click="deleteStudent(row)"><i class="icon-trash" /> Delete</a>'
                }
            ];
        };

        $scope.initStudentsDataGrid = function () {
            $scope.initBpPermissionsColumns();
            $scope.studentsDataGrid = {
                data: 'currentSession.students',
                columnDefs: $scope.bpPermissionsColumns,
                selectedItems: $scope.selectedStudents,
                showSelectionCheckbox: true,
                selectWithCheckboxOnly: true
            };
        };

        $scope.addStudent = function() {
            $state.go('^.single-student', {sessionId: $scope.currentSession['id']});
        };

        $scope.editStudent = function(studentToEdit) {
            var studentId = studentToEdit.getProperty('id');
            $state.go('^.single-student', {sessionId: $scope.currentSession['id'], studentId: studentId});
        };

        $scope.deleteStudents = function() {
            sessionModel.deleteStudents($scope.currentSession, $scope.studentsDataGrid.selectedItems);
        };

        $scope.deleteStudent = function(studentToDelete) {
            var studentId = studentToDelete.getProperty('id');
            sessionModel.deleteStudent($scope.currentSession, studentId);
        };

        $scope.init();
    }
]);
