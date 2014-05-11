'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

var logger = require('./logger');

var User = mongoose.model('User');

module.exports = function() {
    passport.use(new  BasicStrategy(
        function(username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                if (err) {
                    logger.error(err, "Error in login");
                    return done(err);
                }

                if (!user) {
                    logger.warn("No user was found that matches the given credentials");
                    return done(null, false, { message: 'Incorrect username.' });
                }

                if (!user.validatePassword(password)) {
                    logger.warn("The password is incorrect");
                    return done(null, false, { message: 'Incorrect password.' });
                }

                logger.info("Login successful");
                return done(null, user);
            });
        }
    ));
};