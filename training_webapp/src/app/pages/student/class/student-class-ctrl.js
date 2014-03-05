'use strict';

angular.module('trng.student').controller('studentClassController', [
    '$log',
    '$scope',
    '$state',
    'trng.services.AppsService',
    'student',
    'course',
    'apps',
    function($log, $scope, $state, appsService, student, course, apps) {
        $scope.init = function() {
            $scope.name = student.firstName + ' ' + student.surname;
            $scope.student = student;
            $scope.apps = apps;

            $scope.initDescription();
            $scope.initAppsDataGrid();
        };

        $scope.initDescription = function() {
            $scope.description = course['description'] +  ' ' + $scope.student['userClass']['description'];
        };

        $scope.initAppsColumns = function() {
            $scope.appsColumns = [
                {
                    field: 'name',
                    displayName: 'Name',
                    cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="view(row)">' +
                            '<i></i> {{row.getProperty(col.field)}}' +
                        '</a>'
                },
                {
                    field: 'numOfVms',
                    displayName: '# of VMs'
                },
                {
                    field: 'numOfRunningVms',
                    displayName: '# of running VMs'
                },
                {
                    displayName: 'Actions',
                    cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="view(row)">' +
                            '<i class="icon-search"></i> View' +
                        '</a>'
                }
            ];
        };

        $scope.initAppsDataGrid = function() {
            $scope.selectedApps = [];

            $scope.initAppsColumns();

            $scope.studentAppsDataGird = {
                data: 'apps',
                columnDefs: $scope.appsColumns,
                selectedItems: $scope.selectedApps
            };
        };

        $scope.view = function(appToView) {
            var appId = appToView.getProperty("id");
            $state.go("^.single-app", {appId: appId});
        };

        $scope.startApp = function(app) {
            var bpId = app.getProperty('blueprintId');
            var bpPermissions = $scope.student['userClass']['blueprintPermissions'][bpId];

            if (bpPermissions.startVms) {
                appsService.startApp(app.getProperty('id'));
            }
        };

        $scope.stopApp = function(app) {
            var bpId = app.getProperty('blueprintId');
            var bpPermissions = $scope.student['userClass']['blueprintPermissions'][bpId];

            if (bpPermissions.stopVms) {
                appsService.stopApp(app.getProperty('id'));
            }
        };

        $scope.init();
    }
]);

var studentClassResolver = {
    course: [
        '$q', 'trng.services.CoursesService', 'student',
        function($q, coursesService, student) {
            if (student.hasOwnProperty('userClass') &&
                student['userClass'].hasOwnProperty('courseId')) {

                var courseId = student['userClass']['courseId'];
                return coursesService.getCourseById(courseId);
            }

            var deferred = $q.defer();
            deferred.reject("Could not find student or the course of the student's class");
            return deferred.promise;
        }
    ],

    apps: [
        '$log', 'trng.services.StudentsService', 'student',
        function($log, studentsService, student) {
            return studentsService.getStudentClassApps(student._id, student['userClass']['_id']);
        }
    ]
};