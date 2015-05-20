'use strict';

var _ = require('lodash');

exports.ravelloDtoToEntity = function(ravelloDto) {
    var entity = _.pick(ravelloDto, 'id', 'name', 'creationTime', 'owner');

	if (!_.isNumber(ravelloDto.creationTime)) {
		ravelloDto.creationTime = parseInt(ravelloDto.creationTime);
	}

	entity.creationTime = new Date(ravelloDto.creationTime);

	if (_.isNumber(entity.id)) {
		entity.id = entity.id.toString();
	}

    return entity;
};
