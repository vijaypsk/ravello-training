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
var featureTogglesController = require('./../controllers/toggle-ctrl');
var downloadController = require('./../controllers/download-ctrl');
var versionController = require('./../controllers/version-ctrl');

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
    app.get('/rest/admin/trainers/:trainerId',
        passport.authenticate('basic', authConfig),
        authorization.isAuthorized(['ADMIN']),
        trainersController.getTrainer);
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
    app.get('/rest/classes/:classId',
        passport.authenticate('basic', authConfig),
        authorization.isAuthorized(['TRAINER']),
        classesController.getClass);
    app.get('/rest/classes/:classId/apps',
        passport.authenticate('basic', authConfig),
        authorization.isAuthorized(['TRAINER']),
        classesController.getAllClassApps);
    app.post('/rest/classes/:classId/apps/export',
        passport.authenticate('basic', {session: false}),
        authorization.isAuthorized(['TRAINER']),
        classesController.exportAppsToCsv);
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
        authorization.isAuthorized(['TRAINER']),
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
//        passport.authenticate('basic', {session: false}),
//        authorization.isAuthorized(['STUDENT']),
        studentController.getStudentClass);
    app.get('/rest/students/:studentId/class/:classId/apps',
//        passport.authenticate('basic', {session: false}),
//        authorization.isAuthorized(['STUDENT']),
        studentController.getStudentClassApps);
    app.get('/rest/students/:studentId/class/:classId/apps/:appId',
//        passport.authenticate('basic', {session: false}),
//        authorization.isAuthorized(['STUDENT']),
        studentController.getAppVms);
    app.get('/rest/students/:studentId/course/:courseId',
//        passport.authenticate('basic', authConfig),
//        authorization.isAuthorized(['STUDENT']),
        studentController.getStudentCourse);

    // App route.
    app.post('/rest/applications',
        passport.authenticate('basic', {session: false}),
        authorization.isAuthorized(['TRAINER']),
        appController.createApps);
    app.post('/rest/applications/delete',
        passport.authenticate('basic', {session: false}),
        authorization.isAuthorized(['TRAINER']),
        appController.deleteApps);

    app.post('/rest/applications/action/start',
        passport.authenticate('basic', {session: false}),
        authorization.isAuthorized(['TRAINER']),
        appController.appsBatchStart);
    app.post('/rest/applications/action/stop',
        passport.authenticate('basic', {session: false}),
        authorization.isAuthorized(['TRAINER']),
        appController.appsBatchStop);
	app.post('/rest/applications/autostop',
		passport.authenticate('basic', {session: false}),
		authorization.isAuthorized(['TRAINER']),
		appController.appsBatchAutoStop);

    app.post('/rest/applications/:appId/vms/:action',
        passport.authenticate('basic', {session: false}),
        authorization.isAuthorized(['STUDENT']),
        appController.batchVmsActions);
    app.get('/rest/applications/:appId/vms/:vmId/vncUrl',
        passport.authenticate('basic', {session: false}),
        authorization.isAuthorized(['STUDENT']),
        appController.vmVnc);

    app.get('/rest/featureToggles',
        featureTogglesController.getAllFeatureToggles);

    app.get('/rest/version',
        versionController.getVersion);

    app.post('/download/:filename',
        downloadController.downloadText);
};
