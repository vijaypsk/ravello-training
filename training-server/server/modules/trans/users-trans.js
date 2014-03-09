'use strict';

var _ = require('lodash');
var bcrypt = require('bcrypt-nodejs');

var setDefaultValues = function(user) {
    if (user.password) {
        user.password = bcrypt.hashSync(user.password);
    }

    if (!user.role) {
        user.role = 'STUDENT';
    }
};

exports.dtoToEntity = function(dto) {
    var entity = _.cloneDeep(dto);

    setDefaultValues(entity);

    return entity;
};

exports.entityToDto = function(entity) {
    var dto = entity;

    dto = _.omit(dto, 'password');

    return dto;
};