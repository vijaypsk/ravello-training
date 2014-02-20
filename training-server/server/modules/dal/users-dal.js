'use strict';

var _ = require('lodash');
var mongoose = require('mongoose-q')(require('mongoose'), {spread: true});

var ObjectId = mongoose.Types.ObjectId;

var User = mongoose.model('User');

exports.getUser = function(username) {
    return User.findQ({username: username}).then(function(result) {
        return result[0];
    });
};

exports.getUsers = function() {
    return User.find().then(function(result) {
        var users = _.map(result[0], function(entity) {
            return entity;
        });

        return users;
    });
};

exports.createUser = function(userData) {
    var user = new User(userData);
    return user.saveQ().then(function(entity) {
        return entity[0];
    });
};

exports.updateUser = function(username, userData) {
    var data= _.cloneDeep(userData);
    data = _.omit(data, '_id');

    return User.findOneQ({'username': username}).then(function(user) {
        if (user) {
            return User.updateQ({'username': username}, data).spread(function(numOfUpdatedEntities, entity) {
                return entity;
            });
        } else {
            var user = User(data);
            return user.saveQ();
        }
    });
//    return User.findOneAndUpdateQ({'username': username}, userData, {upsert: true});
};

exports.deleteUser = function(username) {
    return User.removeQ({'username': username});
};

exports.findAndDelete = function(username) {
    return User.findOneAndRemoveQ({'username': username});
};