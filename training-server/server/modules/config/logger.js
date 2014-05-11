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
            path: '/var/log/ravello_training_server.log',
            level: 'debug'
        }
    ]
};

var logger = bunyan.createLogger(productionConfig);

module.exports = logger;
