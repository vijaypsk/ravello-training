'use strict';


angular.module('trng.trainer.training.classes').controller('trainerSingleClassMonitorController', [
    '$log',
    '$scope',
    '$rootScope',
    '$q',
    '$state',
    'growl',
    '$dialogs',
    'trng.common.utils.DateUtil',
    'trng.trainer.training.classes.ClassModel',
    'classApps',
    'currentClass',
    function ($log, $scope, $rootScope, $q, $state, growl, $dialogs, dateUtil, classesModel, classApps, currentClass) {

        $scope.init = function () {
            $scope.viewModel = {
                apps: [],
                selectedApps: []
            };

            $scope.initData();
            $scope.initDates();
            $scope.initAppsDataGrid();
        };

        $scope.initData = function() {
            // This is kind of a voodoo to me currently - but it seems that changing the reference of the selectsApps array
            // breaks the selection of the dataGrid. the apps array, on the contrary, must be changed by reference, in order
            // for the dataGrid to be actually updated (as the watch on the array is based on reference or length).
            $scope.viewModel.apps = [];
            _.remove($scope.viewModel.selectedApps);

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
                    var appViewObject = _.find(currentStudent.apps, {blueprintId: currentBp.id});

                    // If not found, an empty object is created, so that the app fields will be blank.
                    if (!appViewObject) {
                        appViewObject = {};
                    }

                    var studentViewObject = _.omit(_.cloneDeep(currentStudent), 'apps');

                    appViewObject.student = studentViewObject;
                    appViewObject.blueprint = currentBp;

                    $scope.viewModel.apps.push(appViewObject);
                });
            });
        };

        $scope.initAppsColumns = function() {
            $scope.viewModel.appsColumns = [
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
                    cellFilter: 'date:\'' + dateUtil.angular.dateTimeFormat + '\''
                },
                {
                    field: 'numOfRunningVms',
                    displayName: '# of running VMs'
                }
            ];
        };

        $scope.initAppsDataGrid = function() {
            $scope.initAppsColumns();

            $scope.viewModel.appsDataGrid = {
                data: 'viewModel.apps',
                columnDefs: $scope.viewModel.appsColumns,
                selectedItems: $scope.viewModel.selectedApps,
                showSelectionCheckbox: true,
                selectWithCheckboxOnly: true,
                enableColumnResize: true
            };
        };

        $scope.createApp = function() {
            _.forEach($scope.viewModel.selectedApps, function(app) {
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
                        $q.all(_.map($scope.viewModel.selectedApps, function(app) {
                            return app.creationTime && classesModel.deleteAppForStudent(
                                    app.ravelloId, $scope.currentClass.id, app.student.user.id);
                        })).then(
                            function(result) {
                                classesModel.getClassApps($scope.currentClass.id).then(function(result) {
                                    classApps = result;
                                    $scope.initData();
                                });
                            }
                        );
                    }
                );
            }
        };

        $scope.isDeleteDisabled = function() {
            return $scope.viewModel.selectedApps.length <= 0 || !_.every($scope.viewModel.selectedApps, 'creationTime');
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