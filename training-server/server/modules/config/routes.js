'use strict';

var passport = require('passport');

var trainingAuth = require('./../auth/training-auth');

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

    // Login route.
    app.post('/rest/login', passport.authenticate('basic', {session: false}), trainingAuth.handleLogin);

    // Classes route.
    app.get('/rest/classes', passport.authenticate('basic', {session: false}), classesController.getClasses);
    app.post('/rest/classes', passport.authenticate('basic', {session: false}), classesController.createClass);
    app.delete('/rest/classes/:classId', passport.authenticate('basic', {session: false}), classesController.deleteClass);
    app.put('/rest/classes/:classId', passport.authenticate('basic', {session: false}), classesController.updateClass);

    // Courses route.
    app.get('/rest/courses', passport.authenticate('basic', {session: false}), coursesController.getCourses);
    app.get('/rest/courses/:courseId', passport.authenticate('basic', {session: false}), coursesController.getCourse);
    app.post('/rest/courses', passport.authenticate('basic', {session: false}), coursesController.createCourse);
    app.delete('/rest/courses/:courseId', passport.authenticate('basic', {session: false}), coursesController.deleteCourse);
    app.put('/rest/courses/:courseId', passport.authenticate('basic', {session: false}), coursesController.updateCourse);

    // Blueprints route.
    app.get('/rest/blueprints', passport.authenticate('basic', {session: false}), blueprintsController.getBlueprints);

    // Student route.
    app.get('/rest/students/:studentId', passport.authenticate('basic', {session: false}), studentController.getStudentClass);
    app.get('/rest/students/:studentId/class/:classId/apps', passport.authenticate('basic', {session: false}), studentController.getStudentClassApps);
    app.get('/rest/students/:studentId/class/:classId/apps/:appId', passport.authenticate('basic', {session: false}), studentController.getAppVms);

    // App route.
    app.post('/rest/applications/:appId/vms/:vmId/:action', passport.authenticate('basic', {session: false}), appController.vmAction);
    app.get('/rest/applications/:appId/vms/:vmId/vncUrl', passport.authenticate('basic', {session: false}), appController.vmVnc);
};
