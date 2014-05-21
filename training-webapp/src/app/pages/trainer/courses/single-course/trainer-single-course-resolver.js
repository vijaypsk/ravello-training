'use strict';

var singleCourseResolver = {
    currentCourse: [
        '$q', '$stateParams', 'CoursesService',
        function ($q, $stateParams, CoursesService) {
            var courseId = $stateParams.courseId;

            if (!courseId) {
                return $q.when({});
            }

            return CoursesService.getCourseById(courseId).then(
                function(course) {
                    return _.cloneDeep(course);
                }
            );
        }
    ]
};
