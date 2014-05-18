'use strict';


angular.module('trng.trainer.training.classes').controller('singleClassMonitorController', [
    '$log',
    '$scope',
    '$rootScope',
    '$state',
    'growl',
    '$dialogs',
    'trng.common.utils.DateUtil',
    'trng.trainer.training.classes.ClassModel',
    'classApps',
    'currentClass',
    function ($log, $scope, $rootScope, $state, growl, $dialogs, dateUtil, classesModel, classApps, currentClass) {

        $scope.init = function () {
            $scope.initData();
            $scope.initDates();
            $scope.initAppsDataGrid();
        };

        $scope.initData = function() {
            $scope.apps = [];
            $scope.selectedApps = [];
            $scope.matchApps();
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
                    var appViewObject = _.find(currentStudent.apps, function(currentApp) {
                        return (
                            currentApp && currentApp.hasOwnProperty('blueprintId') &&
                            currentBp.id === currentApp.blueprintId);
                    });

                    // If not found, an empty object is created, so that the app fields will be blank.
                    if (!appViewObject) {
                        appViewObject = {};
                    }

                    var studentViewObject = _.omit(_.cloneDeep(currentStudent), 'apps');

                    appViewObject.student = studentViewObject;
                    appViewObject.blueprint = currentBp;

                    $scope.apps.push(appViewObject);
                });
            });
        };

        $scope.initDates = function() {
            $scope.dateFormat = dateUtil.dateFormat;
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
            $scope.initAppsColumns();

            $scope.appsDataGrid = {
                data: 'apps',
                columnDefs: $scope.appsColumns,
                selectedItems: $scope.selectedApps,
                showSelectionCheckbox: true,
                selectWithCheckboxOnly: true,
                enableColumnResize: true
            };
        };

        $scope.createApp = function() {
            _.forEach($scope.selectedApps, function(app) {
                var name =
                    $scope.currentClass.name + '##' +
                    app.blueprint.name + '##' +
                    app.student.user.username;

                var description =
                    'App for student ' + app.student.user.username +
                    ' from BP ' + app.blueprint.name +
                    ' for class ' + $scope.currentClass.name;

                if (!app.creationTime) {
                    classesModel.createAppForStudent(currentClass.id, name, description, app.blueprint.id, app.student.user.id).then(
                        function(result) {
                            _.assign(app, result);
                        }
                    );
                } else {
                    growl.addInfoMessage("Application for student " + app.student.user.username +
                        " from blueprint [" + app.blueprint.name + "] already exists");
                }
            });
        };

        $scope.deleteApp = function() {
            if (!$scope.isDeleteDisabled()) {
                var dialog = $dialogs.confirm('Delete application', 'Are you sure you want to delete the selected applications?');
                dialog.result.then(
                    function() {
                        _.forEach($scope.selectedApps, function(app) {
                            app.creationTime && classesModel.deleteAppForStudent(
                                    app.ravelloId, $scope.currentClass.id, app.student.user.id).then(

                                function(result) {
                                    classesModel.getClassApps($scope.currentClass.id).then(function(result) {
                                        classApps = result;
                                        $scope.initData();
                                    });
                                }
                            );
                        });
                    }
                );
            }
        };

        $scope.isDeleteDisabled = function() {
            return $scope.selectedApps.length <= 0 || !_.every($scope.selectedApps, 'creationTime');
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