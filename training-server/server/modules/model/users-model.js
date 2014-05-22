'use strict';

var _ = require('lodash');
var q = require('q');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var UsersSchema = mongoose.Schema(
    {
        firstName: String,
        surname: String,
        username: {
            type: String,
            unique: true
        },
        password: String,
        role: String,
        ravelloCredentials: {
            username: String,
            password: String
        }
    }
);

UsersSchema.methods = {
    validatePassword: function(password) {
        return bcrypt.compareSync(password, this.password);
    }
};

UsersSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.surname;
});

mongoose.model('User', UsersSchema);