'use strict';

var _ = require('lodash');

var determineAppDisplayName = function(course, bpId) {
    var matchingBp = _.find(course.blueprints, function(bp) {
        return bp.id == bpId;
    });

    if (matchingBp) {
        return matchingBp.displayForStudents;
    }

    return null;
};

var getNumOfRunningVms = function(app) {
    var numOfRunningVms = 0;

    if (app.deployment) {
        _.forEach(app.deployment.vms, function(vm) {
            if (vm.state === 'STARTED') {
                numOfRunningVms++;
            }
        });
    }

    return numOfRunningVms;
};

exports.ravelloObjectToStudentDto = function(course, app) {
    var numOfVms = app.design.vms.length;

    if (app.deployment && app.deployment.vms) {
        var numOfVms = app.deployment.vms.length;
    }

    var numOfRunningVms = getNumOfRunningVms(app);

    var appDisplayName = determineAppDisplayName(course, app.baseBlueprintId);

    var appViewObject = {
        id: app.id,
        name: appDisplayName ? appDisplayName : app.name,
        description: app.description,
        blueprintId: app.baseBlueprintId,
        numOfVms: numOfVms,
        numOfRunningVms: numOfRunningVms
    };

    return appViewObject;
};

exports.ravelloObjectToTrainerDto = function(app) {
    return {
        ravelloId: app.id,
        name: app.name,
        blueprintId: app.baseBlueprintId.toString(),
        creationTime: new Date(parseInt(app.creationTime)),
        numOfRunningVms: app.deployment ? app.deployment.totalActiveVms : 0,
        expirationTime: app.deployment ? app.deployment.expirationTime : null,
        hasDeployment: !!app.deployment
    };
};
