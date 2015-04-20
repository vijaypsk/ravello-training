'use strict';

var errorHandler = require('../utils/error-handler');

var mongoose = require('mongoose-q')(require('mongoose'));
var _ = require('lodash');
var q = require('q');

var ObjectId = mongoose.Types.ObjectId;

var TrainingCourse = mongoose.model('TrainingCourse');

exports.getCourses = function() {
    return TrainingCourse.find().execQ().catch(errorHandler.handleMongoError(404, 'Could not read courses'));
};

exports.getCourse = function(courseId) {
    return TrainingCourse.findByIdQ(courseId).catch(errorHandler.handleMongoError(404, 'Could not read course ' + courseId));
};

exports.createCourse = function(courseData) {
    var newCourse = new TrainingCourse(courseData);
    return newCourse.saveQ().catch(errorHandler.handleMongoError(400, 'Could not create course'));
};

exports.updateCourse = function(courseId, courseData) {
    var data = _.cloneDeep(courseData);
    data = _.omit(data, '_id');

    return TrainingCourse.updateQ({'_id': new ObjectId(courseId)}, data, {upsert: true}).catch(
        errorHandler.handleMongoError(400, 'Could not update course ' + courseId));
};

exports.deleteCourse = function(courseId) {
    return TrainingCourse.removeQ({'_id': new ObjectId(courseId)}).catch(errorHandler.handleMongoError(404, 'Could not delete course ' + courseId));
};
