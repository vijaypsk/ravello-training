'use strict';


var _ = require('lodash');
var mongoose = require('mongoose-q')(require('mongoose'));

var ObjectId = mongoose.Types.ObjectId;

var TrainingClass = mongoose.model('TrainingClass');

exports.getClasses = function() {
    return TrainingClass.findQ().then(function(entities) {
        return _.map(entities, function(entity) {
            return TrainingClass.entityToDto(entity.toObject(), entity.id);
        });
    });
};

exports.createClass = function(classData) {
    var entityData = TrainingClass.dtoToEntity(classData);

    var newClass = new TrainingClass(entityData);

    return newClass.saveQ().then(function(entity) {
        return TrainingClass.entityToDto(entity.toObject(), entity.id);
    });
};

exports.updateClass = function(classId, classData) {
    var updatedClassEntity = TrainingClass.dtoToEntity(classData);

    return TrainingClass.updateQ({'_id': new ObjectId(classId)}, updatedClassEntity);
};

exports.deleteClass = function(classId) {
    return TrainingClass.removeQ({'_id': new ObjectId(classId)});
};
