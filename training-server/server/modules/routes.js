'use strict';

require('./model/users-model');
require('./model/classes-model');
require('./model/courses-model');

var classesController = require('./controllers/mocks/classes-ctrl-mock');
var coursesController = require('./controllers/mocks/courses-ctrl-mock');
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
    app.get('/rest/classes', classesController.getClasses);
    app.post('/rest/classes', classesController.createClass);
    app.delete('/rest/classes/:classId', classesController.deleteClass);
    app.put('/rest/classes/:classId', classesController.updateClass);

    // Courses route.
    app.get('/rest/courses', coursesController.getCourses);
    app.post('/rest/courses', coursesController.createCourse);
    app.delete('/rest/courses/:courseId', coursesController.deleteCourse);
    app.put('/rest/courses/:courseId', coursesController.updateCourse);

    // Blueprints route.
    app.get('/rest/blueprints', blueprintsController.getBlueprints);
};
