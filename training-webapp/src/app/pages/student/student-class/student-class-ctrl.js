'use strict';

angular.module('trng.student').controller('studentClassController', [
    '$log',
    '$scope',
    '$state',
    'StatesNames',
    'AppsService',
    'student',
    'course',
    'apps',
    function($log, $scope, $state, StatesNames, AppsService, student, course, apps) {
        $scope.init = function() {
            $scope.name = student.firstName + ' ' + student.surname;
            $scope.student = student;
            $scope.apps = apps;

            initDescription();
            initAppsDataGrid();
        };

        function initDescription() {
            var courseDescription = course.description ? course.description : '';
            var classDescription = $scope.student.userClass.description ?
                $scope.student.userClass.description : '';
            $scope.description = courseDescription + ' ' + classDescription;
        }

        function initAppsDataGrid() {

            function initAppsColumns() {
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
                        width: '150px',
                        displayName: '# of VMs'
                    },
                    {
                        field: 'numOfRunningVms',
                        width: '150px',
                        displayName: '# of running VMs'
                    },
                    {
                        displayName: 'Actions',
                        width: '150px',
                        resizable: false,
                        cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="view(row)">' +
                        '<i class="fa fa-search"></i> View' +
                        '</a>'
                    }
                ];
            }

            $scope.selectedApps = [];

            initAppsColumns();

            $scope.studentAppsDataGird = {
                data: 'apps',
                columnDefs: $scope.appsColumns,
                selectedItems: $scope.selectedApps,
                enableColumnResize: true,
                enableHighlighting: true,
                enableRowSelection: false
            };
        }

        $scope.view = function(appToView) {
            var appId = appToView.getProperty("id");
            $state.go(StatesNames.student.studentClass.singleApp.name, {appId: appId});
        };

        $scope.init();
    }
]);
