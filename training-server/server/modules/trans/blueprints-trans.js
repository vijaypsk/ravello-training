'use strict';

var _ = require('lodash');

exports.dtoToEntity = function(dto) {
    var entity = _.pick(dto, 'id', 'name', 'creationTime', 'owner');
    entity.creationTime = new Date(dto.creationTime);
    return entity;
};

