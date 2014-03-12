'use strict';

var _ = require('lodash');
var datejs = require('datejs');

var properties = require('../config/properties');

var usersTrans = require('./users-trans');

exports.dtoToEntity = function(dto) {
    var entity = dto;

    entity.startDate = Date.parse(entity.startDate);
    entity.endDate = Date.parse(entity.endDate);

    return entity;
};

exports.entityToDto = function(entityDocument) {
    var dto = entityDocument.toJSON();

    if (dto.startDate) {
        dto.startDate = dto.startDate.toString(properties.dateFormat);
    }
    if (dto.endDate) {
        dto.endDate = dto.endDate.toString(properties.dateFormat);
    }

    _.forEach(entityDocument.students, function(studentDocument) {
        var matchingstudentDto = _.find(dto.students, function(studentDto) {
            return studentDto._id == studentDocument.id;
        });

        matchingstudentDto.user = usersTrans.entityToDto(studentDocument.user);
    });

    return dto;
};