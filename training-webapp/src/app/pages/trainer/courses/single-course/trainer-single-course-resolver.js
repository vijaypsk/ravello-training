'use strict';

var singleCourseResolver = {
    currentCourse: ['$q', '$stateParams', 'CourseModel',
                    function ($q, $stateParams, CourseModel) {

                        var courseId = $stateParams.courseId;;

                        if (courseId) {
                            return CourseModel.getAllCourses().then(function (courses) {
                                return _.cloneDeep(_.find(courses, function (course) {
                                    return (course && course.hasOwnProperty('id') &&
                                        course.id === courseId);
                                }));
                            });
                        }

                        var deferred = $q.defer();
                        deferred.resolve({});
                        return deferred.promise;
                    }
    ]
};
