'use strict';

var _ = require('lodash');

var blueprintsTrans = require('../trans/blueprints-trans');

exports.assignBlueprintsToCourse = function(course, ravelloBps) {
    return _.map(course.blueprints, function(currentBp) {
        var matchingRavelloBp = _.find(ravelloBps, {body: {id: _.parseInt(currentBp.id)}});

        if (!matchingRavelloBp) {
            return currentBp;
        }

        var convertedBp = blueprintsTrans.ravelloDtoToEntity(matchingRavelloBp.body);
        return _.assign(currentBp, convertedBp);
    });
};