'use strict';


var _ = require('lodash');
var mongoose = require('mongoose-q')(require('mongoose'));

var ObjectId = mongoose.Types.ObjectId;

var TrainingClass = mongoose.model('TrainingClass');

exports.getClasses = function() {
    return TrainingClass.find().populate('students.user').execQ().then(function(entities) {
        return _.map(entities, function(entity) {
            return TrainingClass.entityToDto(entity);
        });
    });
};

exports.getClass = function(classId) {
    return TrainingClass.findById(classId).populate('students.user').execQ().then(function(entity) {
        return TrainingClass.entityToDto(entity.toObject(), entity.id);
    });
};

exports.createClass = function(classData) {
    var entityData = TrainingClass.dtoToEntity(classData);

    var newClass = new TrainingClass(entityData);

    return newClass.saveQ().then(function(entity) {
        return entity.populateQ('students.user').then(function(fullEntity) {
            return TrainingClass.entityToDto(fullEntity.toJSON());
        });
    });
};

exports.updateClass = function(classId, classData) {
    var updatedClassEntity = TrainingClass.dtoToEntity(classData);

    return TrainingClass.update({'_id': new ObjectId(classId)}, updatedClassEntity).execQ().then(function(entity) {
        return entity.populateQ('students.user').then(function(fullEntity) {
            return TrainingClass.entityToDto(fullEntity.toJSON());
        });
    });
};

exports.deleteClass = function(classId) {
    return TrainingClass.findByIdAndRemoveQ(classId);
};
