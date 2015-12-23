'use strict';

var _ = require('lodash');

var usersTrans = require('./users-trans');

exports.entityToDto = function(entityDocument) {
    var dto = entityDocument.toJSON();
    
    _.forEach(entityDocument.students, function(studentDocument) {
        var matchingstudentDto = _.find(dto.students, function(studentDto) {
            return studentDto._id && studentDto._id == studentDocument.id;
        });
        matchingstudentDto.user = usersTrans.entityToDto(studentDocument.user);
    });

    if (dto.ravelloCredentials) {
        dto.ravelloCredentials = _.omit(dto.ravelloCredentials, 'password');
    }

    return dto;
};