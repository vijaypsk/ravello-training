'use strict';

var _ = require('lodash');
var passwordHash = require('password-hash');

var setDefaultValues = function(user) {
    if (user.password) {
		user.password = passwordHash.generate(user.password, {algorithm: 'sha256'});
    }

    if (!user.role) {
        user.role = 'STUDENT';
    }
};

exports.ravelloDtoToEntity = function(dto) {
    var entity = _.cloneDeep(dto);

    setDefaultValues(entity);

    return entity;
};

exports.entityToDto = function(entity) {
    var dto = entity.toJSON();

    dto = _.omit(dto, 'password');
    dto.fullName = entity.fullName;

    return dto;
};