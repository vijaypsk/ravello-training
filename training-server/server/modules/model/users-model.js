'use strict';

var _ = require('lodash');
var q = require('q');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UsersSchema = mongoose.Schema(
    {
        firstName: String,
        surname: String,
        username: String,
        password: String,
        salt: String,
        role: String
    }
);

var setDefaultValues = function(user) {
    if (!user.salt) {
        user.salt = bcrypt.genSaltSync();
    }

    if (user.password) {
        user.password = bcrypt.hashSync(user.password, user.salt);
    }

    if (!user.role) {
        user.role = 'STUDENT';
    }
};

UsersSchema.pre('save', function(next) {
    setDefaultValues(this);
    next();
});

UsersSchema.pre('update', function(next) {
    setDefaultValues(this);
    next();
});

UsersSchema.methods = {
    validatePassword: function(password) {
        return bcrypt.compareSync(password, this.password);
    }
};

mongoose.model('User', UsersSchema);