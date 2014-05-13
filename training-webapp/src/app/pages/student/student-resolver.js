'use strict';

var studentResolver = {
    student: [
        'trng.services.StudentsService',
        'loginModel',
        function(studentsService, loginModel) {
            return studentsService.getStudent(loginModel.user.id);
        }
    ]
};
