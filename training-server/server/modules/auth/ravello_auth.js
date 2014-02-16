'use strict';

var request = require('superagent');
var q = require('q');

var baseUrl = 'https://cloud.ravellosystems.com';

exports.login = function(username, password) {
    var deferred = q.defer();

    request.
        get(baseUrl + '/services/login').
        auth(username, password).
        end(q.makeNodeResolver());

    return deferred.promise;
};

