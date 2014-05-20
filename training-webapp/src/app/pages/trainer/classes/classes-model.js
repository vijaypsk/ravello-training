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

            var findRemovedStudents = function(originalClass, newClass) {
                var removedStudents = [];

                _.forEach(originalClass.students, function(originalStudent) {
                    if (!_.find(newClass.students, {id: originalStudent.id})) {
                        removedStudents.push(originalStudent);
                    }
                });

                return removedStudents;
            };

            var model = {
                classes: classes,

                getClassById: function(classId) {
                    if (classesLoaded) {
                        return $q.when(getClassById(classId));
                    }

                    return this.getAllClasses().then(function(result) {
                        return getClassById(classId);
                    });
                },

                getAllClasses: function () {
                    if (classesLoaded) {
                        return $q.when(classes);
                    }

                    // First get all of the classes themselves.
                    return classesService.getAllClasses().then(
                        function(result) {
                            for (var i = 0; i < result.length; i++) {
                                classes.push(result[i]);
                            }
                        }
                    ).then(
                        function(result) {
                            // Now that we have the classes, try to match them with their corresponding courses.
                            return courseModel.getAllCourses().then(
                                function(result) {
                                    _.forEach(classes, function(currentClass) {
                                        currentClass && currentClass.courseId &&
                                        courseModel.getCourseById(currentClass.courseId).then(
                                            function(matchingCourse) {
                                                currentClass.course = matchingCourse;
                                            }
                                        );
                                    });
                                }
                            );
                        }
                    ).then(
                        function(result) {
                            // Only once the whole classes-courses-students mix is complete, mark the classes as loaded.
                            classesLoaded = true;
                            return classes;
                        }
                    );
                },

                getClassApps: function(classId) {
                    return classesService.getClassApps(classId);
                },

                deleteClassById: function(classesList, classId) {
                    var theClass = getClassById(classId);

                    var appsPromises = [];

                    _.forEach(theClass.students, function(currentStudent) {
                        _.forEach(currentStudent.apps, function(currentApp) {
                            var promise = appsService.deleteApp(currentApp.ravelloId, currentStudent.user.id)
                            appsPromises.push(promise);
                        });
                    });

                    $q.all(appsPromises).then(
                        function(results) {
                            classesService.deleteById(classId).then(
                                function(result) {
                                    _.remove(classesList, {id: classId});
                                    classes = classesList;
                                }
                            );
                        }
                    );
                },

                deleteStudents: function(theClass, studentsToDelete) {
                    _.forEach(studentsToDelete, function(currentStudent) {
                        _.pull(theClass.students, currentStudent);
                    });
                },

                deleteStudent: function(theClass, studentId) {
                    _.remove(theClass.students, {id: studentId});
                },

                save: function(theClass) {

                    var classToSave = model.viewModelToDomainModel(theClass);

                    var originalClass = _.find(classes, {id: theClass.id});

                    if (originalClass) {
                        // So... this is kind of messy.
                        // For an existing class, there might be students that were deleted.
                        // First, delete the apps created for theses students.
                        // Here we get all of these students (mathcing the current class with the original one),
                        // and wait for the promises of deleting the apps of these students.
                        var appsPromises = [];

                        var removedStudents = findRemovedStudents(originalClass, theClass);
                        _.forEach(removedStudents, function(currentStudent) {
                            _.forEach(currentStudent.apps, function(currentApp) {
                                var promise = appsService.deleteApp(currentApp.ravelloId, currentStudent.user.id)
                                appsPromises.push(promise);
                            });
                        });

                        return $q.all(appsPromises).then(
                            function(results) {
                                // Continue to actually update the class only once the apps are deleted.
                                return classesService.update(classToSave).then(
                                    function(persistedClass) {
                                        theClass.students = persistedClass.students;

                                        _.forEach(classes, function(currentClass, classIndex) {
                                            if (currentClass.id == theClass.id) {
                                                classes[classIndex] = theClass;
                                            }
                                        });

                                        return theClass;
                                    }
                                );
                            }
                        );
                    } else {
                        return classesService.add(classToSave).then(
                            function(persistedClass) {
                                theClass.id = persistedClass.id;
                                theClass.students = persistedClass.students;

                                classes.push(theClass);

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

                        var matchingStudent = _.find(theClass.students, {user: {id: userId}});
                        matchingStudent && matchingStudent.apps.push(persistedApp);

                        return persistedApp;
                    });
                },

                deleteAppForStudent: function(appId, classId, userId) {
                    return appsService.deleteApp(appId, userId).then(
                        function(result) {
                            var theClass = getClassById(classId);

                            var matchingStudent = _.find(theClass.students, {user: {id: userId}});
                            matchingStudent && _.remove(matchingStudent.apps, {ravelloId: appId});
                        }
                    );
                }
            };

            return model;
        }
    ]);
})(angular);