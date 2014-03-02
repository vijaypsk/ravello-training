'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

var User = mongoose.model('User');

module.exports = function() {
    passport.use(new  BasicStrategy(
        function(username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                if (err) {
                    console.log("Error in login: " + err);
                    return done(err);
                }

                if (!user) {
                    console.log("No user was found that matches the given credentials");
                    return done(null, false, { message: 'Incorrect username.' });
                }

                if (!user.validatePassword(password)) {
                    console.log("The password is incorrect");
                    return done(null, false, { message: 'Incorrect password.' });
                }

                console.log("Login successful");
                return done(null, user);
            });
        }
    ));
};