'use strict';

var _ = require('lodash');
var datejs = require('datejs');

var properties = require('../config/properties');

exports.dtoToEntity = function(dto) {
    var entity = dto;

    _.forEach(entity.students, function(student) {
        var bpPermissionsArray = [];
        _.forIn(student.blueprintPermissions, function(bpPermission, bpId) {
            bpPermission.bpId = bpId;
            bpPermissionsArray.push(bpPermission);
        });
        student.blueprintPermissions = bpPermissionsArray;
    });

    entity.startDate = Date.parse(entity.startDate);
    entity.endDate = Date.parse(entity.endDate);

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
    });

    if (dto.startDate) {
        dto.startDate = dto.startDate.toString(properties.dateFormat);
    }
    if (dto.endDate) {
        dto.endDate = dto.endDate.toString(properties.dateFormat);
    }

    return dto;
};