'use strict';

exports.courses = function(request, response) {

    var courses = [
        {
            "id": "1",
            "name": "Firewall basic",
            "description": "Firewall basic",
            "ravelloCredentials": {
                "username": "pai.mei@ravellosystems.com",
                "password": "123456"
            },
            "blueprints": [
                {
                    "id": "1",
                    "name": "firewall basic bp01",
                    "description": "",
                    "creationTime": "22/06/2013 09:53:21",
                    "owner": "danielw",
                    "displayForStudents": "Firewall basic environment"
                },
                {
                    "id": "2",
                    "name": "firewall advanced bp01",
                    "description": "",
                    "creationTime": "02/04/2013 11:44:21",
                    "owner": "danielw",
                    "displayForStudents": "Firewall advanced environment"
                }
            ]
        },
        {
            "id": "2",
            "name": "Firewall advanved",
            "description": "Firewall advanved",
            "ravelloCredentials": {
                "username": "hatori.hanzo@ravellosystems.com",
                "password": "123456"
            },
            "blueprints": [
                {
                    "id": "2",
                    "name": "firewall advanced bp01",
                    "description": "",
                    "creationTime": "02/04/2013 11:44:21",
                    "owner": "danielw",
                    "displayForStudents": "Firewall advanced environment"
                }
            ]
        }
    ];

    response.json(courses);
};