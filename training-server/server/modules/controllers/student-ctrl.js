'use strict';

var _ = require('lodash');
var q = require('q');

var ravelloAuth = require('../auth/ravello-auth');

var classesDal = require('../dal/classes-dal');
var classesTrans = require('../trans/classes-trans');

var blueprintsService = require('../services/blueprints-service');
var appsService = require('../services/apps-service');


var findStudentInClass = function(classEntity, userId) {
    return _.find(classEntity.students, function(studentEntity) {
        return (studentEntity.user.id === userId);
    });
};

var prepareClassForStudent = function(classEntity, userId) {
    var classData = classesTrans.entityToDto(classEntity);

    var matchingStudent = _.find(classData.students, function(student) {
        return (student._id = userId);
    });

    classData = _.omit(classData, 'students');
    classData.blueprintPermissions = matchingStudent.blueprintPermissions;

    return classData;
};

var authenticateStudent = function(theClass, userId) {
    var student = findStudentInClass(theClass, userId);

    return ravelloAuth.login(student.ravelloCredentials.username, student.ravelloCredentials.password).then(
        function(result) {
            console.log("result from ravello auth: " + result);
            return result;
        }
    );
};

exports.getStudentClass = function(request, response) {
    var user = request.user;
    var userId = user.id;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassOfUser(userId).then(function(classEntity) {

        var classData = classesTrans.entityToDto(classEntity);

        // Now that we have the class, we know the student's Ravello credentials for the class,
        // and we can authenticate the user against Ravello.
        return authenticateStudent(classEntity, userId).then(function(ravelloUser) {
            var userData = user.toJSON();
            var studentData = findStudentInClass(classEntity, userId);

            var ravelloUsername = studentData.ravelloCredentials.username;
            var ravelloPassword = studentData.ravelloCredentials.password;

            // Now we want to start all of the applications of the student for this class.
            // That's why we first need to get the blueprints associated with the course.
            var bpPermissionPromises = [];
            _.forEach(studentData.blueprintPermissions, function(bpPermissions) {
                var bpId = bpPermissions.bpId;
                var promise = blueprintsService.getBlueprintById(bpId, ravelloUsername, ravelloPassword);
                bpPermissionPromises.push(promise);
            });

            q.all(bpPermissionPromises).then(function(blueprintResults) {
                _.forEach(blueprintResults, function(bpResult) {

                    var bp = bpResult.body;

                    // The application name is: bpName_className_studentName.
                    var appName = bp.name + "_" +
                        classEntity.name + "_" +
                        userData.firstName + "-" + userData.surname;

                    // See if such an app already exists. If so, we can continue.
                    // Otherwise, we need to start that app from the blueprint.
                    appsService.getApps(ravelloUsername, ravelloPassword).then(function(apps) {
                        var matchingApp = _.find(apps, function(currentApp) {
                            return currentApp.name === appName;
                        });

                        if (!matchingApp) {
                            appsService.createApp(appName, appName, bp.id, ravelloUsername, ravelloPassword).then(
                                function(result) {
                                    var classPerStudent = prepareClassForStudent(classEntity, studentData._id);
                                    userData.userClass = classPerStudent;

                                    response.json(userData);
                                }
                            );
                        } else {
                            var classPerStudent = prepareClassForStudent(classEntity, studentData._id);
                            userData.userClass = classPerStudent;

                            response.json(userData);
                        }
                    }).fail(function(error) {
                            console.log("Could not access Ravello for app " + appName + ", error: " + error);
                    });
                });
            });
        }).fail(function(error) {
            console.log("Could not authenticate student against Ravello, error: " + error);
        });

    }).fail(function(error) {
        console.log("Could not find the class associated with user " + userId + ", error: " + error);
    });
};

