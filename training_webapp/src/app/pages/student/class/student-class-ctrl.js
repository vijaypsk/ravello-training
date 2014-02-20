'use strict';

angular.module('trng.student').controller('studentClassController', [
    '$log',
    '$scope',
    '$state',
    'student',
    'course',
    'apps',
    function($log, $scope, $state, student, course, apps) {
        $scope.init = function() {
            $scope.name = "daniel";
            $scope.student = student;
            $scope.apps = apps;

            $scope.initDescription();
            $scope.initAppsDataGrid();
        };

        $scope.initDescription = function() {
            $scope.description = course['description'] +  ' ' + $scope.student['class']['description'];
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
            $scope.initAppsColumns();
            $scope.studentAppsDataGird = {
                data: 'apps',
                columnDefs: $scope.appsColumns
            };
        };

        $scope.edit = function(appToEdit) {
            var appId = appToEdit.getProperty("id");
            $state.go("^.single-app", {appId: appId});
        };

        $scope.init();
    }
]);

var studentClassResolver = {
    student: [
        'trng.services.StudentsService',
        function(studentsService) {
            return studentsService.getStudent("1");
        }
    ],

    course: [
        '$q', 'trng.services.StudentsService', 'trng.services.CoursesService',
        function($q, studentsService, coursesService) {
            return studentsService.getStudent("1").then(
                function(student) {
                    if (student.hasOwnProperty('class') &&
                        student['class'].hasOwnProperty('courseId')) {

                        var courseId = student['class']['courseId'];
                        return coursesService.getCourseById(courseId);
                    }

                    var deferred = $q.defer();
                    deferred.reject("Could not find student or the course of the student's class");
                    return deferred.promise;
                }
            );
        }
    ],

    apps: [
        '$q', '$stateParams', 'trng.services.StudentsService',
        function($q, $stateParams, studentsService) {
            var classId = $stateParams['classId'];

            if (!classId) {
                var deferred = $q.defer();
                deferred.reject("No class provided for the student");
                return deferred.promise;
            }

            return studentsService.getStudentClassApps("1", classId);
        }
    ]

};