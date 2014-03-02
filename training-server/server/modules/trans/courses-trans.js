'use strict';

var _ = require('lodash');

exports.entityToDto = function(entityDocument) {
    var dto = entityDocument.toJSON();
    return dto;
};