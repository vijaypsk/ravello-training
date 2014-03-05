'use strict';


angular.module('trng.trainer.courses.classes').controller('singleClassController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$log',
    '$window',
    '$dialogs',
    'trng.trainer.courses.classes.ClassModel',
    'trng.services.ClassesService',
    'trng.trainer.courses.courses.CourseModel',
    'trng.common.utils.DateUtil',
    'currentClass',
    'courses',
    function ($scope, $rootScope, $state, $stateParams, $log, $window, $dialogs, classModel, classesService,
              courseModel, dateUtil, currentClass, courses) {

        $scope.init = function () {
            $scope.apps = [];

            $scope.initClass();
            $scope.initDates();
            $scope.initStudentsDataGrid();
            $scope.initAppsDataGrid();
        };

        $scope.initClass = function() {
            $scope.currentClass = currentClass;
            $scope.matchCourses();
            $scope.matchApps();
        };

        $scope.matchCourses = function() {
            $scope.courses = courses;

            // The course reference inside the class should be a reference to the actual list of courses,
            // otherwise there might be problems rendering the view correctly.
            // Since the class is a copy of the originally loaded class, we know the reference is in fact
            // NOT a reference to the actual list of courses, so here the controller fixes that.
            $scope.currentClass['course'] = _.find($scope.courses, function(course) {
                return (course && course.hasOwnProperty('id') && course['id'] === $scope.currentClass['courseId']);
            });
        };

        $scope.matchApps = function() {
            // Eventually the data grid of apps is a mix between a few entities: the students, their apps,
            // and every app's blueprint.
            // At first, we have to make sure that there's a course loaded, to match the apps against bps.
            var course = _.find($scope.courses, function (currentCourse) {
                return (currentCourse && currentCourse.hasOwnProperty('id') &&
                    currentCourse['id'] === $scope.currentClass['courseId']);
            });

            // Then we go over the students.
            _.forEach($scope.currentClass['students'], function(currentStudent) {
                // We then go over every student's map of apps.
                _.forIn(currentStudent['apps'], function(currentApp, appId) {

                    // We match the single app with its blueprint, from the courses\s list of bps.
                    var matchingBp = _.find(course['blueprints'], function (currentBp) {
                        return (currentBp && currentBp.hasOwnProperty('id') &&
                            currentBp['id'] == currentApp['blueprintId']);
                    });

                    var appViewModel = _.cloneDeep(_.assign(currentApp));
                    appViewModel['blueprint'] = matchingBp;
                    appViewModel['name'] = appId;
                    appViewModel['student'] = currentStudent;

                    $scope.apps.push(appViewModel);
                });
            });
        };

        $scope.initDates = function() {
            $scope.dateFormat = dateUtil.dateFormat;
        };

        $scope.initStudentsColumns = function () {
            $scope.studentsColumns = [
                {
                    field: 'user.username',
                    displayName: 'User'
                },
                {
                    field: 'ravelloCredentials.username',
                    displayName: 'Email'
                },
                {
                    displayName: 'Actions',
                    cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="editStudent(row)">' +
                            '<i class="icon-pencil" /> Edit' +
                        '</a>' +
                        '<a href="" class="btn btn-small btn-link" ng-click="deleteStudent(row)">' +
                            '<i class="icon-trash" /> Delete' +
                        '</a>'
                }
            ];
        };

        $scope.initAppsColumns = function() {
            $scope.appsColumns = [
                {
                    field: 'student.user.username',
                    displayName: 'Student'
                },
                {
                    field: 'name',
                    displayName: 'Name'
                },
                {
                    field: 'creationTime',
                    displayName: 'Creation Time',
                    cellFilter: 'date:\'' + dateUtil.dateTimeFormat + '\''
                },
                {
                    field: 'numOfRunningVms',
                    displayName: '# of running VMs'
                }
            ];
        };

        $scope.initStudentsDataGrid = function () {
            $scope.selectedStudents = [];

            $scope.initStudentsColumns();
            $scope.studentsDataGrid = {
                data: 'currentClass.students',
                columnDefs: $scope.studentsColumns,
                selectedItems: $scope.selectedStudents,
                showSelectionCheckbox: false,
                selectWithCheckboxOnly: true
            };
        };

        $scope.initAppsDataGrid = function() {
            $scope.initAppsColumns();
            $scope.appsDataGrid = {
                data: 'apps',
                columnDefs: $scope.appsColumns
            };
        };

        $scope.addStudent = function() {
            $state.go('^.single-student', {classId: $scope.currentClass['id']});
        };

        $scope.editStudent = function(studentToEdit) {
            var studentId = studentToEdit.getProperty('id');
            $state.go('^.single-student', {classId: $scope.currentClass['id'], studentId: studentId});
        };

        $scope.deleteStudents = function() {
            var dialog = $dialogs.confirm("Delete students", "Are you sure you want to delete the students?");
            dialog.result.then(function(result) {
                classModel.deleteStudents($scope.currentClass, $scope.selectedStudents);
            });
        };

        $scope.deleteStudent = function(studentToDelete) {
            var dialog = $dialogs.confirm("Delete student", "Are you sure you want to delete the student?");
            dialog.result.then(function(result) {
                var studentId = studentToDelete.getProperty('id');
                classModel.deleteStudent($scope.currentClass, studentId);
            });
        };

        $scope.saveClass = function() {
            classModel.save($scope.currentClass);
        };

        $scope.back = function() {
            $window.history.back();
        };

        $scope.addToEdit = function() {
            $state.go('^.edit-class');
        };

        $scope.init();
    }
]);


var singleClassResolver = {
    currentClass: ['$q', '$stateParams', 'trng.trainer.courses.classes.ClassModel',
        function($q, $stateParams, classModel) {
            var classId = $stateParams['classId'];

            if (!classId) {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            }

            return classModel.getClassById(classId).then(function(result) {
                return _.cloneDeep(result);
            });
        }
    ],

    courses: ['trng.trainer.courses.courses.CourseModel',
        function(courseModel) {
            return courseModel.getAllCourses();
        }
    ]
};