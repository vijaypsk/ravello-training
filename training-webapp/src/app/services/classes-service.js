'use strict';

angular.module('trng.services').factory('ClassesService', [
	'$q',
	'ClassesProxy',
	'ClassesTransformer',
	'AppsService',
	function($q, ClassesProxy, ClassesTrans, AppsService) {

        var cachedClasses = null;

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

        var service = {
			getAllClasses: function() {
                if (cachedClasses) {
                    return $q.when(cachedClasses);
                }

				return ClassesProxy.getAllClasses().then(
                    function(result) {
                        cachedClasses = _.map(result.data, function(currentClassDto) {
                            return ClassesTrans.dtoToEntity(currentClassDto);
                        });
                        return cachedClasses;
                    }
                );
            },

            getClassById: function(classId) {
                if (cachedClasses) {
                    var theClass = _.find(cachedClasses, {id: classId});
                    return $q.when(theClass);
                }

                return ClassesProxy.getClassById(classId).then(
                    function(result) {
                        return ClassesTrans.dtoToEntity(result.data);
                    }
                );
            },

            getClassApps: function(classId) {
                return ClassesProxy.getClassApps(classId).then(function(result) {
                    return ClassesTrans.dtoToEntity(result.data);
                });
            },

            add: function(entity) {
                var dto = ClassesTrans.entityToDto(entity);
                return ClassesProxy.add(dto).then(
                    function(result) {
                        var persistedClassEntity = ClassesTrans.dtoToEntity(result.data);
                        cachedClasses && cachedClasses.push(persistedClassEntity);
                        return persistedClassEntity;
                    });
            },

            update: function(entity) {
                var dto = ClassesTrans.entityToDto(entity);
                return ClassesProxy.update(dto).then(
                    function(result) {
                        var persistedEntity = ClassesTrans.dtoToEntity(result.data);

                        cachedClasses && _.forEach(cachedClasses, function(currentClass, classIndex) {
                            if (currentClass.id == persistedEntity.id) {
                                cachedClasses[classIndex] = persistedEntity;
                            }
                        });

                        return persistedEntity;
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
                            return persistedEntity;
                        }
                    );
                }

                return ClassesProxy.update(dto).then(
                    function(result) {
                        var persistedEntity = ClassesTrans.dtoToEntity(result.data);

                        cachedClasses && _.forEach(cachedClasses, function(currentClass, classIndex) {
                            if (currentClass.id == persistedEntity.id) {
                                cachedClasses[classIndex] = persistedEntity;
                            }
                        });

                        return persistedEntity;
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
            }
		};
		
		return service;
    }
]);
