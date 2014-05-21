'use strict';

var coursesResolver = {
    courses: [
        '$q', 'CourseModel',
        function($q, CourseModel) {
            return CourseModel.getAllCourses().
                then(function(result) {
                    return _.cloneDeep(result);
                });
        }
    ]
};
