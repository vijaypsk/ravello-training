'use strict';

var passport = require('passport');

var authConfig = {
    session: false
};

exports.authenticate = function (request, response, next) {
    passport.authenticate('basic', authConfig, function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            return response.send(401, "Username/password is incorrect");
        }

        request.user = user;
        return next();
    })(request, response, next);
};

