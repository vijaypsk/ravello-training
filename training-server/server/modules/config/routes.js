'use strict';

var _ = require('lodash');
var passport = require('passport');

var authentication = require('./../auth/training-authentication');
var authorization = require('./../auth/training-authorization');

var loginController = require('./../controllers/login-ctrl');
var classesController = require('./../controllers/classes-ctrl');
var coursesController = require('./../controllers/courses-ctrl');
var blueprintsController = require('./../controllers/blueprints-ctrl');
var studentController = require('./../controllers/student-ctrl');
var appController = require('./../controllers/app-ctrl');

//var classesController = require('./../controllers/mocks/classes-ctrl-mock');
//var coursesController = require('./../controllers/mocks/courses-ctrl-mock');
//var blueprintsController = require('./../controllers/blueprints-ctrl');
//var studentController = require('./../controllers/mocks/student-ctrl-mock');

module.exports = function(app) {

    var authConfig = {
        session: false
    };

    // Login route.
    app.post('/rest/login',
        authentication.authenticate,
        loginController.login);

    // Classes route.
    app.get('/rest/classes',
        passport.authenticate('basic', authConfig),
        authorization.isAuthorized(['TRAINER']),
        classesController.getClasses);
    app.post('/rest/classes',
        passport.authenticate('basic', authConfig),
        authorization.isAuthorized(['TRAINER']),
        classesController.createClass);
    app.delete('/rest/classes/:classId',
        passport.authenticate('basic', authConfig),
        authorization.isAuthorized(['TRAINER']),
        classesController.deleteClass);
    app.put('/rest/classes/:classId',
        passport.authenticate('basic', authConfig),
        authorization.isAuthorized(['TRAINER']),
        classesController.updateClass);

    // Courses route.
    app.get('/rest/courses',
        passport.authenticate('basic', authConfig),
        authorization.isAuthorized(['TRAINER']),
        coursesController.getCourses);
    app.get('/rest/courses/:courseId',
        passport.authenticate('basic', authConfig),
        authorization.isAuthorized(['TRAINER', 'STUDENT']),
        coursesController.getCourse);
    app.post('/rest/courses',
        passport.authenticate('basic', authConfig),
        authorization.isAuthorized(['TRAINER']),
        coursesController.createCourse);
    app.delete('/rest/courses/:courseId',
        passport.authenticate('basic', authConfig),
        authorization.isAuthorized(['TRAINER']),
        coursesController.deleteCourse);
    app.put('/rest/courses/:courseId',
        passport.authenticate('basic', authConfig),
        authorization.isAuthorized(['TRAINER']),
        coursesController.updateCourse);

    // Blueprints route.
    app.get('/rest/blueprints',
        passport.authenticate('basic', authConfig),
        authorization.isAuthorized(['TRAINER']),
        blueprintsController.getBlueprints);

    // Student route.
    app.get('/rest/students/:studentId',
        passport.authenticate('basic', {session: false}),
        authorization.isAuthorized(['STUDENT']),
        studentController.getStudentClass);
    app.get('/rest/students/:studentId/class/:classId/apps',
        passport.authenticate('basic', {session: false}),
        authorization.isAuthorized(['STUDENT']),
        studentController.getStudentClassApps);
    app.get('/rest/students/:studentId/class/:classId/apps/:appId',
        passport.authenticate('basic', {session: false}),
        authorization.isAuthorized(['STUDENT']),
        studentController.getAppVms);

    // App route.
    app.post('/rest/applications/:appId/:action',
        passport.authenticate('basic', {session: false}),
        authorization.isAuthorized(['STUDENT']),
        appController.appAction);
    app.post('/rest/applications/:appId/vms/:vmId/:action',
        passport.authenticate('basic', {session: false}),
        authorization.isAuthorized(['STUDENT']),
        appController.vmAction);
    app.get('/rest/applications/:appId/vms/:vmId/vncUrl',
        passport.authenticate('basic', {session: false}),
        authorization.isAuthorized(['STUDENT']),
        appController.vmVnc);
};
