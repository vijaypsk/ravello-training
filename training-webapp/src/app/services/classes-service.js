'use strict';

angular.module('trng.services').factory('ClassesService', [
	'$rootScope',
	'$q',
	'CommonConstants',
	'ClassesProxy',
	'ClassesTransformer',
	'CoursesService',
	'AppsService',
	'LoginModel',
	'FileUtil',
	function($rootScope, $q, CommonConstants, ClassesProxy, ClassesTrans, CoursesService, AppsService, LoginModel, FileUtil) {

        var cachedClasses = null;

		function updateClassInCache(theClass) {
			var persistedEntity = ClassesTrans.dtoToEntity(theClass);

			cachedClasses && _.forEach(cachedClasses, function(currentClass, classIndex) {
				if (currentClass.id == persistedEntity.id) {
					cachedClasses[classIndex] = persistedEntity;
				}
			});

			return persistedEntity;
		}

        var classViewModelToDomainModel = function(theClass) {
            var courseId = theClass.course.id;
            theClass.courseId = courseId;
            theClass = _.omit(theClass, 'course');

            if (!theClass.students) {
                theClass.students = [];
            }

            theClass.students = _.map(theClass.students, function(student) {
                return studentViewModelToDomainModel(student);
            });

            return theClass;
        };

        var studentViewModelToDomainModel = function(student) {
            if (student.blueprints) {
                student.blueprintPermissions = _.map(student.blueprints, function(currentBp) {
                    return _.pick(currentBp, 'bpId', 'startVms', 'stopVms', 'restartVms', 'console');
                });

                student = _.omit(student, 'blueprints');
            }

            return student;
        };

        var assignBlueprintsToStudent = function(theClass, student) {
            var blueprints = _.map(theClass.course.blueprints, function(currentBp) {
                var bpDto = _.cloneDeep(currentBp);

                var bpPermissions = _.find(student.blueprintPermissions, {bpId: currentBp.id});

                return bpPermissions ?
                    _.assign(bpDto, bpPermissions) :
                    _.assign(bpDto, {
                        'bpId': currentBp.id,
                        'startVms': true,
                        'stopVms': true,
                        'restartVms': true,
                        'console': true
                    });
            });

            student.blueprints = blueprints;
        };

		var getCoursesForClasses = function(classes) {
			return CoursesService.getAllCourses().then(
				function(courses) {
					_.forEach(classes, function(currentClass) {
						currentClass.course = _.find(courses, {id: currentClass.courseId});
						matchClassWithCourse(currentClass);
					});
					return classes;
				}
			);
		};

		var getCourseForClass = function(theClass) {
			return CoursesService.getCourseById(theClass.courseId).then(
				function(course) {
					theClass.course = course;
					matchClassWithCourse(theClass);
					return theClass;
				}
			);
		};

		var matchClassWithCourse = function(theClass) {
			if (theClass.course && theClass.course.blueprints && theClass.course.blueprints.length) {
				if (!theClass.bpPublishDetailsList) {
					theClass.bpPublishDetailsList = [];
				}

				_.forEach(theClass.course.blueprints, function(bp) {
					var bpPublishDetails = _.find(theClass.bpPublishDetailsList, {bpId: bp.id});
					if (!bpPublishDetails) {
						bpPublishDetails = {
							bpId: bp.id,
							method: CommonConstants.defaultPublishMethod,
							cloud: CommonConstants.defaultCloud,
							region: CommonConstants.defaultRegion,
							autoStop: CommonConstants.defaultAutoStopMinutes

						};
						theClass.bpPublishDetailsList.push(bpPublishDetails);
					}
					bpPublishDetails.bpName = bp.name;
				});

                _.remove(theClass.bpPublishDetailsList, function(bpPublishDetails) {
                    return bpPublishDetails && !_.find(theClass.course.blueprints, {id: bpPublishDetails.bpId});
                });
			}
		};

        // This is the way for services to communicate with one another.
        $rootScope.$on(CommonConstants.courseChangedEvent, function(event, course) {
            // The classes cache should invalidated, when there's a change in a course that might affect the classes.
            cachedClasses = null;
        });

        var service = {
			getAllClasses: function() {
                if (cachedClasses) {
					return getCoursesForClasses(cachedClasses);
                }

				return ClassesProxy.getAllClasses().then(
					function(classesResult) {
						cachedClasses = _.map(classesResult.data, function(currentClassDto) {
							return ClassesTrans.dtoToEntity(currentClassDto);
						});
						return getCoursesForClasses(cachedClasses);
					}
				);
            },

            getClassById: function(classId, track) {
                if (cachedClasses) {
                    var theClass = _.find(cachedClasses, {id: classId});
					return getCourseForClass(theClass);
                }

                return ClassesProxy.getClassById(classId, track).then(
                    function(result) {
						var persistedClass = updateClassInCache(result.data);
						return getCourseForClass(persistedClass);
                    }
                );
            },

            getClassApps: function(classId, track) {
                return ClassesProxy.getClassApps(classId, track).then(
					function(result) {
						var theClass = _.find(cachedClasses, {id: classId});
						if (theClass) {
							_.forEach(result.data.students, function(studentDto) {
								var student = _.find(theClass.students, {user: {id: studentDto.user._id}});
								if (!student.apps) {
									student.apps = [];
								}
								_.forEach(studentDto.apps, function(appDto) {
									var app = _.find(student.apps, function(currentApp) {
										return currentApp.ravelloId == appDto.ravelloId;
									});
									if (!app) {
										app = {};
										student.apps.push(app);
									}
									app.ravelloId = appDto.ravelloId;
								});
							});
						}
						return result.data;
					}
				);
            },

			createEmptyClass: function(course) {
				var theClass = {
					course: course,
					courseId: course.id,
                    ravelloCredentials: {
                        username: LoginModel.user.ravelloCredentials.username,
                        password: LoginModel.user.ravelloCredentials.password,
                        overrideTrainerCredentials: false
                    },
                    active: true,
                    students: []
				};

				matchClassWithCourse(theClass);

				return theClass;
			},

            add: function(entity) {
                var dto = ClassesTrans.entityToDto(entity);
                return ClassesProxy.add(dto).then(
                    function(result) {
                        var persistedClassEntity = ClassesTrans.dtoToEntity(result.data);
                        cachedClasses && cachedClasses.push(persistedClassEntity);
                        return getCourseForClass(persistedClassEntity);
                    });
            },

            update: function(entity) {
                var dto = ClassesTrans.entityToDto(entity);
                return ClassesProxy.update(dto).then(
                    function(result) {
						var persistedClassEntity = updateClassInCache(result.data);
						return getCourseForClass(persistedClassEntity);
                    }
                );
            },

            delete: function(entity) {
                var dto = ClassesTrans.entityToDto(entity);
                return ClassesProxy.delete(dto).then(
                    function(result) {
                        cachedClasses && _.remove(cachedClasses, {id: entity.id});
                        return result;
                    }
                );
            },

            deleteById: function(entityId) {
                return ClassesProxy.deleteById(entityId).then(
                    function(result) {
                        cachedClasses && _.remove(cachedClasses, {id: entityId});
                        return result;
                    }
                );
            },

            saveOrUpdate: function(entity) {
                var dto = ClassesTrans.entityToDto(classViewModelToDomainModel(entity));

                if (!entity.id) {
                    return ClassesProxy.add(dto).then(
                        function(result) {
                            var persistedDto = result.data;
                            entity.id = persistedDto.id;
                            var persistedEntity = ClassesTrans.dtoToEntity(persistedDto);
                            cachedClasses && cachedClasses.push(persistedEntity);
							return getCourseForClass(persistedEntity);
                        }
                    );
                }

                return ClassesProxy.update(dto).then(
                    function(result) {
						var persistedEntity = updateClassInCache(result.data);
						return getCourseForClass(persistedEntity);
                    }
                );
            },

            getStudent: function(theClass, studentId) {
                var student = _.find(theClass.students, {id: studentId});
                assignBlueprintsToStudent(theClass, student);
                return student;
            },

            createNewStudent: function(theClass) {
                var student = {
                    user: {}
                };

                assignBlueprintsToStudent(theClass, student);

                if (!theClass.students) {
                    theClass.students = [];
                }

                return student;
            },

            // It's important to create apps for students via the ClassesService, since such an action really affects
            // the student, and hence the class, and therefore should happen from here (technically, it's important to update
            // the cache after a newly app is created for a student in a class).
            // The same goes for deleting an app of course.

			createAppForStudents: function(classId, appsData) {
				return AppsService.createApps(classId, appsData);
			},

            deleteAppForStudent: function(classId, studentUserId, appRavelloId) {
                return AppsService.deleteApp(appRavelloId, studentUserId).then(
                    function(result) {
                        if (cachedClasses) {
                            var theClass = _.find(cachedClasses, {id: classId});
                            if (theClass) {
                                var student = _.find(theClass.students, {user: {id: studentUserId}});
                                student && _.remove(student.apps, {ravelloId: appRavelloId.toString()});
                                return result;
                            }
                        }
                    }
                );
            },

            exportAppsToCsv: function(classId, appIds) {
                return ClassesProxy.exportAppsToCsv(classId, appIds).then(
                    function(response) {
                        FileUtil.downloadText('apps.csv', response.data);
                    }
                );
            }
		};
		
		return service;
    }
]);
