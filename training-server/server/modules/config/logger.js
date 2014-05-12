'use strict';

var bunyan = require("bunyan");

var devConfig = {
    name: "RavelloTrainingServer",
    streams: [
        {
            stream: process.stderr,
            level: "debug"
        }
    ]
};

var productionConfig = {
    name: "RavelloTrainingServer",
    streams: [
        {
            path: 'ravello_training_server.log',
            level: 'debug'
        }
    ]
};

var logger = bunyan.createLogger(productionConfig);

module.exports = logger;

module.exports.config = productionConfig;
module.exports.devConfig = devConfig;

