'use strict';

var singleStudentResolver = {
    currentStudent: [
        '$stateParams', 'StudentModel', 'currentClass',
        function($stateParams, StudentModel, currentClass) {
            var studentId = $stateParams.studentId;

            if (studentId) {
                return StudentModel.getStudent(currentClass, studentId);
            } else {
                return StudentModel.createNewStudent(currentClass);
            }
        }
    ]
};
