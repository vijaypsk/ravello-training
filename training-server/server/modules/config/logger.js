'use strict';

var fs = require('fs');
var bunyan = require("bunyan");
var PrettyStream = require('bunyan-prettystream');

var logFileStream = fs.createWriteStream('ravello_training_server.log');

var prettyLogFile = new PrettyStream({mode: 'short'});
prettyLogFile.pipe(logFileStream);

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
        stream: prettyLogFile,
        type: 'raw',
        level: 'debug'
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
