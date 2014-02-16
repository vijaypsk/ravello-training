'use strict';

var blueprintsDal = require('../dal/blueprints-dal');

exports.getBlueprints = function(request, response) {
    var blueprints = blueprintsDal.getBlueprints().then(function(blueprints) {
        response.json(blueprints);
    }).fail(function(error) {
        console.log("Could not load blueprints, error: " + error);
    });
};