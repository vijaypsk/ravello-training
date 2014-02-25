'use strict';

var _ = require('lodash');

exports.isAuthorized = function(roles) {
    return function(req, res, next) {
        var user = req.user;

        var roleApproved = false;
        _.forEach(roles, function(role) {
            if (user.role && user.role === role) {
                roleApproved = true;
            }
        });

        if (roleApproved) {
            next();
        } else {
            res.send(401, "User is not authorized");
        }
    }
};
