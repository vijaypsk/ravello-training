'use strict';

var singleStudentResolver = {
    currentStudent: [
        '$stateParams', 'ClassesService', 'currentClass',
        function($stateParams, ClassesService, currentClass) {
            var studentId = $stateParams.studentId;

            if (studentId) {
                return ClassesService.getStudent(currentClass, studentId);
            } else {
                return ClassesService.createNewStudent(currentClass);
            }
        }
    ]
};
