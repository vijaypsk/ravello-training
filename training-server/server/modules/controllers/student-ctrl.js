'use strict';

var _ = require('lodash');
var q = require('q');

var logger = require('../config/logger');

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

var createVmViewObject = function(vm) {
    var hostnames = _.map(vm.hostnames, function(hostname) {
        return {
            name: hostname
        };
    });

    var allDns = [];
    _.forEach(vm.networkConnections, function(networkConnection) {
        var publicIp = extractDeviceIp(networkConnection);

        if (publicIp && networkConnection.ipConfig.hasPublicIp) {
            var servicesForNic = [];
            _.forEach(vm.suppliedServices, function(currentService) {
                // Return the service if:
                // 1. It has no ip property (meaning it is for all IPs).
                // 2. OR it has an ip property, and its equal to the current public IP.
                // 3. AND it is defined as external.
                if ((!currentService.hasOwnProperty('ip') || currentService.ip === publicIp) &&
                    currentService.external) {

                    servicesForNic.push({
                        name: currentService.name,
                        port: currentService.externalPort
                    });
                }
            });

            allDns.push({
                name: networkConnection.ipConfig.fqdn,
                services: servicesForNic,
                ip: publicIp
            });
        }
    });

    var firstDns = _.find(allDns, function(dns) {
        return (dns && dns.services && dns.services.length > 0);
    });

    var vmViewObject = {
        id: vm.id,
        name: vm.name,
        description: vm.description,
        status: vm.state,
        hostnames: hostnames,
        allDns: allDns,
        firstDns: firstDns
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

exports.getStudentClass = function(request, response) {
    var user = request.user;
    var userId = user.id;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassOfUserForNow(userId).then(
        function(classEntity) {
            if (!classEntity) {
                logger.info("Could not find an active class for user [" + user.username + "]");
                response.send(404, "You don't have a class that's taking place right now");
                return;
            }

            var studentEntity = classEntity.findStudentByUserId(userId);
            var dto = singleStudentTrans.entityToDto(studentEntity, classEntity);
            response.json(dto);
        }
    ).fail(
        function(error) {
            var message = "Could not find the class of student: " + user.username;
            logger.error(error, message);
            response.send(404, message);
        }
    );
};

exports.getStudentClassApps = function(request, response) {
    var user = request.user;
    var userId = user.id;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassOfUserForNow(userId).then(
        function(classEntity) {
            if (!classEntity) {
                logger.info("Could not find an active class for user [" + user.username + "]");
                response.send(404, "You don't have a class that's taking place right now");
                return;
            }

            var classData = classesTrans.entityToDto(classEntity);
            var studentData = classEntity.findStudentByUserId(userId);

            var ravelloUsername = studentData.ravelloCredentials.username || classData.ravelloCredentials.username;
            var ravelloPassword = studentData.ravelloCredentials.password || classData.ravelloCredentials.password;

			if (!ravelloUsername || !ravelloPassword) {
				var message = "Student does not have Ravello Credentials";
				logger.warn(message);
				response.send(401, message);
				return;
			}

            return coursesDal.getCourse(classEntity.courseId).then(
                function(course) {
                    return q.all(_.map(studentData.apps, function(app) {
                        return appsService.getApp(app.ravelloId, ravelloUsername, ravelloPassword);
                    })).then(
                        function(appsResults) {
                            var appViewObjects = [];

                            _.forEach(appsResults, function(appResult) {
								if (appResult.status >= 400 && appResult.error) {
									if (appResult.status == 401) {
										response.send(appResult.status, "Wrong Ravello credentials");
									} else {
										response.send(appResult.status, appResult.error.message);
									}
									return;
								}

                                var appViewObject = appsTrans.ravelloObjectToStudentDto(course, appResult.body);
                                appViewObjects.push(appViewObject);
                            });

                            response.json(appViewObjects);
                        }
                    ).fail(
                        function(error) {
                            var message = "Could not get one of the apps of user: " + user.username;
                            logger.error(error, message);
                            response.send(404, message);
                        }
                    );
                }
            ).fail(
                function(error) {
                    var message = "Could not find the course of student: " + user.username;
                    logger.error(error, message);
                    response.send(404, message);
                }
            );
        }
    ).fail(
        function(error) {
            var message = "Could not find the class of student: " + user.username;
            logger.error(error, message);
            response.send(404, message);
        }
    );
};

exports.getAppVms = function(request, response) {
    var user = request.user;
    var userId = user.id;

    var appId = request.params.appId;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassOfUserForNow(userId).then(
        function(classEntity) {
            if (!classEntity) {
                logger.info("Could not find an active class for user [" + user.username + "]");
                response.send(404, "You don't have a class that's taking place right now");
                return;
            }

            var classData = classesTrans.entityToDto(classEntity);
            var studentData = classEntity.findStudentByUserId(userId);

            var ravelloUsername = studentData.ravelloCredentials.username || classData.ravelloCredentials.username;
            var ravelloPassword = studentData.ravelloCredentials.password || classData.ravelloCredentials.password;

			if (!ravelloUsername || !ravelloPassword) {
				var message = "Student does not have Ravello Credentials";
				logger.warn(message);
				response.send(401, message);
				return;
			}

			appsService.getApp(appId, ravelloUsername, ravelloPassword).then(
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
            ).fail(
                function(error) {
                    var message = "Could not get application deployment information";
                    logger.error(error, message);
                    response.send(404, message);
                }
            );
        }
    ).fail(
        function(error) {
            var message = "Could not load app " + appId;
            logger.error(error, message);
            response.send(404, message);
        }
    );
};

exports.getStudentCourse = function(request, response) {
    var user = request.user;
    var userId = user.id;

    var courseId = request.params.courseId;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassOfUserForNow(userId).then(
        function(classEntity) {
            if (!classEntity) {
                logger.info("Could not find an active class for user [" + user.username + "]");
                response.send(404, "You don't have a class that's taking place right now");
                return;
            }

			var classData = classesTrans.entityToDto(classEntity);
			var studentData = classEntity.findStudentByUserId(userId);

			var ravelloUsername = studentData.ravelloCredentials.username || classData.ravelloCredentials.username;
			var ravelloPassword = studentData.ravelloCredentials.password || classData.ravelloCredentials.password;

			if (!ravelloUsername || !ravelloPassword) {
				var message = "Student does not have Ravello Credentials";
				logger.warn(message);
				response.send(401, message);
				return;
			}

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
                    ).fail(
                        function(error) {
                            var message = "Could not get one of the course's blueprints";
                            logger.error(error, message);
                            response.send(404, message);
                        }
                    );
                }
            ).fail(
                function(error) {
                    var message = "Could not load course: " + courseId;
                    logger.error(error, message);
                    response.send(404, message);
                }
            );
        }
    ).fail(
        function(error) {
            var message = "Could not load class of user " + user.username;
            logger.error(error, message);
            response.send(404, message);
        }
    );
};
