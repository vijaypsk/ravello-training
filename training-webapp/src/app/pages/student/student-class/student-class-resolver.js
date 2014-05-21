'use strict';

var studentClassResolver = {
    course: [
        '$q', 'StudentsService', 'student',
        function($q, StudentsService, student) {
            return student && student.userClass && student.userClass.courseId ?
                StudentsService.getStudentCourse(student._id, student.userClass.courseId) :
                $q.reject("Could not find student or the course of the student's class");
        }
    ],

    apps: [
        '$log', 'StudentsService', 'student',
        function($log, StudentsService, student) {
            return StudentsService.getStudentClassApps(student._id, student.userClass._id);
        }
    ]
};
