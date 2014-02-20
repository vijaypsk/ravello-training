'use strict';

var _ = require('lodash');
var randy = require('randy');

exports.getStudentClass = function(request, response) {
    var result = {
        "id": "1",
        "firstName": "Daniel",
        "surname": "Wolf",
        "userClass": {
            "id": "1",
            "name": "IDF training",
            "startDate": "22/10/2013 08:00:00",
            "endDate": "22/10/2013 13:30:00",
            "courseId": "5301bf9ebdc869b2bcf3d00f",
            "blueprintPermissions": {
                "1": {
                    "startVms": true,
                    "stopVms": true,
                    "console": false
                },
                "2": {
                    "startVms": true,
                    "stopVms": true,
                    "console": true
                }
            }
        }
    };

    response.json(result);
};

exports.getStudentClassApps = function(request, response) {
    var result = [
        {
            "id": "IDF_training_firewall_bp01_danielw",
            "name": "Firewall basic env 01",
            "numOfVms": 3,
            "numOfRunningVms": 0,
            "blueprintId": "1"
        },
        {
            "id": "Checlpoint_internal_firewall_bp02_hadasb",
            "name": "Firewall basic env 02",
            "numOfVms": 4,
            "numOfRunningVms": 3,
            "blueprintId": "2"
        }
    ];

    response.json(result);
};

exports.getAppVms = function(request, response) {
    var result = {
        "id": "Checlpoint_internal_firewall_bp02_hadasb",
            "blueprintId": "2",
            "vms": [
            {
                "id": "2",
                "name": "firewall vm",
                "status": "Stopped",
                "dns": {
                    "name": "some.thing.ravello.com",
                    "services": [
                        {
                            "name": "ssh",
                            "port": 22
                        },
                        {
                            "name": "http",
                            "port": 80
                        }
                    ]
                },
                "hostnames": [
                    {
                        "name": "some-inner-hostname"
                    },
                    {
                        "name": "some-other-inner-hostname"
                    }
                ]
            }
        ]
    };

    response.json(result);
};