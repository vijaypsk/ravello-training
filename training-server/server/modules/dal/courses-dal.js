'use strict';

var mongoose = require('mongoose-q')(require('mongoose'));
var _ = require('lodash');
var q = require('q');

var ObjectId = mongoose.Types.ObjectId;

var TrainingCourse = mongoose.model('TrainingCourse');

exports.getCourses = function(request, response) {
    return TrainingCourse.find().execQ().then(function (entities) {
        return _.map(entities, function(entity) {
            return TrainingCourse.entityToDto(entity.toObject(), entity.id);
        });
    });
};

exports.createCourse = function(courseData) {
    var newCourse = new TrainingCourse(courseData);

    return newCourse.saveQ().then(function(entity) {
       return TrainingCourse.entityToDto(entity.toObject(), entity.id);
    });
};

exports.updateCourse = function(courseId, courseData) {
    return TrainingCourse.updateQ({'_id': new ObjectId(courseId)}, courseData);
};

exports.deleteCourse = function(courseId) {
    return TrainingCourse.removeQ({'_id': new ObjectId(courseId)});
};
