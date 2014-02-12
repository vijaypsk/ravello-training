'use strict';

(function (angular) {
    angular.module('trng.trainer.students').factory('trng.trainer.students.StudentModel', [
        '$q',
        '$log',
        function ($q, $log) {

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

                student['blueprints'] = blueprints;
            };

            var model = {
                getStudent: function(theClass, studentId) {
                    var student = _.find(theClass['students'], function(currentStudent) {
                        return (currentStudent && currentStudent.hasOwnProperty('id') && currentStudent['id'] === studentId);
                    });

                    assignBlueprintsToStudent(theClass, student);

                    return student;
                },

                createNewStudent: function(theClass) {
                    var student = {};
                    assignBlueprintsToStudent(theClass, student);
                    return student;
                },

                viewModelToDomainModel: function(student) {
                    // Now, the student has to hold the bp permissions as a map between bpId and the bpPermissions.
                    var blueprintPermissionsMap = {};
                    _.forEach(student['blueprints'], function(currentBp) {
                        // The view-model for a blueprint in the student holds a mix of data - both plain
                        // bp data, and the student-specific bp permissions data.
                        // When we go back to the domain model, we want to keep only the student-specific data,
                        // so we pick only the relevant properties from the object.
                        var bpPermissions = _.pick(currentBp, ['id', 'startVms', 'stopVms', 'console']);

                        // Then, the domain model holds the information as an map, instead of an array,
                        // between bp ID and the student-specific bp permissions.
                        var bpId = currentBp['id'];
                        bpPermissions = _.omit(bpPermissions, 'id');
                        blueprintPermissionsMap[bpId] = bpPermissions;
                    });

                    student['blueprintPermissions'] = blueprintPermissionsMap;

                    return student;
                }
        };

            return model;
        }]);
})(angular);