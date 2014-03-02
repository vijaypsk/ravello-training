'use strict';

var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');

var usersModel = require('./../model/users-model');
var classesModel = require('./../model/classes-model');
var coursesModel = require('./../model/courses-model');

var passportConfig = require('./config-passport');

module.exports = function(app) {
    app.configure(function() {

        console.log("NODE_ENV: " + app.get('env'));

        // General configuration.
        app.set('port', process.env.PORT || 3000);

        // Middleware
        app.use(express.logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.methodOverride());
        app.use(express.cookieParser());
        app.use(passport.initialize());
        app.use(app.router);

        // Development only.

        if ('development' == app.get('env')) {
            app.use(express.errorHandler());
        }

        // DB configuration.

        mongoose.connect('mongodb://localhost/training');

        // Passport config.

        passportConfig();
    });
};
