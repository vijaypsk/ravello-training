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

var TrainingCourse = mongoose.model('TrainingCourse', TrainingCourseSchema);