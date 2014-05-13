'use strict';

(function (angular) {
    angular.module('trng.trainer.training.classes').factory('trng.trainer.training.classes.ClassModel', [
        '$q',
        '$log',
        'trng.services.ClassesService',
        'trng.trainer.training.courses.CourseModel',
        'trng.trainer.students.StudentModel',
        'trng.services.AppsService',
        function ($q, $log, classesService, courseModel, studentModel, appsService) {

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
                                        courseModel.getCourseById(currentClass.courseId).then(function(matchingCourse) {
                                            currentClass.course = matchingCourse;
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

                getClassApps: function(classId) {
                    return classesService.getClassApps(classId);
                },

                deleteClassById: function(classesList, classId) {
                    _.remove(classesList, function(currentClass) {
                        return currentClass.hasOwnProperty('id') && currentClass.id === classId;
                    });

                    classes = classesList;

                    classesService.deleteById(classId);
                },

                deleteStudents: function(theClass, studentsToDelete) {
                    _.forEach(studentsToDelete, function(currentStudent) {
                        _.pull(theClass.students, currentStudent);
                    });
                },

                deleteStudent: function(theClass, studentId) {
                    _.remove(theClass.students, function(currentStudent) {
                        return currentStudent.hasOwnProperty('id') && currentStudent.id === studentId;
                    });
                },

                save: function(theClass) {

                    var classToSave = model.viewModelToDomainModel(theClass);

                    var exists = false;
                    var matchingClasses = _.where(classes, {id: theClass.id});
                    exists = matchingClasses && matchingClasses.length > 0;

                    if (exists) {
                        classes = _.map(classes, function(currentClass) {
                            if (currentClass.id == theClass.id) {
                                return theClass;
                            }
                            return currentClass;
                        });

                        return classesService.update(classToSave).then(
                            function(persistedClass) {
                                theClass.students = persistedClass.students;
                                return theClass;
                            }
                        );
                    } else {
                        classes.push(theClass);
                        return classesService.add(classToSave).then(
                            function(persistedClass) {
                                theClass.id = persistedClass.id;
                                theClass.students = persistedClass.students;
                                return theClass;
                            }
                        );
                    }
                },

                viewModelToDomainModel: function(theClass) {
                    var courseId = theClass.course.id;
                    theClass.courseId = courseId;
                    theClass = _.omit(theClass, 'course');

                    if (!theClass.students) {
                        theClass.students = [];
                    }

                    theClass.students = _.map(theClass.students, function(student) {
                        return studentModel.viewModelToDomainModel(student);
                    });

                    return theClass;
                },

                createAppForStudent: function(classId, appName, appDesc, bpId, userId) {
                    return appsService.createApp(appName, appDesc, bpId, userId).then(function(result) {
                        var persistedApp = result.data;

                        var theClass = getClassById(classId);

                        var matchingStudent = _.find(theClass.students, function(student) {
                            return student.user.id == userId;
                        });

                        if (matchingStudent) {
                            matchingStudent.apps.push(persistedApp);
                        }

                        return persistedApp;
                    });
                },

                deleteAppForStudent: function(appId, classId, userId) {
                    return appsService.deleteApp(appId, userId).then(
                        function(result) {
                            var theClass = getClassById(classId);

                            var matchingStudent = _.find(theClass.students, {'user.id': userId});
                            matchingStudent && _.remove(matchingStudent.apps, {ravelloId: appId});
                        }
                    );
                }
            };

            return model;
        }
    ]);
})(angular);