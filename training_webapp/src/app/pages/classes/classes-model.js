'use strict';

(function (angular) {
    angular.module('trng.courses.classes').factory('trng.courses.classes.ClassModel', [
        '$q', '$log', 'trng.services.ClassesService',
        function ($q, $log, classesService) {

            var classesLoaded = false;

            var classes = [];

            var getClassById = function(classId) {
                return _.find(classes, function(currentClass) {
                    return currentClass.hasOwnProperty('id') && currentClass['id'] === classId;
                });
            };

            var service = {
                classes: classes,

                getClassesById: function(classId) {
                    if (classesLoaded) {
                        var deferred = $q.defer();
                        var promise = deferred.promise;
                        deferred.resolve(getClassById(classId));
                        return promise;
                    }

                    return this.getAllClasses().then(function(result) {
                        return getClassById(classId);
                    });
                },

                getAllClasses: function () {
                    if (classesLoaded) {
                        var deferred = $q.defer();
                        var promise = deferred.promise;
                        deferred.resolve(classes);
                        return promise;
                    }

                    return classesService.getAllClasses().then(function(result) {
                        for (var i = 0; i < result.length; i++) {
                            classes.push(result[i]);
                        }

                        classesLoaded = true;

                        return classes;
                    });
                },

                deleteClasses: function(classesToDelete) {
                    for (var i = 0; i < classesToDelete.length; i++) {
                        var currentId = classesToDelete[i]['id'];
                        _.pull(classes, classesToDelete[i]);
                    }
                },

                deleteClassById: function(classId) {
                    _.remove(classes, function(currentClass) {
                        return currentClass.hasOwnProperty('id') && currentClass['id'] === classId;
                    });
                },

                deleteStudents: function(theClass, classesToDelete) {
                    for (var i = 0; i < classesToDelete.length; i++) {
                        var currentId = classesToDelete[i]['id'];
                        _.pull(theClass['students'], classesToDelete[i]);
                    }
                },

                deleteStudent: function(theClass, studentId) {
                    _.remove(theClass['students'], function(currentStudent) {
                        return currentStudent.hasOwnProperty('id') && currentStudent['id'] === studentId;
                    });
                }
            };

            return service;
        }]);
})(angular);