'use strict';

var classesResolver = {
    classes: [
        '$q', 'ClassesService', 'CoursesService',
        function ($q, ClassesService, CoursesService) {
            return ClassesService.getAllClasses().then(
                function(classes) {
                    return CoursesService.getAllCourses().then(
                        function(courses) {
                            _.forEach(classes, function(currentClass) {
                                currentClass.course = _.cloneDeep(_.find(courses, {id: currentClass.courseId}));
                            });

                            return _.cloneDeep(classes);
                        }
                    )
                }
            );
        }
    ]
};
