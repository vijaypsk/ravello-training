'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;

var User = mongoose.model('User');

module.exports = function() {
    passport.use(new  BasicStrategy(
        function(username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (!user.validatePassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }
    ));
};