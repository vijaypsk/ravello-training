'use strict';

(function (angular) {
    angular.module('trng.courses.classes').factory('trng.courses.classes.ClassModel', [
        '$q', '$log', 'trng.services.ClassesService', 'trng.courses.courses.CourseModel',
        'trng.services.StudentsService',
        function ($q, $log, classesService, courseModel, studentsService) {

            var classesLoaded = false;

            var classes = [];

            var getClassById = function(classId) {
                return _.find(classes, function(currentClass) {
                    return currentClass.hasOwnProperty('id') && currentClass['id'] === classId;
                });
            };

            var service = {
                classes: classes,

                getClassById: function(classId) {
                    if (classesLoaded) {
                        var deferred = $q.defer();
                        var promise = deferred.promise;
                        deferred.resolve(getClassById(classId));
                        return promise;
                    }

                    return this.getAllClasses().then(function(result) {
                        return getClassById(classId);
                    });
                },

                getAllClasses: function () {
                    if (classesLoaded) {
                        var deferred = $q.defer();
                        var promise = deferred.promise;
                        deferred.resolve(classes);
                        return promise;
                    }

                    // First get all of the classes themselves.
                    return classesService.getAllClasses().then(function(result) {
                        for (var i = 0; i < result.length; i++) {
                            classes.push(result[i]);
                        }
                    }).then(function(result) {
                        // Now that we have the classes, try to match them with their corresponding courses.
                        return courseModel.getAllCourses().then(function(result) {
                            _.forEach(classes, function(currentClass) {
                                if (currentClass && currentClass.hasOwnProperty('courseId')) {
                                    // Getting a course is also a promise-based API.
                                    courseModel.getCourseById(currentClass['courseId']).then(function(matchingCourse) {
                                        currentClass['course'] = matchingCourse;
                                    });
                                }
                            });
                        });
                    }).then(function(result) {
                        // Get all of the students.
                        return studentsService.getAllStudents().then(function(allStudents) {
                            // Now go over all of the classes in the model, and try to match the students of each
                            // class with the list of all students.
                            _.forEach(classes, function(currentClass) {
                                if (currentClass && currentClass.hasOwnProperty('students')) {

                                    // The students of the class are held in a map, of studentId to studentClassInfo -
                                    // information that's specific to the student in this class.
                                    // The idea is the convert this map into an array that will hold both the info
                                    // of the student from the general student list, and the additional info of
                                    // that student in the class.
                                    var studentsArray = _.map(currentClass['students'], function(studentClassInfo, studentId) {
                                        var student = _.find(allStudents, function(currentStudent) {
                                            return (currentStudent && currentStudent.hasOwnProperty('id') && currentStudent['id'] === studentId);
                                        });
                                        _.assign(studentClassInfo, student);
                                        return studentClassInfo;
                                    });
                                    currentClass['students'] = studentsArray;
                                }
                            });
                        });
                    }).then(function(result) {
                        // Only once the whole classes-courses mix is complete, mark the classes as loaded.
                        classesLoaded = true;
                    });
                },

                deleteClasses: function(classesToDelete) {
                    for (var i = 0; i < classesToDelete.length; i++) {
                        var currentId = classesToDelete[i]['id'];
                        _.pull(classes, classesToDelete[i]);
                    }
                },

                deleteClassById: function(classId) {
                    _.remove(classes, function(currentClass) {
                        return currentClass.hasOwnProperty('id') && currentClass['id'] === classId;
                    });
                },

                deleteStudents: function(theClass, classesToDelete) {
                    for (var i = 0; i < classesToDelete.length; i++) {
                        var currentId = classesToDelete[i]['id'];
                        _.pull(theClass['students'], classesToDelete[i]);
                    }
                },

                deleteStudent: function(theClass, studentId) {
                    _.remove(theClass['students'], function(currentStudent) {
                        return currentStudent.hasOwnProperty('id') && currentStudent['id'] === studentId;
                    });
                }
            };

            return service;
        }]);
})(angular);