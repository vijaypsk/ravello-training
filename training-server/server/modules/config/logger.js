'use strict';

var fs = require('fs');
var bunyan = require("bunyan");
var PrettyStream = require('bunyan-prettystream');

var properties = require('./properties');

function init() {
    var logFileStream = fs.createWriteStream('ravello_training_server.log', {flags: 'a'});

    var prettyLogFile = new PrettyStream({mode: 'short'});
    prettyLogFile.pipe(logFileStream);

    var prettyStdOut = new PrettyStream({mode: 'short'});
    prettyStdOut.pipe(process.stdout);

    var devStreams = [
        {
            stream: prettyStdOut,
            type: 'raw',
            level: properties.logLevel
        }
    ];

    var productionStreams = [
        {
            stream: prettyLogFile,
            type: 'raw',
            level: properties.logLevel
        }
    ];

    var devConfig = {
        name: 'RavelloTrainingServer',
        streams: devStreams
    };

    var productionConfig = {
        name: 'RavelloTrainingServer',
        streams: productionStreams
    };

    var logger = bunyan.createLogger(devConfig);

    // This is important - we want to export the actual logger object, so that it can be used conveniently in other modules.
    // But we also want to export the init function itself, which is external to the logger object.
    // This is our way to do it...
    exportedLogger.__proto__ = logger;
}

var exportedLogger = {
    init: init
};

module.exports = exportedLogger;
