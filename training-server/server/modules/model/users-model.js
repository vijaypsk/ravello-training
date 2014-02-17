'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');

var UsersSchema = mongoose.Schema(
    {
        firstName: String,
        surname: String,
        username: String,
        password: String
    }
);

mongoose.model('User', UsersSchema);
