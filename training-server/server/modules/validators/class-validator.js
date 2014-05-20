
var _ = require('lodash');

var ValidationStatus = require('./validation-status');

exports.validate = function(theClass) {
    return validateUniqueUsername(theClass);
};

function validateUniqueUsername(theClass) {
    var validationStatuses = [];

    var usernamesMap = {};

    _.forEach(theClass.students, function(currentStudent) {
        if (!usernamesMap[currentStudent.user.username]) {
            usernamesMap[currentStudent.user.username] = true;
        } else {
            validationStatuses.push(new ValidationStatus(false, "Username '" + currentStudent.user.username + "' already exists"));
        }
    });

    return validationStatuses;
}