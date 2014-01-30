'use strict';

(function (angular) {
    angular.module('trng.students').factory('trng.students.StudentModel', [
        '$q', '$log', 'trng.courses.classes.ClassModel',
        function ($q, $log, classModel) {

            var service = {
                getStudentById: function(classId, studentId) {
                    return classModel.getClassById(classId).then(function(theClass) {
                        if (theClass && theClass.hasOwnProperty('students') && theClass.hasOwnProperty('course')) {
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
                        }
                    });
                }
            };

            return service;
        }]);
})(angular);