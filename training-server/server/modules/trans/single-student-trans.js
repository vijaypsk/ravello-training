'use strict';

var _ = require('lodash');

exports.entityToDto = function(studentEntity, classEntity) {
    var dto = studentEntity.user.toJSON();
    var studentDto = studentEntity.toJSON();
    var classDto = classEntity.toJSON();

    classDto = _.omit(classDto, 'students');

    dto.blueprintPermissions = studentDto.blueprintPermissions;
    dto.userClass = classDto;

    return dto;
};