'use strict';

var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');

// These requires must remain here, even though they are not used, in order to initialize the models.
// They must also come before the other requires of the applicative modules, since these other modules depend on the models.
require('./../model/users-model');
require('./../model/classes-model');
require('./../model/courses-model');

var logger = require('./logger');
var passportConfig = require('./config-passport');
var properties = require('./properties');

module.exports = function(app) {
    app.configure(function() {

        // General configuration.

        app.set('port', process.env.PORT || 3000);

        // Middleware

        app.use(function(request, response, next) {
            logger.info('Get request %s %s', request.method, request.url);
            next();
        });

		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.methodOverride());
        app.use(express.cookieParser());
        app.use(passport.initialize());
        app.use(app.router);

        // DB configuration.

        mongoose.connect('mongodb://' + properties.dbUsername + ':' + properties.dbPassword + '@' + 'localhost/training');

        // Passport config.

        passportConfig();
    });
};
