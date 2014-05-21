'use strict';

var singleClassEditResolver = {
    currentClass: [
        '$q', '$stateParams', 'ClassesService', 'CoursesService',
        function ($q, $stateParams, ClassesService, CoursesService) {
            var classId = $stateParams['classId'];

            if (!classId) {
                return $q.when({});
            }

            return ClassesService.getClassById(classId).then(
                function (theClass) {
                    return CoursesService.getCourseById(theClass.courseId).then(
                        function(course) {
                            theClass.course = _.cloneDeep(course);
                            return _.cloneDeep(theClass);
                        }
                    );
                }
            );
        }
    ],

    courses: [
        'CoursesService',
        function (CoursesService) {
            return CoursesService.getAllCourses().then(
                function (courses) {
                    return _.cloneDeep(courses);
                }
            );
        }
    ]
};
