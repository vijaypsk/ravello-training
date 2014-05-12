'use strict';

var logger = require('../config/logger');

exports.login = function(request, response) {
    var user = request.user;

    var auth = request.headers.authorization;
    response.cookie('Authorization', auth);

    logger.info("Login as user %s successful", user.username);

    response.json(user);
};
