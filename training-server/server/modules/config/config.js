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

        // General configuration.
        app.set('port', process.env.PORT || 3000);

        // Middleware
        app.use(require('express-bunyan-logger')());
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.methodOverride());
        app.use(express.cookieParser());
        app.use(passport.initialize());
        app.use(app.router);

        // DB configuration.

        mongoose.connect('mongodb://localhost/training');

        // Passport config.

        passportConfig();
    });
};