exports.getStudentClassApps = function(request, response) {
    var user = request.user;
    var userId = user.id;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassOfUser(userId).then(function(classEntity) {

        var classData = classesTrans.entityToDto(classEntity);

        var userData = user.toJSON();
        var studentData = findStudentInClass(classEntity, userId);

        var ravelloUsername = studentData.ravelloCredentials.username;
        var ravelloPassword = studentData.ravelloCredentials.password;

        // Now we want to start all of the applications of the student for this class.
        // That's why we first need to get the blueprints associated with the course.
        var bpPermissionPromises = [];
        _.forEach(studentData.blueprintPermissions, function(bpPermissions) {
            var bpId = bpPermissions.bpId;
            var promise = blueprintsService.getBlueprintById(bpId, ravelloUsername, ravelloPassword);
            bpPermissionPromises.push(promise);
        });

        q.all(bpPermissionPromises).then(function(blueprintResults) {
            var appPromises = [];

            var appDtos = [];

            appsService.getApps(ravelloUsername, ravelloPassword).then(function(apps) {

                _.forEach(blueprintResults, function(bpResult) {

                    var bp = bpResult.body;

                    // The application name is: bpName_className_studentName.
                    var appName = bp.name + "_" +
                        classEntity.name + "_" +
                        userData.firstName + "-" + userData.surname;

                    var matchingApp = _.find(apps, function(currentApp) {
                        return currentApp.name === appName;
                    });

                    var promise = appsService.getApp(matchingApp.id, ravelloUsername, ravelloPassword);
                    appPromises.push(promise);
                });

                q.all(appPromises).then(function(appResults) {
                    _.forEach(appResults, function(appResult) {
                        var app = appResult.body;

                        var numOfVms = app.deployment.vms.length;
                        var numOfRunningVms = 0;

                        _.forEach(app.deployment.vms, function(vm) {
                            if (vm.state === 'STARTED') {
                                numOfRunningVms++;
                            }
                        });

                        var appDto = {
                            id: app.id,
                            name: app.name,
                            blueprintId: app.baseBlueprintId,
                            numOfVms: numOfVms,
                            numOfRunningVms: numOfRunningVms
                        };

                        appDtos.push(appDto);
                    });

                    response.json(appDtos);

                }).fail(function(error) {
                        console.log("Could not get info for one of the student's apps, error: " + error);
                });
            }).fail(function(error) {
                console.log("Could not get apps from Ravello, error: " + error);
            });
        }).fail(function(error) {
            console.log("Could not get student's blueprints, error: " + error);
        });
    }).fail(function(error) {
            console.log("Could not find the class associated with user " + userId + ", error: " + error);
    });
};

exports.getAppVms = function(request, response) {
    var user = request.user;
    var userId = user.id;

    var appId = request.params.appId;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassOfUser(userId).then(function(classEntity) {

        var studentData = findStudentInClass(classEntity, userId);

        var ravelloUsername = studentData.ravelloCredentials.username;
        var ravelloPassword = studentData.ravelloCredentials.password;

        appsService.getApp(appId, ravelloUsername, ravelloPassword).then(function(appResult) {
            var app = appResult.body;

            var vms = [];

            _.forEach(app.deployment.vms, function(vm) {
                var hostnames = _.map(vm.hostnames, function(hostname) {
                    return {
                        name: hostname
                    };
                });

                var services = _.map(vm.suppliedServices, function(currentService) {
                    return {
                        name: currentService.name,
                        port: currentService.portRange
                    };
                });

                var dnsDto = {
                    name: app.deployment.network.dnsService.host[0].name,
                    services: services
                };

                var vmDto = {
                    id: vm.id,
                    name: vm.name,
                    status: vm.state,
                    hostnames: hostnames,
                    dns: dnsDto
                };

                vms.push(vmDto);
            });

            var appDto = {
                id: app.id,
                blueprintId: app.baseBlueprintId,
                vms: vms
            };

            response.json(appDto);
        });
    }).fail(function(error) {
        console.log("Could not load app " + appId + ", error: " + error);
    });
};

