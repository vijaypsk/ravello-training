'use strict';

require('./model/classes_model');

var classes = require('./dal/classes_dal');
var courses = require('./dal/courses');
var blueprints = require('./dal/blueprints');

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
    app.get('/rest/courses', courses.courses);

    // Blueprints route.
    app.get('/rest/blueprints', blueprints.blueprints);
};
