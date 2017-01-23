'use strict';

var Agenda = require('agenda');
var moment = require('moment-timezone');
var mongoose = require('mongoose-q')(require('mongoose'));
var q = require('q');
var _ = require('lodash');
var classesDal = require('../dal/classes-dal');
var appsController = require('../controllers/app-ctrl');
var blueprintsService = require('../services/blueprints-service');

exports.initialize = function(processScheduledApps) {
        
        var mongoConnectionString = "mongodb://training:training@localhost/training";
        var agenda = new Agenda({db: {address: mongoConnectionString,collection: "scheduledjobs"}});
        
        function zonalTimeInSec (ipdate, timezone){
            var result = moment.tz(ipdate,timezone).format('X');
            //console.log('Date is ',ipdate,' Timezone is ',timezone,' Result is ',result);
            return result;
        };
            
        //var startTimeInSec = zonalTimeInSec(appDto.schedule.startTime,'UTC');
        //var currentTimeInSec = zonalTimeInSec(new Date(),'UTC');
        

        var jobName = 'processScheduledApps';
        console.log('jobName is ',jobName);
        agenda.define(jobName, function(job, done) {    
            console.log('Now processing ',jobName);
            processScheduledApps();
            done();
        });
         
        agenda.on('ready', function() {
                console.log('scheduling....');
                agenda.every('1 minute', jobName);
                agenda.start();
        });

      
    };

    exports.processScheduledApps = function(){
        console.log('processing...');
        var cls = classesDal.getClasses().then(
        function(classes) {
            //console.log(classes);
            _.forEach(classes, function(currentClass) {
                //console.log('currentClass ',currentClass);
                if (currentClass && currentClass.students) {
                    
                        
                      var req = {};
                      req.body={};
                      var apps=[];
                      q.all(_.map(currentClass.students, function(student) {
                            if(student.scheduledApps.length>0){
                                student.scheduledApps=[];
                                return q.all(_.map(currentClass.bpPublishDetailsList, function(pubDtl) {
                                             console.log('pubDtl ',pubDtl);
                                            return blueprintsService.getBlueprintById(pubDtl.bpId, currentClass.ravelloCredentials.username, currentClass.ravelloCredentials.password)
                                               .then(function(res){
                                                    return res.body.name;
                                                    //console.log('pubDtl 2',bpName);
                                                }).then(function(bpName){
                                                   var appDto = {
                                                            userId: student.user._id,
                                                            name: currentClass.name+'##'+bpName+'##'+student.user.username,
                                                            description: currentClass.description,
                                                            baseBlueprintId: pubDtl.bpId,
                                                            publishDetails: pubDtl,
                                                            bucketId: ''
                                                    };
                                                    //apps.push(appDto);
                                                    return appDto;
                                                })
                                                .catch(function(error){console.log(error);});
                                })).then(function (apps1){
                                       //console.log('apps 1  ',apps1);
                                       //apps.push(apps1);
                                       return apps1;
                                });
                         }else{
                             return q.all([]);
                         }
                      }))
                      .then(
                          function(apps){
                              req.user={};
                              apps = apps.reduce(function(prev, curr) {
                                                                return prev.concat(curr);
                                                             });
                              //console.log('currentClass ',currentClass);                                                             
                              req.body = {apps:apps,classId:currentClass._id};
                              req.user.ravelloCredentials=currentClass.ravelloCredentials;
                              var resp = {};
                              resp.send=function(data){
                                  console.log(data);
                               }
                               //console.log('About to create ',req);
                              appsController.createApps(req,resp,resp);
                          }
                      ).catch(function(error){
                          console.log("Error ",error);
                      });
                //     _.forEach(currentClass.students, function(student) {
                //           req.user={};
                //           req.user.ravelloCredentials=currentClass.ravelloCredentials;
                          
                //           if(student.scheduledApps.length>0){
                //               _.forEach(currentClass.bpPublishDetailsList, function(pubDtl) {
                //                   blueprintsService.getBlueprintById(pubDtl.bpId, currentClass.ravelloCredentials.username, currentClass.ravelloCredentials.password)
                //                         .then(function(res){
                //                             var bpName= res.body.name;
                //                             var appDto = {
                //                                     userId: student.user.username,
                //                                     name: currentClass.name+'##'+bpName+'##'+student.user.username,
                //                                     description: currentClass.description,
                //                                     baseBlueprintId: pubDtl.bpId,
                //                                     publishDetails: pubDtl,
                //                                     bucketId: ''
                //                             };
                //                             apps.push(appDto);
                //                             //console.log('apps   ',apps);
                //                         })
                //                         .catch(function(error){console.log(error);});
                //                  });
                //           }
                //         console.log('One ',apps);
                //     });
                //     req.body = {apps};
                //     console.log('One 1',req);
                // }
                // var resp = {};
                // resp.send=function(data){
                //     console.log(data);
                // }
                // appsController.createApps(req,resp,resp);
                }
            });
            
            console.log('Two ','');
            
        }
        );
    }