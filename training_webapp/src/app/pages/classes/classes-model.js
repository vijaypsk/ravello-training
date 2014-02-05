'use strict';

(function (angular) {
    angular.module('trng.courses.classes').factory('trng.courses.classes.ClassModel', [
        '$q', '$log', 'trng.services.ClassesService', 'trng.courses.courses.CourseModel',
        'trng.services.StudentsService',
        function ($q, $log, classesService, courseModel, studentsService) {

            var classesLoaded = false;

            var classes = [];

            var currentClass = null;

            var getClassById = function(classId) {
                var foundClasses = _.where(classes, {id: classId});
                if (foundClasses && foundClasses.length > 0) {
                    return foundClasses[0];
                }
                return null;
            };

            var model = {
                classes: classes,

                setCurrentClass: function(theClass) {
                    currentClass = _.cloneDeep(theClass);
                },

                setCurrentClassById: function(classId) {
                    model.setCurrentClass(getClassById(classId));
                },

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

                /*
                 * The idea of this function is to encapsulate the code that deals with getting the currently
                 * edited class in a clean manner.
                 * This means getting the currentClass if it's set, or finding and cloning the class in the
                 * classes list.
                 */
                getCurrentClass: function(classId) {
                    if (currentClass) {
                        var deferred = $q.defer();
                        var promise = deferred.promise;
                        deferred.resolve(currentClass);
                        return promise;
                    }

                    return model.getClassById(classId).
                        then(function(result) {
                            model.setCurrentClass(result);
                            return currentClass;
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
                    return classesService.getAllClasses().
                        then(function(result) {
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
                                            var matchingStudents = _.where(allStudents, {id: studentId});
                                            if (matchingStudents && matchingStudents.length > 0) {
                                                var student = matchingStudents[0];
                                                _.assign(studentClassInfo, student);
                                                return studentClassInfo;
                                            }
                                        });
                                        currentClass['students'] = studentsArray;
                                    }
                                });
                            });
                        }).then(function(result) {
                            // Only once the whole classes-courses-students mix is complete, mark the classes as loaded.
                            classesLoaded = true;
                            return classes;
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
                },

                save: function(classToSave) {
                    var exists = false;
                    var matchingClasses = _.where(classes, {id: classToSave['id']});
                    exists = matchingClasses && matchingClasses.length > 0;

                    if (exists) {
                        classes = _.map(classes, function(currentClass) {
                            if (currentClass['id'] == classToSave['id']) {
                                return classToSave;
                            }
                            return currentClass;
                        });
                        classesService.update(classToSave);
                    } else {
                        classes.push(classToSave);
                        classesService.add(classToSave);
                    }
                }
            };

            return model;
        }]);
})(angular);