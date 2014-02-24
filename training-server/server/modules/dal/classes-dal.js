'use strict';


var _ = require('lodash');
var mongoose = require('mongoose-q')(require('mongoose'));

var ObjectId = mongoose.Types.ObjectId;

var TrainingClass = mongoose.model('TrainingClass');

exports.getClasses = function() {
    return TrainingClass.find().populate('students.user').execQ();
};

exports.getClass = function(classId) {
    return TrainingClass.findById(classId).populate('students.user').execQ();
};

exports.getClassOfUser = function(userId) {
    return TrainingClass.findOne({'students.user': new ObjectId(userId)}).populate('students.user').execQ().then(
        function(result) {
            return result;
        });
};

exports.createClass = function(classData) {
    var newClass = new TrainingClass(classData);

    return newClass.saveQ().then(function(result) {
        var entity = result;
        return entity.populateQ('students.user');
    });
};

exports.updateClass = function(classId, classData) {
    var updatedClassEntity = _.omit(classData, '_id');
    return TrainingClass.updateQ({_id: new ObjectId(classId)}, updatedClassEntity, {upsert: true});
};

exports.deleteClass = function(classId) {
    return TrainingClass.findByIdAndRemove(classId).populate('students.user').execQ();
};
