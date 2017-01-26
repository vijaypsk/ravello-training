'use strict';

var Agenda = require('agenda');
var moment = require('moment-timezone');
var mongoose = require('mongoose-q')(require('mongoose'));
var q = require('q');
var _ = require('lodash');
var classesDal = require('../dal/classes-dal');
var appsController = require('../controllers/app-ctrl');
var blueprintsService = require('../services/blueprints-service');

exports.initialize = function (processScheduledApps) {

    var mongoConnectionString = "mongodb://training:training@localhost/training";
    var agenda = new Agenda({ db: { address: mongoConnectionString, collection: "scheduledjobs" } });



    var jobName = 'processScheduledApps';
    console.log('jobName is ', jobName);
    agenda.define(jobName, function (job, done) {
        console.log('Now processing ', jobName);
        processScheduledApps();
        done();
    });

    agenda.on('ready', function () {
        console.log('scheduling....');
        agenda.every('1 minute', jobName);
        agenda.start();
    });


};


exports.processScheduledApps = function () {
    var cls = classesDal.getClasses().then(
        function (classes) {
            //console.log(classes);
            _.forEach(classes, function (currentClass) {
                //console.log('currentClass ',currentClass);
                if (currentClass && currentClass.students) {


                    var req = {};
                    req.body = {};
                    var apps = [];
                    q.all(_.map(currentClass.students, function (student) {
                        if (student.scheduledApps.length > 0
                            && student.scheduledApps[0].startTime
                            && readyForCreation(student.scheduledApps[0].startTime,student.scheduledApps[0].timeZone)) {

                            return q.all(_.map(currentClass.bpPublishDetailsList, function (pubDtl) {
                                return blueprintsService.getBlueprintById(pubDtl.bpId, currentClass.ravelloCredentials.username, currentClass.ravelloCredentials.password)
                                    .then(function (res) {
                                        return res.body.name;
                                        //console.log('pubDtl 2',bpName);
                                    }).then(function (bpName) {
                                        var appDto = {
                                            userId: student.user._id,
                                            name: currentClass.name + '##' + bpName + '##' + student.user.username,
                                            description: currentClass.description,
                                            baseBlueprintId: pubDtl.bpId,
                                            publishDetails: pubDtl,
                                            bucketId: ''
                                        };
                                        //apps.push(appDto);
                                        return appDto;
                                    })
                                    .catch(function (error) { console.log(error); });
                            })).then(function (apps1) {
                                //console.log('apps 1  ',apps1);
                                //apps.push(apps1);
                                return apps1;
                            });
                        } else {
                            return q.all([]);
                        }
                    }))
                        .then(
                        function (apps) {
                            req.user = {};
                            apps = apps.reduce(function (prev, curr) {
                                return prev.concat(curr);
                            });
                            //console.log('currentClass ',currentClass);                                                             
                            req.body = { apps: apps, classId: currentClass._id };
                            req.user.ravelloCredentials = currentClass.ravelloCredentials;
                            var resp = {};
                            resp.send = function (data) {
                               // console.log(data);
                            }
                            //console.log('About to create ',req);
                            appsController.createApps(req, resp, resp);
                        }
                        ).catch(function (error) {
                            console.log("Error ", error);
                        });
                }
            });


            _.forEach(classes, function (currentClass) {
                //console.log('currentClass ',currentClass);
                if (currentClass && currentClass.students) {


                    var req = {};
                    req.body = {};
                    var apps = [];
                    q.all(_.map(currentClass.students, function (student) {
                        if (student.scheduledApps.length > 0
                            && student.scheduledApps[0].startTime === null
                            && student.scheduledApps[0].endTime
                            && readyForDeletion(student.scheduledApps[0].endTime)) {
                            return q.all(_.map(student.apps, function (appData) {


                                var dto = {
                                    ravelloId: appData.ravelloId,
                                    _id: appData._id,
                                    userId: student.user._id
                                }
                               
                                return dto;
                            })).then(function (apps1) {
                                //console.log('apps 1  ',apps1);
                                //apps.push(apps1);
                                return apps1;
                            });
                        } else {
                            return q.all([]);
                        }
                    }))
                        .then(
                        function (apps) {
                            req.user = {};
                            apps = apps.reduce(function (prev, curr) {
                                return prev.concat(curr);
                            });
                            
                            if (apps.length > 0) {
                                req.body = { apps: apps, classId: currentClass._id };
                                req.user.ravelloCredentials = currentClass.ravelloCredentials;
                                var resp = {};
                                resp.send = function (data) {
                                    console.log('Response.. ',data);
                                }
                                appsController.deleteApps(req, resp, resp);
                            }
                        }
                        ).catch(function (error) {
                            console.log("Error ", error);
                        });
                }
            });


        }
    );

    function readyForCreation(schStartTime,tz) {
        var currentTimeInSec = zonalTimeInSec(new Date(), tz);
        var startTime = zonalTimeInSec(convertUTCToZonalTime(schStartTime, tz),tz);
        //console.log('readyForCreation startTime ',startTime,' currentTimeInSec ',currentTimeInSec);
        //if the startTime is less than or equal to 15 min, then application is ready to Start
        var readyFlag = false;
        if (startTime - currentTimeInSec < 900) {
            console.log('readyForCreation..');
            readyFlag = true;
        } else {
            console.log('Not readyForCreation..');
        }
        return readyFlag;
    }


    function convertUTCToZonalTime (time, zone) {
			var format = 'YYYY/MM/DD HH:mm:ss ZZ';
			// console.log("Local timezone offset ",time.getTimezoneOffset());
			// console.log("Offset for zone ",zone," is ",moment.tz(time,zone).zone());
			//console.log('time is ',time,' type is ',typeof(time));
            var hroffset = ((-1 * moment.tz(time,zone).utcOffset()) - time.getTimezoneOffset())/60;
            var result = moment.tz(time,zone).add(hroffset,'hours').toDate();
            //console.log('convertUTCToZonalTime result is ',result);
            return result;
		}

    function readyForDeletion(schEndTime) {
        var currentTimeInSec = zonalTimeInSec(new Date(), 'UTC');
        var endTime = zonalTimeInSec(schEndTime, 'UTC');
        //if the endTime is less than or equal to currentTimeInSec, then application is ready to be Deleted
        var readyFlag = false;
        if (endTime - currentTimeInSec <= 0) {
            console.log('readyForDeletion..');
            readyFlag = true;
        } else {
            console.log('Not readyForDeletion..');
        }
        return readyFlag;
    }

    function zonalTimeInSec(ipdate, timezone) {
        var result = moment.tz(ipdate, timezone).format('X');
        //console.log('Date is ',ipdate,' Timezone is ',timezone,' Result is ',result);
        return result;  
    }

}