'use strict';

var _ = require('lodash');
var datejs = require('datejs');

var properties = require('../config/properties');

exports.entityToDto = function(studentEntity, classEntity) {
    var dto = studentEntity.user.toJSON();
    var studentDto = studentEntity.toJSON();
    var classDto = classEntity.toJSON();

    classDto = _.omit(classDto, 'students');

    if (classDto.startDate) {
        classDto.startDate = classDto.startDate.getTime();
    }
    if (classDto.endDate) {
        classDto.endDate = classDto.endDate.getTime();
    }

    dto.blueprintPermissions = studentDto.blueprintPermissions;
    dto.userClass = classDto;

    return dto;
};