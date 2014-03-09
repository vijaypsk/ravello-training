'use strict';

var _ = require('lodash');
var q = require('q');

var usersTrans = require('../trans/users-trans');
var usersDal = require('../dal/users-dal');

exports.updateProfile = function(request, response) {
    // This is the user is logged in currently.
    var userEntity = request.user;
    var userDto = userEntity.toJSON();

    // Setting the newly arrived username and password.
    userDto.username = request.body.username;
    userDto.password = request.body.password;

    var user = usersTrans.dtoToEntity(userDto);

    usersDal.updateUser(userEntity.id, user).then(function(persistedUser) {
        var returnedUser = usersTrans.entityToDto(persistedUser.toJSON());
        response.json(returnedUser);
    }).fail(function(error) {
        var message = "Could not update the admin profile, error: " + error;
        console.log(message);
        response.send(404, error);
    });
};