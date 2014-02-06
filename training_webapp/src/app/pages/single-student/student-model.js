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

            var assignBlueprintsToStudent = function(theClass, student) {
                var blueprints = _.map(theClass['course']['blueprints'], function(currentBp) {
                    var bpId = currentBp['id'];
                    var bpPermissions = student['blueprintPermissions'] ? student['blueprintPermissions'][bpId] : null;
                    if (bpPermissions) {
                        return _.assign(currentBp, bpPermissions);
                    } else {
                        return _.assign(currentBp, {
                            'startVms': true,
                            'stopVms': true,
                            'console': true
                        });
                    }
                });

                student['blueprintPermissions'] = blueprints;
            };

            var service = {
                getStudentById: function(classId, studentId) {
                    return classModel.getCurrentClass(classId).
                        then(function(theClass) {
                            var student = _.find(theClass['students'], function(currentStudent) {
                                return (currentStudent && currentStudent.hasOwnProperty('id') && currentStudent['id'] === studentId);
                            });

                            assignBlueprintsToStudent(theClass, student);

                            return student;
                        });
                },

                createNewStudent: function(classId) {
                    var student = {};
                    return classModel.getClassById(classId).
                        then(function(theClass) {
                            assignBlueprintsToStudent(theClass, student);
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