'use strict';

var _ = require('lodash');
var datejs = require('datejs');

var properties = require('../config/properties');

exports.entityToDto = function(studentEntity, classEntity) {
    var dto = studentEntity.user.toJSON();
    var studentDto = studentEntity.toJSON();
    var classDto = classEntity.toJSON();

    classDto = _.omit(classDto, 'students');

    dto.blueprintPermissions = studentDto.blueprintPermissions;
    dto.userClass = classDto;

    if (dto.userClass.ravelloCredentials) {
        dto.userClass.ravelloCredentials = _.omit(dto.userClass.ravelloCredentials, 'password');
    }

    return dto;
};