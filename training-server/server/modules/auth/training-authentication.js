'use strict';

var q = require('q');

var usersDal = require('./../dal/users-dal');

exports.handleLogin = function(request, response) {
    var user = request.user;

    var auth = request.headers.authorization;
    response.cookie('Authorization', auth);

    response.json(user);
};