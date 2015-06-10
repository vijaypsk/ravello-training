'use strict';

var _ = require('lodash');
var q = require('q');

var logger = require('../config/logger');
var errorHandler = require('../utils/error-handler');

var coursesDal = require('../dal/courses-dal');
var classesDal = require('../dal/classes-dal');

var classesTrans = require('../trans/classes-trans');
var coursesTrans = require('../trans/courses-trans');
var appsTrans = require('../trans/apps-trans');
var singleStudentTrans = require('../trans/single-student-trans');

var appsService = require('../services/apps-service');
var blueprintsService = require('../services/blueprints-service');
var coursesService = require('../services/courses-service');

/* --- Private functions --- */

var findIpConfig = function(vm, service) {
	var ipConfig = null;

	_.forEach(vm.networkConnections, function(nic) {
		if (nic.ipConfig && nic.ipConfig.id === service.ipConfigLuid) {
			ipConfig = nic.ipConfig;
		}

		if (nic.additionalIpConfig && nic.additionalIpConfig.length > 0) {
			_.forEach(nic.additionalIpConfig, function(currentIpConfig) {
				if (currentIpConfig && currentIpConfig.id === service.ipConfigLuid) {
					ipConfig = currentIpConfig;
				}
			});
		}
	});

	return ipConfig;
};

var createVmViewObject = function(vm) {
    var hostnames = _.map(vm.hostnames, function(hostname) {
        return {
            name: hostname
        };
    });

    var externalAccesses = [];

	_.forEach(vm.suppliedServices, function(currentService) {
		if (currentService && currentService.external) {
			var ipConfig = findIpConfig(vm, currentService);
			var matchingExternalAccess = _.find(externalAccesses, {name: ipConfig.fqdn});

			if (!matchingExternalAccess) {
				matchingExternalAccess = {
					name: ipConfig.fqdn,
					ip: ipConfig.publicIp,
					services: []
				};
				externalAccesses.push(matchingExternalAccess);
			}

			matchingExternalAccess.services.push({
				name: currentService.name,
				protocol: currentService.protocol,
				port: currentService.portRange,
				externalPort: currentService.externalPort
			});
		}
	});

    var firstExternalAccess = _.find(externalAccesses, function(externalAccess) {
        return (externalAccess && externalAccess.services && externalAccess.services.length > 0);
    });

    var vmViewObject = {
        id: vm.id,
        name: vm.name,
        description: vm.description,
        status: vm.state,
        hostnames: hostnames,
        allDns: externalAccesses,
        firstDns: firstExternalAccess
    };

    return vmViewObject;
};

var extractDeviceIp = function(device) {
    if (device.ipConfig) {
        if (device.ipConfig.autoIpConfig && device.ipConfig.autoIpConfig.reservedIp) {
            return device.ipConfig.autoIpConfig.reservedIp;
        }

        if (device.ipConfig.staticIpConfig && device.ipConfig.staticIpConfig.ip) {
            return device.ipConfig.staticIpConfig.ip;
        }

        if (device.ipConfig.publicIp) {
            return device.ipConfig.publicIp;
        }
    }

    return undefined;
};

/* --- Public functions --- */

exports.getStudentClass = function(request, response, next) {
    var userId = request.params.studentId;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassByUserId(userId).then(
        function(classEntity) {
            if (!classEntity.active) {
                next(errorHandler.createError(404, 'Your class is not open yet, please contact your trainer'));
                return;
            }

            var studentEntity = classEntity.findStudentByUserId(userId);
            var dto = singleStudentTrans.entityToDto(studentEntity, classEntity);
            response.json(dto);
        }
    ).catch(next);
};

exports.getStudentClassApps = function(request, response, next) {
	var userId = request.params.studentId;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassByUserId(userId).then(
        function(classEntity) {
            if (!classEntity.active) {
                next(errorHandler.createError(404, 'Your class is not open yet, please contact your trainer'));
                return;
            }

            var classData = classesTrans.entityToDto(classEntity);
            var studentData = classEntity.findStudentByUserId(userId);

            var ravelloUsername = classData.ravelloCredentials.username;
            var ravelloPassword = classData.ravelloCredentials.password;

            return coursesDal.getCourse(classEntity.courseId).then(
                function(course) {
                    return q.all(_.map(studentData.apps, function(app) {
                        return appsService.getApp(app.ravelloId, ravelloUsername, ravelloPassword);
                    })).then(
                        function(appsResults) {
                            var appViewObjects = [];

                            _.forEach(appsResults, function(appResult) {
                                var appViewObject = appsTrans.ravelloObjectToStudentDto(course, appResult.body);
                                appViewObjects.push(appViewObject);
                            });

                            response.json(appViewObjects);
                        }
                    );
                }
            );
        }
    ).catch(next);
};

exports.getAppVms = function(request, response, next) {
	var userId = request.params.studentId;
    var appId = request.params.appId;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassByUserId(userId).then(
        function(classEntity) {
            if (!classEntity.active) {
                next(errorHandler.createError(404, 'Your class is not open yet, please contact your trainer'));
                return;
            }

            var classData = classesTrans.entityToDto(classEntity);

            var ravelloUsername = classData.ravelloCredentials.username;
            var ravelloPassword = classData.ravelloCredentials.password;

			return appsService.getApp(appId, ravelloUsername, ravelloPassword).then(
                function(appResult) {
                    var app = appResult.body;

                    var vms = _.map(app.deployment.vms, function(vm) {
                        return createVmViewObject(vm);
                    });

                    var appDto = {
                        id: app.id,
                        blueprintId: app.baseBlueprintId,
                        vms: vms
                    };

                    response.json(appDto);
                }
            );
        }
    ).catch(next);
};

exports.getStudentCourse = function(request, response, next) {
	var userId = request.params.studentId;
    var courseId = request.params.courseId;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassByUserId(userId).then(
        function(classEntity) {
            if (!classEntity.active) {
                next(errorHandler.createError(404, 'Your class is not open yet, please contact your trainer'));
                return;
            }

            var classData = classesTrans.entityToDto(classEntity);

			var ravelloUsername = classData.ravelloCredentials.username;
			var ravelloPassword = classData.ravelloCredentials.password;

			return coursesDal.getCourse(courseId).then(
                function(courseEntity) {
                    var course = coursesTrans.entityToDto(courseEntity);
                    return q.all(_.map(course.blueprints, function(bp) {
                        return blueprintsService.getBlueprintById(bp.id, ravelloUsername, ravelloPassword);
                    })).then(
                        function(bpResults) {
                            course.blueprints = coursesService.assignBlueprintsToCourse(course, bpResults);
                            response.json(course);
                        }
                    );
                }
            );
        }
    ).catch(next);
};
