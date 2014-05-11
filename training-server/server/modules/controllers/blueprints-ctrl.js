'use strict';

var _ = require('lodash');

var logger = require('../config/logger');

var blueprintsService = require('../services/blueprints-service');
var blueprintsTrans = require('../trans/blueprints-trans');

exports.getBlueprints = function(request, response) {
    var user = request.user;
    var userId = user.id;

    if (user.ravelloCredentials) {
        var ravelloUsername = user.ravelloCredentials.username;
        var ravelloPassword = user.ravelloCredentials.password;

        blueprintsService.getBlueprints(ravelloUsername, ravelloPassword).then(function(result) {
            if (result.status != 200) {
                response.send(result.status, result.text);
            } else {
                var dtos = _.map(result.body, function(bpDto) {
                    return blueprintsTrans.dtoToEntity(bpDto);
                });

                response.json(dtos);
            }
        }).fail(function(error) {
            var message = "Could not get blueprints from Ravello";
            logger.error(error, message);
            response.send(404, message);
        });
    } else {
        response.send(401, 'User does not have sufficient Ravello credentials');
    }
};
