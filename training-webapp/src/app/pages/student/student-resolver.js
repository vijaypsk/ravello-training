'use strict';

var studentResolver = {
    student: [
        'StudentsService',
        'LoginModel',
        function(StudentsService, LoginModel) {
            return StudentsService.getStudent(LoginModel.user.id);
        }
    ]
};
