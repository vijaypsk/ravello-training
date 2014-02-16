'use strict';


var _ = require('lodash');
var mongoose = require('mongoose');

var ObjectId = mongoose.Types.ObjectId;

var TrainingClass = mongoose.model('TrainingClass');

exports.classes = function(request, response) {
    TrainingClass.find().exec(function(error, entities) {
        if (error) {
            console.log("error while reading classes");
        } else {
            var dtos = _.map(entities, function(entity) {
                return TrainingClass.entityToDto(entity.toJSON(), entity.id);
            });

            response.json(dtos);
        }
    });
};

exports.createClass = function(request, response) {
    var dtoData = request.body;
    var entityData = TrainingClass.dtoToEntity(dtoData);

    var newClass = new TrainingClass(entityData);
    newClass.save(function(error, entity) {
        if (error) {
            console.log("There was an error: " + error);
        } else {
            var dto = TrainingClass.entityToDto(entity.toObject(), entity.id);
            response.json(dto);
        }
    });
};

exports.updateClass = function(request, response) {
    var classId = request.params.classId;
    var updatedClassDto = request.body;
    var updatedClassEntity = TrainingClass.dtoToEntity(updatedClassDto);

    TrainingClass.update({'_id': new ObjectId(classId)}, updatedClassEntity,
        function(error, numOfUpdatedEntities, existingClass) {
            if (error) {
                console.log("Could not update class " + classId + ": " + error);
            }
        }
    );
};

exports.deleteClass = function(request, response) {
    var classId = request.params.classId;

    TrainingClass.remove({'_id': new ObjectId(classId)}).exec(function(error) {
        if (error) {
            console.log("Could not delete class " + classId);
        }
    });
};
