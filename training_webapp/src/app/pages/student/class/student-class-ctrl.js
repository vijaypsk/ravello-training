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
                    displayName: 'Name'
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
                        '<a href="" class="btn btn-small btn-link" ng-click="edit(row)">' +
                            '<i class="icon-pencil"></i> Edit' +
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
                selectedItems: $scope.selectedApps,
                showSelectionCheckbox: true,
                selectWithCheckboxOnly: true
            };
        };

        $scope.edit = function(appToEdit) {
            var appId = appToEdit.getProperty("id");
            $state.go("^.single-app", {appId: appId});
        };

        $scope.startApps = function() {
            _.forEach($scope.selectedApps, function(app) {
                var bpId = app['blueprintId'];
                var bpPermissions = $scope.student['userClass']['blueprintPermissions'][bpId];

                if (bpPermissions.startVms) {
                    appsService.startApp(app['id']).then(function(result) {

                    });
                }
            });
        };

        $scope.stopApps = function() {
            _.forEach($scope.selectedApps, function(app) {
                var bpId = app['blueprintId'];
                var bpPermissions = $scope.student['userClass']['blueprintPermissions'][bpId];

                if (bpPermissions.stopVms) {
                    appsService.stopApp(app['id']).then(function(result) {

                    });
                }
            });
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
        'trng.services.StudentsService', 'student',
        function(studentsService, student) {
            return studentsService.getStudentClassApps(student._id, student['userClass']['_id']);
        }
    ]
};