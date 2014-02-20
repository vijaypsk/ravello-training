'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');

var TrainingClassSchema = mongoose.Schema({
    name: String,
    courseId: String,
    startDate: Date,
    endDate: Date,
    ravelloCredentials: {
        useCourseCredentials: Boolean,
        username: String,
        password: String
    },
    students: [
        {
            user: {type: mongoose.Schema.ObjectId, ref: 'User'},
            blueprintPermissions: [
                {
                    bpId: String,
                    startVms: Boolean,
                    stopVms: Boolean,
                    console: Boolean
                }
            ],
            ravelloCredentials: {
                useClassCredentials: Boolean,
                username: String,
                password: String
            },
            apps: [
                {
                    appId: String,
                    blueprintId: String,
                    creationTime: Date,
                    numOfRunningVms: Number
                }
            ]
        }
    ]
});

TrainingClassSchema.statics.dtoToEntity = function(dto) {
    var entity = dto;

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

TrainingClassSchema.statics.entityToDto = function(entity) {
    var dto = entity;

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

    return dto;
};

var TrainingClass = mongoose.model('TrainingClass', TrainingClassSchema);