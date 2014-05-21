'use strict';

var singleClassEditResolver = {
    currentClass: ['$q', '$stateParams', 'ClassModel',
                   function($q, $stateParams, ClassModel) {
                       var classId = $stateParams['classId'];

                       if (!classId) {
                           var deferred = $q.defer();
                           deferred.resolve({});
                           return deferred.promise;
                       }

                       return ClassModel.getClassById(classId).then(function(result) {
                           return _.cloneDeep(result);
                       });
                   }
    ],

    courses: ['CourseModel',
              function(CourseModel) {
                  return CourseModel.getAllCourses();
              }
    ]
};
