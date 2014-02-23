'use strict';

var _ = require('lodash');

exports.dtoToEntity = function(dto) {
    return _.pick(dto, 'id', 'name', 'creationTime', 'owner');
};

