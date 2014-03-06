'use strict';


angular.module('trng.trainer.training.classes').controller('singleClassMonitorController', [
    '$log',
    '$scope',
    '$rootScope',
    '$state',
    'trng.common.utils.DateUtil',
    'trng.services.AppsService',
    'classApps',
    function ($log, $scope, $rootScope, $state, dateUtil, appsService, classApps) {

        $scope.init = function () {
            $scope.apps = [];

            $scope.matchApps();
            $scope.initDates();
            $scope.initAppsDataGrid();
        };

        $scope.matchApps = function() {
            // The idea here is to display a table that will show all of the students, and for each one
            // all of the BPs of the class. This way, the trainer can monitor the apps created for each
            // student for each BP. If an app has been created for the student from that BP, the trainer
            // would see the app info. Otherwise, the app info should be blank, but a row for that pair
            // of student-BP must still appear.
            _.forEach(classApps.students, function(currentStudent) {

                // Thus, the iteration is done through the BPs of the course, and NOT the apps of the student.
                _.forEach($scope.currentClass.course.blueprints, function(currentBp) {

                    // Then, an app matching the current BP is searched for the specific student.
                    var app = _.find(currentStudent.apps, function(currentApp) {
                        return (
                            currentApp && currentApp.hasOwnProperty('blueprintId') &&
                            currentBp.id === currentApp.blueprintId);
                    });

                    // If not found, an empty object is created, so that the app fields will be blank.
                    if (!app) {
                        app = {};
                    }

                    app.blueprint = currentBp;
                    app.studentUsername = currentStudent.user.username;

                    $scope.apps.push(app);
                });
            });
        };

        $scope.initDates = function() {
            $scope.dateFormat = dateUtil.dateFormat;
        };

        $scope.initAppsColumns = function() {
            $scope.appsColumns = [
                {
                    field: 'studentUsername',
                    displayName: 'Student'
                },
                {
                    field: 'name',
                    displayName: 'Name'
                },
                {
                    field: 'blueprint.name',
                    displayName: 'Blueprint Name'
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

        $scope.initAppsDataGrid = function() {
            $scope.selectedApps = [];

            $scope.initAppsColumns();

            $scope.appsDataGrid = {
                data: 'apps',
                columnDefs: $scope.appsColumns,
                selectedItems: $scope.selectedApps,
                showSelectionCheckbox: true,
                selectWithCheckboxOnly: true
            };
        };

        $scope.createApp = function() {
            _.forEach($scope.selectedApps, function(app) {
                var name =
                    $scope.currentClass.name + '##' +
                    app.blueprint.name + '##' +
                    app.studentUsername;

                var description =
                    'App for student ' + app.studentUsername +
                    ' from BP ' + app.blueprint.name +
                    ' for class ' + $scope.currentClass.name;

                appsService.createApp(name, description, app.blueprint.id).then(function(result) {
                    app = result.body;
                });
            });
        };

        $scope.init();
    }
]);

var singleClassMonitorResolver = {
    classApps: [
        'currentClass',
        'trng.trainer.training.classes.ClassModel',
        function(currentClass, classModel) {
            return classModel.getClassApps(currentClass.id);
        }
    ]
};