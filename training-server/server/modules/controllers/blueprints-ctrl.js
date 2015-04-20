'use strict';

var _ = require('lodash');

var logger = require('../config/logger');

var blueprintsService = require('../services/blueprints-service');
var blueprintsTrans = require('../trans/blueprints-trans');

exports.getBlueprints = function(request, response, next) {
    var user = request.user;

    var ravelloUsername = user.ravelloCredentials ? user.ravelloCredentials.username : '';
    var ravelloPassword = user.ravelloCredentials ? user.ravelloCredentials.password : '';

    blueprintsService.getBlueprints(ravelloUsername, ravelloPassword).then(
        function(result) {
            if (result.status === 200) {
                var dtos = _.map(result.body, function(bpDto) {
                    return blueprintsTrans.ravelloDtoToEntity(bpDto);
                });

                response.json(dtos);
            }
        }
    ).catch(next);
};
