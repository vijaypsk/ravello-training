'use strict';

(function (angular) {
    angular.module('trng.labs.sessions').factory('trng.labs.sessions.SessionModel', [
        '$q', '$log', 'trng.services.SessionsService',
        function ($q, $log, sessionsService) {

            var sessionsLoaded = false;

            var sessions = [];

            var sessionsArray = [];

            var getSessionById = function(sessionId) {
                return _.find(sessions, function(currentSession) {
                    return currentSession.hasOwnProperty('id') && currentSession['id'] === sessionId;
                });
            };

            var service = {
                sessions: function() {
                    return sessions;
                },

                getSessionById: function(sessionId) {
                    if (sessionsLoaded) {
                        var deferred = $q.defer();
                        var promise = deferred.promise;
                        deferred.resolve(getSessionById(sessionId));
                        return promise;
                    }

                    return this.getAllSessions().then(function(result) {
                        return getSessionById(sessionId);
                    });
                },

                getAllSessions: function () {
                    if (sessionsLoaded) {
                        var deferred = $q.defer();
                        var promise = deferred.promise;
                        deferred.resolve(sessions);
                        return promise;
                    }

                    return sessionsService.getAllSessions().then(function(result) {
                        for (var i = 0; i < result.length; i++) {
                            sessions.push(result[i]);
                        }

                        sessionsLoaded = true;

                        return sessions;
                    });
                },

                deleteSessions: function(sessionsToDelete) {
                    for (var i = 0; i < sessionsToDelete.length; i++) {
                        var currentId = sessionsToDelete[i]['id'];
                        _.pull(sessions, sessionsToDelete[i]);
                    }
                },

                deleteSessionById: function(sessionId) {
                    _.remove(sessions, function(currentSession) {
                        return currentSession.hasOwnProperty('id') && currentSession['id'] === sessionId;
                    });
                },

                deleteStudents: function(session, studentsToDelete) {
                    for (var i = 0; i < studentsToDelete.length; i++) {
                        var currentId = studentsToDelete[i]['id'];
                        _.pull(session['students'], studentsToDelete[i]);
                    }
                },

                deleteStudent: function(session, studentId) {
                    _.remove(session['students'], function(currentStudent) {
                        return currentStudent.hasOwnProperty('id') && currentStudent['id'] === studentId;
                    });
                }
            };

            return service;
        }]);
})(angular);