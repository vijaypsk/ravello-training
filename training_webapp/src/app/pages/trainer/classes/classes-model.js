'use strict';

(function (angular) {
    angular.module('trng.trainer.courses.classes').factory('trng.trainer.courses.classes.ClassModel', [
        '$q',
        '$log',
        'trng.services.ClassesService',
        'trng.trainer.courses.courses.CourseModel',
        'trng.trainer.students.StudentModel',
        function ($q, $log, classesService, courseModel, studentModel) {

            var classesLoaded = false;

            var classes = [];

            var getClassById = function(classId) {
                var foundClasses = _.where(classes, {id: classId});
                if (foundClasses && foundClasses.length > 0) {
                    return foundClasses[0];
                }
                return null;
            };

            var model = {
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
                            // Only once the whole classes-courses-students mix is complete, mark the classes as loaded.
                            classesLoaded = true;
                            return classes;
                        });
                },

                deleteClassById: function(classesList, classId) {
                    _.remove(classesList, function(currentClass) {
                        return currentClass.hasOwnProperty('id') && currentClass['id'] === classId;
                    });

                    classes = classesList;

                    classesService.deleteById(classId);
                },

                deleteStudents: function(theClass, studentsToDelete) {
                    _.forEach(studentsToDelete, function(currentStudent) {
                        _.pull(theClass['students'], currentStudent);
                    });
                },

                deleteStudent: function(theClass, studentId) {
                    _.remove(theClass['students'], function(currentStudent) {
                        return currentStudent.hasOwnProperty('id') && currentStudent['id'] === studentId;
                    });
                },

                save: function(theClass) {

                    var classToSave = model.viewModelToDomainModel(theClass);

                    var exists = false;
                    var matchingClasses = _.where(classes, {id: theClass['id']});
                    exists = matchingClasses && matchingClasses.length > 0;

                    if (exists) {
                        classes = _.map(classes, function(currentClass) {
                            if (currentClass['id'] == theClass['id']) {
                                return theClass;
                            }
                            return currentClass;
                        });

                        classesService.update(classToSave);

                    } else {
                        classes.push(theClass);
                        classesService.add(classToSave).then(
                            function(result) {
                                var persistedClass = result;
                                theClass.id = persistedClass.id;
                            });
                    }
                },

                viewModelToDomainModel: function(theClass) {
                    var courseId = theClass['course']['id'];
                    theClass['courseId'] = courseId;
                    theClass = _.omit(theClass, 'course');

                    if (!theClass['students']) {
                        theClass['students'] = [];
                    }

                    theClass['students'] = _.map(theClass['students'], function(student) {
                        return studentModel.viewModelToDomainModel(student);
                    });

                    return theClass;
                }
            };

            return model;
        }
    ]);
})(angular);