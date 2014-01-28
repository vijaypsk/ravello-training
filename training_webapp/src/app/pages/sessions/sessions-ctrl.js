'use strict';


angular.module('trng.labs.sessions').controller('labsSessionsController', [
    '$scope',
    '$state',
    '$log',
    'trng.labs.sessions.SessionModel',
    'trng.services.SessionsService',
    function ($scope, $state, $log, sessionModel, sessionsService) {

        $scope.init = function () {
            $scope.sessions = sessionModel.sessions;
            $scope.selectedSessions = [];
            $scope.sessionsAvailable = false;

            $scope.initSessionsDataGrid();
            $scope.getAllSessions();
        };

        $scope.getAllSessions = function () {
            var promise = sessionModel.getAllSessions();
            promise.then(function (result) {
                $scope.sessionsAvailable = true;
            });
        };

        $scope.initSessionsColumns = function () {
            $scope.sessionColumns = [
                {
                    field: 'name',
                    displayName: 'Name'
                },
                {
                    field: 'lab.name',
                    displayName: 'Lab'
                },
                {
                    field: 'startDate',
                    displayName: 'Start date',
                    cellFilter: 'date:"dd/MM/yyyy"'
                },
                {
                    field: 'endDate',
                    displayName: 'End date',
                    cellFilter: 'date:"dd/MM/yyyy"'
                },
                {
                    displayName: 'Actions',
                    cellTemplate: '<a href="" class="btn btn-small btn-link" ng-click="editSession(row)"><i class="icon-edit" /> Edit</a><a href="" class="btn btn-small btn-link" ng-click="deleteSession(row)"><i class="icon-trash" /> Delete</a>'
                }
            ];
        };

        $scope.initSessionsDataGrid = function () {
            $scope.initSessionsColumns();
            $scope.sessionsDataGrid = {
                data: 'sessions',
                columnDefs: $scope.sessionColumns,
                selectedItems: $scope.selectedSessions,
                showSelectionCheckbox: true,
                selectWithCheckboxOnly: true
            };
        };

        $scope.addSession = function () {
            $state.go('^.single-session', {mode: 'add'});
        };

        $scope.editSession = function (sessionToEdit) {
            var sessionId = sessionToEdit.getProperty('id');
            $state.go('^.single-session', {mode: 'edit', sessionId: sessionId});
        };

        $scope.deleteSessions = function () {
            sessionModel.deleteSessions($scope.sessionsDataGrid.selectedItems);
        };

        $scope.deleteSession = function(sessionToDelete) {
            var sessionId = sessionToDelete.getProperty('id');
            sessionModel.deleteSessionById(sessionId);
        };

        $scope.init();
    }]);
