'use strict';

angular.module('trng.proxies').factory('StudentsProxy', [
    '$http',
    '$q',
    'CommonConstants',
    'TrainingMainTracker',
    function($http, $q, CommonConstants, TrainingMainTracker) {
        var service = {
            getStudent: function(studentId) {
                var promise = $http.get(CommonConstants.baseUrl + '/rest/students/' + studentId);
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            getStudentClass: function(studentId, classId) {
                var promise = $http.get(CommonConstants.baseUrl + '/rest/students/' + studentId + '/class/' + classId);
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            getStudentClassApps: function(studentId, classId) {
                var promise = $http.get(CommonConstants.baseUrl + '/rest/students/' + studentId + '/class/' + classId + '/apps');
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            getStudentClassSingleApp: function(studentId, classId, appId, track) {
                // By default, try tracking.
                if (_.isUndefined(track) || _.isNull(track)) {
                    track = true;
                }

                var promise = $http.get(CommonConstants.baseUrl + '/rest/students/' + studentId + '/class/' + classId + '/apps/' + appId);

                if (track) {
                    TrainingMainTracker.addPromise(promise);
                }

                return promise;
            },

            getStudentCourseDetails: function(studentId, courseId) {
                var promise = $http.get(CommonConstants.baseUrl + '/rest/students/' + studentId + '/course/' + courseId);
                TrainingMainTracker.addPromise(promise);
                return promise;
            }
        };

        return service;
    }
]);
