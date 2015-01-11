'use strict';

var bunyan = require("bunyan");

var devStreams = [
    {
        stream: process.stderr,
        level: "debug"
    }
];

var productionStreams = [
    {
        path: 'ravello_training_server.log',
        level: 'info'
    }
];

var devConfig = {
    name: "RavelloTrainingServer",
    streams: devStreams
};

var productionConfig = {
    name: "RavelloTrainingServer",
    streams: productionStreams
};

var logger = bunyan.createLogger(productionConfig);

module.exports = logger;

