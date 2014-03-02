'use strict';

exports.login = function(request, response) {
    var user = request.user;

    var auth = request.headers.authorization;
    response.cookie('Authorization', auth);

    response.json(user);
};
