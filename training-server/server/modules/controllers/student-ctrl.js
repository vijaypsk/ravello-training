'use strict';

var _ = require('lodash');
var q = require('q');

var ravelloAuth = require('../auth/ravello-auth');

var coursesDal = require('../dal/courses-dal');
var classesDal = require('../dal/classes-dal');
var classesTrans = require('../trans/classes-trans');

var blueprintsService = require('../services/blueprints-service');
var appsService = require('../services/apps-service');

/* --- Private functions --- */

var prepareClassForStudent = function(classEntity, userId) {
    var classData = classesTrans.entityToDto(classEntity);

    var matchingStudent = _.find(classData.students, function(student) {
        return (student._id = userId);
    });

    classData = _.omit(classData, 'students');
    classData.blueprintPermissions = matchingStudent.blueprintPermissions;

    return classData;
};

var determineAppDisplayName = function(course, bpId) {
    var matchingBp = _.find(course.blueprints, function(bp) {
        return bp.id = bpId;
    });

    if (matchingBp) {
        return matchingBp.displayForStudents;
    }

    return null;
};

var createAppViewObject = function(course, app) {
    var numOfVms = app.deployment.vms.length;
    var numOfRunningVms = 0;

    _.forEach(app.deployment.vms, function(vm) {
        if (vm.state === 'STARTED') {
            numOfRunningVms++;
        }
    });

    var appDisplayName = determineAppDisplayName(course, app.baseBlueprintId);

    var appViewObject = {
        id: app.id,
        name: appDisplayName ? appDisplayName : app.name,
        blueprintId: app.baseBlueprintId,
        numOfVms: numOfVms,
        numOfRunningVms: numOfRunningVms
    };

    return appViewObject;
};

var createVmViewObject = function(vm) {
    var hostnames = _.map(vm.hostnames, function(hostname) {
        return {
            name: hostname
        };
    });

    var allDns = _.map(vm.networkConnections, function(networkConnection) {
        var publicIp = networkConnection.ipConfig.publicIp;

        if (publicIp) {
            var servicesForNic = _.map(vm.suppliedServices, function(currentService) {
                // Return the service if:
                // 1. It has no ip property (meaning it is for all IPs).
                // 2. OR it has an ip property, and its equal to the current public IP.
                // 3. AND it is defined as external.
                if ((!currentService.hasOwnProperty('ip') || currentService.ip === publicIp) &&
                    currentService.external) {

                    return {
                        name: currentService.name,
                        port: currentService.externalPort
                    };
                }
            });

            return {
                name: networkConnection.ipConfig.fqdn,
                services: servicesForNic
            }
        }
    });

    var firstDns = allDns.length == 1 ? allDns[0] : _.find(allDns, function(dns) {
        return (dns.servicesForNic && dns.servicesForNic.length > 0);
    });

    var vmViewObject = {
        id: vm.id,
        name: vm.name,
        status: vm.state,
        hostnames: hostnames,
        allDns: allDns,
        firstDns: firstDns
    };

    return vmViewObject;
};

/* --- Public functions --- */

exports.getStudentClass = function(request, response) {
    var user = request.user;
    var userId = user.id;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassOfUser(userId).then(function(classEntity) {
        var classData = classesTrans.entityToDto(classEntity);
        var studentData = classEntity.findStudentByUserId(userId);

        var classPerStudent = prepareClassForStudent(classEntity, studentData._id);

        var userData = user.toJSON();
        userData.userClass = classPerStudent;

        response.json(userData);
    }).fail(function(error) {
        response.send(404, "Could not find the class of student: " + user.username);
    });
};

exports.getStudentClassApps = function(request, response) {
    var user = request.user;
    var userId = user.id;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassOfUser(userId).then(function(classEntity) {
        var classData = classesTrans.entityToDto(classEntity);
        var studentData = classEntity.findStudentByUserId(userId);

        var ravelloUsername = studentData.ravelloCredentials.username;
        var ravelloPassword = studentData.ravelloCredentials.password;

        coursesDal.getCourse(classEntity.courseId).then(function(course) {

            var appsPromises = [];

            _.forEach(studentData.apps, function(app) {
                var promise = appsService.getApp(app.ravelloId, ravelloUsername, ravelloPassword);
                appsPromises.push(promise);
            });

            q.all(appsPromises).then(function(appsResults) {

                var appViewObjects = [];

                _.forEach(appsResults, function(appResult) {
                    var appViewObject = createAppViewObject(course, appResult.body);
                    appViewObjects.push(appViewObject);
                });

                response.json(appViewObjects);

            }).fail(function(error) {
                response.send(404, "Could not get one of the apps of user: " + user.username);
            } );

        }).fail(function(error) {
            response.send(404, "Could not find the course of student: " + user.username);
        });
    }).fail(function(error) {
            response.send(404, "Could not find the class of student: " + user.username);
    });
};

exports.getAppVms = function(request, response) {
    var user = request.user;
    var userId = user.id;

    var appId = request.params.appId;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassOfUser(userId).then(function(classEntity) {

        var studentData = classEntity.findStudentByUserId(userId);

        var ravelloUsername = studentData.ravelloCredentials.username;
        var ravelloPassword = studentData.ravelloCredentials.password;

        appsService.getApp(appId, ravelloUsername, ravelloPassword).then(function(appResult) {
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
        });
    }).fail(function(error) {
        var message = "Could not load app " + appId + ", error: " + error;
        console.log(message);
        response.send(404, message);
    });
};
