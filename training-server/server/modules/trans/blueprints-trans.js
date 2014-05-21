'use strict';

var _ = require('lodash');

exports.ravelloDtoToEntity = function(ravelloDto) {
    var entity = _.pick(ravelloDto, 'id', 'name', 'creationTime', 'owner');
    entity.creationTime = new Date(ravelloDto.creationTime);
    return entity;
};
