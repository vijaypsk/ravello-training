'use strict';

require('./model/classes-model');
require('./model/courses-model');

var classes = require('./dal/classes-dal');
var coursesController = require('./controllers/courses-ctrl');
var blueprintsController = require('./controllers/blueprints-ctrl');

module.exports = function(app) {

    // Enable CORS to support multi domain access.
    app.all('/*', function(req, res, next) {
        console.log("Got request in domain all");

        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        next();
    });

    // Route the application.

    // Classes route.
    app.get('/rest/classes', classes.classes);
    app.post('/rest/classes', classes.createClass);
    app.delete('/rest/classes/:classId', classes.deleteClass);
    app.put('/rest/classes/:classId', classes.updateClass);

    // Courses route.
    app.get('/rest/courses', coursesController.getCourses);
    app.post('/rest/courses', coursesController.createCourse);
    app.delete('/rest/courses/:courseId', coursesController.deleteCourse);
    app.put('/rest/courses/:courseId', coursesController.updateCourse);

    // Blueprints route.
    app.get('/rest/blueprints', blueprintsController.getBlueprints);
};
