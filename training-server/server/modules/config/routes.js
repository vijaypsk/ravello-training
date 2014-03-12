'use strict';

var _ = require('lodash');
var passport = require('passport');

var authentication = require('./../auth/training-authentication');
var authorization = require('./../auth/training-authorization');

var loginController = require('./../controllers/login-ctrl');
var adminController = require('./../controllers/admin-ctrl');
var trainersController = require('./../controllers/trainers-ctrl');
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

    // Admin profile routes.
    app.post('/rest/admin/profile',
        passport.authenticate('basic', authConfig),
        authorization.isAuthorized(['ADMIN']),
        adminController.updateProfile);

    // Admin trainers routes.
    app.get('/rest/admin/trainers',
        passport.authenticate('basic', authConfig),
        authorization.isAuthorized(['ADMIN']),
        trainersController.getAllTrainers);
    app.post('/rest/admin/trainers',
        passport.authenticate('basic', authConfig),
        authorization.isAuthorized(['ADMIN']),
        trainersController.saveTrainer);
    app.put('/rest/admin/trainers/:trainerId',
        passport.authenticate('basic', authConfig),
        authorization.isAuthorized(['ADMIN']),
        trainersController.updateTrainer);
    app.delete('/rest/admin/trainers/:trainerId',
        passport.authenticate('basic', authConfig),
        authorization.isAuthorized(['ADMIN']),
        trainersController.deleteTrainer);

    // Classes route.
    app.get('/rest/classes',
        passport.authenticate('basic', authConfig),
        authorization.isAuthorized(['TRAINER']),
        classesController.getClasses);
    app.get('/rest/classes/:classId/apps',
        passport.authenticate('basic', authConfig),
        authorization.isAuthorized(['TRAINER']),
        classesController.getAllClassApps);
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
    app.post('/rest/applications',
        passport.authenticate('basic', {session: false}),
        authorization.isAuthorized(['TRAINER']),
        appController.createApp);

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
