'use strict';

angular.module('trng.services').factory('ClassesService', [
	'ClassesProxy',
	'ClassesTransformer',
	'StudentsService',
	function(ClassesProxy, ClassesTrans, StudentsService) {

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
				return ClassesProxy.getAllClasses().then(
                    function(result) {
                        return _.map(result.data, function(currentClassDto) {
                            return ClassesTrans.dtoToEntity(currentClassDto);
                        });
                    }
                );
            },

            getClassById: function(classId) {
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
                        return ClassesTrans.dtoToEntity(result.data);
                    });
            },

            update: function(entity) {
                var dto = ClassesTrans.entityToDto(entity);
                return ClassesProxy.update(dto).then(
                    function(result) {
                        return ClassesTrans.dtoToEntity(result.data);
                    }
                );
            },

            delete: function(entity) {
                var dto = ClassesTrans.entityToDto(entity);
                return ClassesProxy.delete(dto);
            },

            deleteById: function(entityId) {
                return ClassesProxy.deleteById(entityId);
            },

            saveOrUpdate: function(entity) {
                var dto = ClassesTrans.entityToDto(classViewModelToDomainModel(entity));

                if (!entity.id) {
                    return ClassesProxy.add(dto).then(
                        function(result) {
                            var persistedDto = result.data;
                            entity.id = persistedDto.id;
                            return ClassesTrans.dtoToEntity(persistedDto);
                        }
                    );
                }

                return ClassesProxy.update(dto).then(
                    function(result) {
                        return ClassesTrans.dtoToEntity(result.data);
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
            }
		};
		
		return service;
    }
]);
