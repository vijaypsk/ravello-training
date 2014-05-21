'use strict';

var _ = require('lodash');
var datejs = require('datejs');

var properties = require('../config/properties');

var usersTrans = require('./users-trans');

exports.ravelloDtoToEntity = function(dto) {
    var entity = dto;

    entity.startDate = new Date(dto.startDate);
    entity.endDate = new Date(dto.endDate);

    return entity;
};

exports.entityToDto = function(entityDocument) {
    var dto = entityDocument.toJSON();

    if (dto.startDate) {
        dto.startDate = dto.startDate.getTime();
    }
    if (dto.endDate) {
        dto.endDate = dto.endDate.getTime();
    }

    _.forEach(entityDocument.students, function(studentDocument) {
        var matchingstudentDto = _.find(dto.students, function(studentDto) {
            return studentDto._id && studentDto._id == studentDocument.id;
        });
        matchingstudentDto.user = usersTrans.entityToDto(studentDocument.user);
    });

    return dto;
};