'use strict';

(function (angular) {
    angular.module('trng.students').factory('trng.students.StudentModel', [
        '$q',
        '$log',
        'trng.courses.classes.ClassModel',
        function ($q, $log, classModel) {

            var viewModelToDomainModel = function(student) {
                // Create a list of bpPermissions that only hold what the domain model should hold.
                var bpPermissions = _.map(student['blueprintPermissions'], function(currentBp) {
                    return _.pick(currentBp, ['id', 'startVms', 'stopVms', 'console']);
                });

                // Now, the student has to hold the bp permissions as a map between bpId and the bpPermissions.
                var blueprintPermissionsMap = {};
                _.forEach(bpPermissions, function(currentBp) {
                    var bpId = currentBp['id'];
                    currentBp = _.omit(currentBp, 'id');
                    blueprintPermissionsMap[bpId] = currentBp;
                });

                student['blueprintPermissions'] = blueprintPermissionsMap;

                return student;
            };

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
                                    return viewModelToDomainModel(student);
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