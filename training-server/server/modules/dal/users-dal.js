'use strict';

var _ = require('lodash');
var mongoose = require('mongoose-q')(require('mongoose'));

var ObjectId = mongoose.Types.ObjectId;

var User = mongoose.model('User');

exports.getUser = function(username) {
    return User.findQ({username: username}).then(function(entity) {
        return entity;
    });
};

exports.getUsers = function() {
    return User.find().then(function(entities) {
        var users = _.map(entities, function(entity) {
            return entity;
        });

        return users;
    });
};

exports.createUser = function(userData) {
    var user = new User(userData);
    return user.saveQ().then(function(entity) {
        return entity;
    });
};

exports.updateUser = function(userId, userData) {
    return User.findByIdAndUpdate({'_id': new ObjectId(userId)}, userData, {upsert: true});
};

exports.deleteUser = function(username) {
    return User.removeQ({'username': username});
};

exports.findAndDelete = function(username) {
    return User.findOneAndRemoveQ({'username': username});
};