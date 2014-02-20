'use strict';

var _ = require('lodash');

exports.dtoToEntity = function(dto) {
    var entity = dto;

    _.forEach(entity.students, function(student) {
        var bpPermissionsArray = [];
        _.forIn(student.blueprintPermissions, function(bpPermission, bpId) {
            bpPermission.bpId = bpId;
            bpPermissionsArray.push(bpPermission);
        });
        student.blueprintPermissions = bpPermissionsArray;

        var appsArray = [];
        _.forIn(student.apps, function(app, appId) {
            app.appId = appId;
            appsArray.push(app);
        });
        student.apps = appsArray;
    });

    return entity;
};

exports.entityToDto = function(entityDocument) {
    var dto = entityDocument.toJSON();

    _.forEach(dto.students, function(student) {
        var bpPermissionsMap = {};
        _.forEach(student.blueprintPermissions, function(bpPermissions) {
            var bpId = bpPermissions.bpId;
            bpPermissions = _.omit(bpPermissions, 'bpId');
            bpPermissionsMap[bpId] = bpPermissions;
        });
        student.blueprintPermissions = bpPermissionsMap;

        var appsMap = {};
        _.forEach(student.apps, function(app) {
            var appId = app.appId;
            app = _.omit(app, 'appId');
            appsMap[appId] = app;
        });
        student.apps = appsMap;
    });

    return dto;
};