'use strict';

var _ = require('lodash');
var mongoose = require('mongoose-q')(require('mongoose'));

var ObjectId = mongoose.Types.ObjectId;

var User = mongoose.model('User');

exports.getUser = function(username) {
    return User.findOneQ({username: username});
};

exports.createUser = function(userData) {
    var user = new User(userData);
    return user.saveQ();
};

exports.updateUser = function(username, userData) {
    var data= _.cloneDeep(userData);
    data = _.omit(data, '_id');
    return User.findOneAndUpdateQ({'username': username}, data, {upsert: true});
};

exports.deleteUser = function(username) {
    return User.removeQ({'username': username});
};

exports.findAndDelete = function(username) {
    return User.findOneAndRemoveQ({'username': username});
};