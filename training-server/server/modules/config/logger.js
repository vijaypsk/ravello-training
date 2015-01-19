'use strict';

var bunyan = require("bunyan");
var PrettyStream = require('bunyan-prettystream');

var prettyStdOut = new PrettyStream({mode: 'short'});
prettyStdOut.pipe(process.stdout);

var devStreams = [
    {
        stream: prettyStdOut,
		type: 'raw',
        level: 'debug'
    }
];

var productionStreams = [
    {
        path: 'ravello_training_server.log',
        level: 'info'
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

var logger = bunyan.createLogger(productionConfig);

module.exports = logger;

