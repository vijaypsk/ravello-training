'use strict';


angular.module('trng.courses.classes').controller('singleClassController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$log',
    '$window',
    'trng.courses.classes.ClassModel',
    'trng.services.ClassesService',
    'trng.courses.courses.CourseModel',
    'trng.common.utils.DateUtil',
    'currentClass',
    'courses',
    function ($scope, $rootScope, $state, $stateParams, $log, $window, classModel, classesService,
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

            // It's important to make sure the courses are really loaded, since if the user refreshes this
            // view without visiting the previous view first, the course might not be loaded.
            $scope.currentClass['course'] = _.find($scope.courses, function(course) {
                return (course && course.hasOwnProperty('id') && course['id'] === $scope.currentClass['courseId']);
            });
        };

        $scope.matchApps = function() {
            // Eventually the data grid of apps is a mix between a few entities: the students, their apps,
            // and every app's blueprint.
            // At first, we have to make sure that there's a course loaded, to match the apps against bps.
            var course = _.find($scope.courses, function(currentCourse) {
                return (currentCourse && currentCourse.hasOwnProperty('id') && currentCourse['id'] === $scope.currentClass['courseId']);
            });

            // Then we go over the students.
            _.forEach($scope.currentClass['students'], function(currentStudent) {
                // We then go over every student's map of apps.
                _.forIn(currentStudent['apps'], function(currentApp, appId) {

                    // We match the single app with its blueprint, from the courses\s list of bps.
                    var matchingBp = _.find(course['blueprints'], function(currentBp) {
                        return (currentBp && currentBp.hasOwnProperty('id') && currentBp['id'] == currentApp['blueprintId']);
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
                    field: 'username',
                    displayName: 'Student email'
                },
                {
                    field: 'ravelloCredentials.username',
                    displayName: 'Ravello user'
                },
                {
                    displayName: 'Actions',
                    cellTemplate: '<a href="" class="btn btn-small btn-link" ng-click="editStudent(row)"><i class="icon-edit" /> Edit</a><a href="" class="btn btn-small btn-link" ng-click="deleteStudent(row)"><i class="icon-trash" /> Delete</a>'
                }
            ];
        };

        $scope.initAppsColumns = function() {
            $scope.appsColumns = [
                {
                    field: 'student.username',
                    displayName: 'Student'
                },
                {
                    field: 'name',
                    displayName: 'Name'
                },
                {
                    field: 'creationTime',
                    displayName: 'Creation Time'
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
                showSelectionCheckbox: true,
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
            classModel.deleteStudents($scope.currentClass, $scope.selectedStudents);
        };

        $scope.deleteStudent = function(studentToDelete) {
            var studentId = studentToDelete.getProperty('id');
            classModel.deleteStudent($scope.currentClass, studentId);
        };

        $scope.save = function() {
            classModel.save($scope.currentClass);
        };

        $scope.back = function() {
            $window.history.back();
        };

        $scope.addToEdit = function() {
            $state.go('^.edit-class');
        };

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (toState['name'] === 'courses.single-class.add-class') {
                $rootScope.isAdd = true;
            } else {
                $rootScope.isAdd = false;
            }
        });

        $scope.init();
    }
]);


var singleClassResolver = {
    currentClass: ['$q', '$stateParams', 'trng.courses.classes.ClassModel', function($q, $stateParams, classModel) {
        var classId = $stateParams['classId'];

        if (!classId) {
            var deferred = $q.defer();
            deferred.resolve({});
            return deferred.promise;
        }

        return classModel.getClassById(classId).then(function(result) {
            return _.cloneDeep(result);
        });
    }],

    courses: ['trng.courses.courses.CourseModel', function(courseModel) {
        return courseModel.getAllCourses();
    }]
};