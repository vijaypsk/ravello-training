'use strict';

(function (angular) {
    angular.module('trng.students').factory('trng.students.StudentModel', [
        '$q', '$log', 'trng.courses.classes.ClassModel',
        function ($q, $log, classModel) {

            var service = {
                getStudentById: function(classId, studentId) {
                    return classModel.getCurrentClass(classId).
                        then(function(theClass) {
                            var student = _.find(theClass['students'], function(currentStudent) {
                                return (currentStudent && currentStudent.hasOwnProperty('id') && currentStudent['id'] === studentId);
                            });

                            if (student && student.hasOwnProperty('blueprintPermissions')) {
                                var bpsArray = _.map(student['blueprintPermissions'], function(bpPermissions, bpId) {
                                    var bp = _.find(theClass['course']['blueprints'], function(currentBp) {
                                        return (currentBp && currentBp.hasOwnProperty('id') && currentBp['id'] === bpId);
                                    });

                                    _.assign(bpPermissions, bp);
                                    return bpPermissions;
                                });

                                student['blueprintPermissions'] = bpsArray;
                            }

                            return student;
                        });
                },

                setStudent: function(classId, student) {
                    return classModel.getCurrentClass(classId).
                        then(function(theClass) {
                            var students = _.map(theClass['students'], function(currentStudent) {
                                if (currentStudent['id'] === student['id']) {
                                    return student;
                                }
                                return currentStudent;
                            });

                            theClass['students'] = students;
                        });
                }
            };

            return service;
        }]);
})(angular);