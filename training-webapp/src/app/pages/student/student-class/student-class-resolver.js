'use strict';

var studentClassResolver = {
    course: [
        '$q', 'CoursesService', 'student',
        function($q, CoursesService, student) {
            if (student.hasOwnProperty('userClass') &&
                student.userClass.hasOwnProperty('courseId')) {

                var courseId = student.userClass.courseId;
                return CoursesService.getCourseById(courseId);
            }

            var deferred = $q.defer();
            deferred.reject("Could not find student or the course of the student's class");
            return deferred.promise;
        }
    ],

    apps: [
        '$log', 'StudentsService', 'student',
        function($log, StudentsService, student) {
            return StudentsService.getStudentClassApps(student._id, student.userClass._id);
        }
    ]
};
