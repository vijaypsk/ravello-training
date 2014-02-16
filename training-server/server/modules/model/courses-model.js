'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');

var TrainingCourseSchema = mongoose.Schema(
    {
        name: String,
        description: String,
        ravelloCredentials: {
            username: String,
            password: String
        },
        blueprints: [
            {
                id: String,
                displayForStudents: String
            }
        ]
    }
);

TrainingCourseSchema.statics.entityToDto = function(entity, id) {
    var dto = _.cloneDeep(entity);

    if (id) {
        dto.id = id;
        dto = _.omit(dto, '_id');
    }

    return dto;
};

var TrainingCourse = mongoose.model('TrainingCourse', TrainingCourseSchema);