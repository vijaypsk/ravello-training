'use strict';

var mongoose = require('mongoose-q')(require('mongoose'), {spread: true});
var _ = require('lodash');
var q = require('q');

var ObjectId = mongoose.Types.ObjectId;

var TrainingCourse = mongoose.model('TrainingCourse');

exports.getCourses = function(request, response) {
    return TrainingCourse.find().execQ().then(function (entities) {
        return _.map(entities, function(entity) {
            return entity.toJSON();
        });
    });
};

exports.createCourse = function(courseData) {
    var newCourse = new TrainingCourse(courseData);

    return newCourse.saveQ().then(function(entity) {
        return entity.toJSON();
    });
};

exports.updateCourse = function(courseId, courseData) {
    var data = _.cloneDeep(courseData);
    data = _.omit(data, '_id');

    return TrainingCourse.updateQ({'_id': new ObjectId(courseId)}, data, {upsert: true});
};

exports.deleteCourse = function(courseId) {
    return TrainingCourse.removeQ({'_id': new ObjectId(courseId)});
};
