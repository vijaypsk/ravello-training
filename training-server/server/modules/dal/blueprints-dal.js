'use strict';

var q = require('q');

exports.getBlueprints = function() {

    var blueprints = [
        {
            "id": "1",
            "name": "firewall basic bp01",
            "description": "",
            "creationTime": "22/06/2013 09:53:21",
            "owner": "danielw"
        },
        {
            "id": "2",
            "name": "firewall advanced bp01",
            "description": "",
            "creationTime": "02/04/2013 11:44:21",
            "owner": "danielw"
        },
        {
            "id": "3",
            "name": "checkpoint bp03",
            "description": "",
            "creationTime": "30/05/2013 16:22:00",
            "owner": "hadas.birin"
        },
        {
            "id": "4",
            "name": "checkpoint bp04",
            "description": "",
            "creationTime": "21/11/2012 10:45:15",
            "owner": "danielw"
        }
    ];

    var deferred = q.defer();
    deferred.resolve(blueprints);

    return deferred.promise;
};