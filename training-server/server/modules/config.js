'use strict';

var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

module.exports = function(app) {

    // General configuration.

    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    // Development only.

    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }

    // DB configuration.

    mongoose.connect('mongodb://localhost/training');
};
