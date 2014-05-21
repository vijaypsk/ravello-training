'use strict';

var coursesResolver = {
    courses: [
        '$q', 'CoursesService',
        function($q, CoursesService) {
            return CoursesService.getAllCourses().then(
                function(courses) {
                    return _.cloneDeep(courses);
                }
            );
        }
    ]
};
