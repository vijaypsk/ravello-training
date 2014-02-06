'use strict';


angular.module('trng.courses.classes').controller('singleClassController', [
    '$scope',
    '$state',
    '$stateParams',
    '$log',
    'trng.courses.classes.ClassModel',
    'trng.services.ClassesService',
    'trng.courses.courses.CourseModel',
    'trng.common.utils.DateUtil',
    function ($scope, $state, $stateParams, $log, classModel, classesService, courseModel, dateUtil) {

        var classId = undefined;

        $scope.init = function () {
            classId = $stateParams['classId'];

            $scope.apps = [];

            $scope.initStudent();
            $scope.initDates();
            $scope.initStudentsDataGrid();
            $scope.initAppsDataGrid();
        };

        $scope.initStudent = function() {
            if (!classId) {
                classModel.setCurrentClass({});
            }

            classModel.getCurrentClass(classId).
                then(function(result) {
                    $scope.currentClass = result;
                    return $scope.matchCourses();
                }).then(function(result) {
                    return $scope.matchApps();
                });

            $scope.selectedStudents = [];
        };

        $scope.matchCourses = function() {
            $scope.courses = courseModel.courses;

            // It's important to make sure the courses are really loaded, since if the user refreshes this
            // view without visiting the previous view first, the course might not be loaded.
            return courseModel.getAllCourses().
                then(function(result) {
                    $scope.currentClass['course'] = _.find($scope.courses, function(course) {
                        return (course && course.hasOwnProperty('id') && course['id'] === $scope.currentClass['courseId']);
                    });
                });
        };

        $scope.matchApps = function() {
            // Eventually the data grid of apps is a mix between a few entities: the students, their apps,
            // and every app's blueprint.
            // At first, we have to make sure that there's a course loaded, to match the apps against bps.
            return courseModel.getCourseById($scope.currentClass['courseId']).
                then(function(course) {
                    // Then we go over the students.
                    _.forEach($scope.currentClass['students'], function(currentStudent) {
                        // We then go over every student's map of apps.
                        _.forIn(currentStudent['apps'], function(currentApp, appId) {

                            // We match the single app with its blueprint, from the courses\s list of bps.
                            var matchingBp = _.find(course['blueprints'], function(currentBp) {
                                return (currentBp && currentBp.hasOwnProperty('id') && currentBp['id'] == currentApp['blueprintId']);
                            });

                            var appViewModel = _.assign(currentApp);
                            appViewModel['blueprint'] = matchingBp;
                            appViewModel['student'] = currentStudent;

                            $scope.apps.push(appViewModel);
                        });
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
                    field: 'blueprint.name',
                    displayName: 'Blueprint'
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
            $state.go('^.classes');
        };

        $scope.cancel = function() {
            $state.go('^.classes');
        };

        $scope.init();
    }
]);
