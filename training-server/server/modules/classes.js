'use strict';

var _ = require('lodash');
var randy = require('randy');
var mongoose = require('mongoose');

var ObjectId = mongoose.Types.ObjectId;

var TrainingClass = mongoose.model('TrainingClass');

var dtoToEntity = function(dto) {
    var entity = _.cloneDeep(dto);

    _.forEach(entity.students, function(student) {
        var bpPermissionsArray = [];
        _.forIn(student.blueprintPermissions, function(bpPermission, bpId) {
            bpPermission.bpId = bpId;
            bpPermissionsArray.push(bpPermission);
        });
        student.blueprintPermissions = bpPermissionsArray;

        var appsArray = [];
        _.forIn(student.apps, function(app, appId) {
            app.appId = appId;
            appsArray.push(app);
        });
        student.apps = appsArray;
    });

    return entity;
};

var entityToDto = function(entity, id) {
    var dto = _.cloneDeep(entity);

    _.forEach(entity.students, function(student) {
        var bpPermissionsMap = {};
        _.forEach(student.blueprintPermissions, function(bpPermissions) {
            var bpId = bpPermissions.bpId;
            bpPermissions = _.omit(bpPermissions, 'bpId');
            bpPermissionsMap[bpId] = bpPermissions;
        });
        student.blueprintPermissions = bpPermissionsMap;

        var appsMap = {};
        _.forEach(student.apps, function(app) {
            var appId = app.appId;
            app = _.omit(app, 'appId');
            appsMap[appId] = app;
        });
        student.apps = appsMap;
    });

    if (id) {
        dto.id = id;
        dto = _.omit(dto, '_id');
    }

    return dto;
};

exports.classes = function(request, response) {

    TrainingClass.find().exec(function(err, entities) {
        if (err) {
            console.log("error while reading classes");
        } else {
            var dtos = _.map(entities, function(entity) {
                return entityToDto(entity.toJSON(), entity.id);
            });

            response.json(dtos);
        }
    });
};

exports.createClass = function(request, response) {
    var dtoData = request.body;
    var entityData = dtoToEntity(dtoData);

    var newClass = new TrainingClass(entityData);
    newClass.save(function(error, entity) {
        if (error) {
            console.log("There was an error: " + error);
        } else {
            console.log("Saved class with inner id: " + entity._id);
            var dto = entityToDto(entity.toObject(), entity.id);
            response.json(dto);
        }
    });
};

exports.updateClass = function(request, response) {
    var classId = request.params.classId;
    var updatedClassDto = request.body;
    var updatedClassEntity = dtoToEntity(updatedClassDto);

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
