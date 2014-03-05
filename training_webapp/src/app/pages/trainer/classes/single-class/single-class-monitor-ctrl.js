'use strict';


angular.module('trng.trainer.training.classes').controller('singleClassMonitorController', [
    '$log',
    '$scope',
    '$rootScope',
    '$state',
    'trng.common.utils.DateUtil',
    'classApps',
    function ($log, $scope, $rootScope, $state, dateUtil, classApps) {

        $scope.init = function () {
            $scope.apps = [];

            $scope.matchApps();
            $scope.initDates();
            $scope.initAppsDataGrid();
        };

        $scope.matchApps = function() {
            // Then we go over the students.
            _.forEach(classApps.students, function(currentStudent) {
                // We then go over every student's map of apps.
                _.forEach(currentStudent.apps, function(currentApp) {

                    // We match the single app with its blueprint, from the courses\s list of bps.
                    var matchingBp = _.find($scope.currentClass.course.blueprints, function (currentBp) {
                        return (currentBp && currentBp.hasOwnProperty('id') &&
                            currentBp.id == currentApp.blueprintId);
                    });

                    currentApp.blueprint = matchingBp;
                    currentApp.studentUsername = currentStudent.user.username;

                    $scope.apps.push(currentApp);
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
            $scope.initAppsColumns();
            $scope.appsDataGrid = {
                data: 'apps',
                columnDefs: $scope.appsColumns
            };
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