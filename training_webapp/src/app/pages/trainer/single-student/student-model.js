'use strict';

(function (angular) {
    angular.module('trng.trainer.students').factory('trng.trainer.students.StudentModel', [
        '$q',
        '$log',
        function ($q, $log) {

            var assignBlueprintsToStudent = function(theClass, student) {
                var blueprints = _.map(theClass.course.blueprints, function(currentBp) {
                    var bpDto = _.cloneDeep(currentBp);

                    var bpPermissions = _.find(student.blueprintPermissions, function(currentBpPermissions) {
                        return currentBp.id == currentBpPermissions.bpId;
                    });

                    if (bpPermissions) {
                        _.assign(bpDto, bpPermissions);
                    } else {
                        _.assign(bpDto, {
                            'bpId': currentBp.id,
                            'startVms': true,
                            'stopVms': true,
                            'restartVms': true,
                            'console': true
                        });
                    }

                    return bpDto;
                });

                student.blueprints = blueprints;
            };

            var model = {
                getStudent: function(theClass, studentId) {
                    var student = _.find(theClass.students, function(currentStudent) {
                        return (currentStudent && currentStudent.hasOwnProperty('id') && currentStudent.id === studentId);
                    });

                    assignBlueprintsToStudent(theClass, student);

                    return student;
                },

                createNewStudent: function(theClass) {
                    var student = {};
                    assignBlueprintsToStudent(theClass, student);

                    if (!theClass.students) {
                        theClass.students = [];
                    }

                    return student;
                },

                viewModelToDomainModel: function(student) {
                    if (student.blueprints) {
                        student.blueprintPermissions = _.map(student.blueprints, function(currentBp) {
                            return _.pick(currentBp, 'bpId', 'startVms', 'stopVms', 'restartVms', 'console');
                        });

                        student = _.omit(student, 'blueprints');
                    }

                    return student;
                }
        };

            return model;
        }]);
})(angular);