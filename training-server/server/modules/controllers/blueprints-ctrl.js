'use strict';

var _ = require('lodash');

var logger = require('../config/logger');

var blueprintsService = require('../services/blueprints-service');
var blueprintsTrans = require('../trans/blueprints-trans');

function getRavelloUsername(request) {
    var user = request.user;
    return  user.ravelloCredentials ? user.ravelloCredentials.username : '';
}

function getRavelloPassword(request) {
    var user = request.user;
    return user.ravelloCredentials ? user.ravelloCredentials.password : '';
}

exports.getBlueprints = function(request, response, next) {
    var ravelloUsername = getRavelloUsername(request);
    var ravelloPassword = getRavelloPassword(request);

    blueprintsService.getBlueprints(ravelloUsername, ravelloPassword).then(
        function(result) {
            if (result.status === 200) {
                var myBlueprints = _.filter(result.body, function(bp) {
                    return (!bp.firstPeerToPeerSharingUser);
                });

                var dtos = _.map(myBlueprints, function(bpDto) {
                    return blueprintsTrans.ravelloDtoToEntity(bpDto);
                });

                response.json(dtos);
            }
        }
    ).catch(next);
};

exports.getPublishLocations = function(request, response, next) {
    var ravelloUsername = getRavelloUsername(request);
    var ravelloPassword = getRavelloPassword(request);

    var bpId = request.params.bpId;

    return blueprintsService.getPublishLocations(bpId, ravelloUsername, ravelloPassword).then(
        function(result) {
            response.json(result.body);
        }
    ).catch(next);
};
