'use strict';


angular.module('trng.trainer.training.classes').controller('trainerSingleClassEditController', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$log',
    '$window',
    '$dialogs',
    'StatesNames',
    'ClassesService',
    'LoginModel',
    'DateUtil',
    'currentClass',
    'courses',
    function ($scope, $rootScope, $state, $stateParams, $log, $window, $dialogs, StatesNames, ClassesService, LoginModel,
              DateUtil, currentClass, courses) {

        $scope.init = function () {
            $scope.apps = [];
            $scope.courses = courses;

            $scope.initAbstract();
            $scope.initClass();
            $scope.initDates();
            $scope.initStudentsDataGrid();
			$scope.initPublishDetailsOptions();
        };

        $scope.initAbstract = function() {
            $scope.abstract = {};
        };

		$scope.initPublishDetailsOptions = function() {
			$scope.publishMethods = [
				{
					name: 'Cost',
					value: 'COST_OPTIMIZED'
				},
				{
					name: 'Performance',
					value: 'PERFORMANCE_OPTIMIZED'
				}
			];

			$scope.clouds = [
				{
					name: 'Amazon',
					value: 'AMAZON'
				},
				{
					name: 'Google',
					value: 'GOOGLE'
				}
			];

			$scope.regions = {
				'AMAZON': [
					{
						name: 'Virginia',
						value: 'Virginia'
					},
					{
						name: 'Oregon',
						value: 'Oregon'
					}
				],
				'GOOGLE': [
					{
						name: 'us-central1',
						value: 'us-central1'
					}
				]
			};
		};

		$scope.isCloudVisible = function(bpPublishDetails) {
			return bpPublishDetails && bpPublishDetails.method !== 'COST_OPTIMIZED';
		};

		$scope.isRegionVisible = function(bpPublishDetails) {
			return bpPublishDetails && bpPublishDetails.method !== 'COST_OPTIMIZED';
		};

		$scope.cloudChanged = function(bpPublishDetails) {
			bpPublishDetails.region = $scope.regions[bpPublishDetails.cloud][0].value;
		};

		$scope.initClass = function() {
            $scope.currentClass = currentClass;
            $scope.currentClass.course = $scope.courses && $scope.courses.length ? $scope.courses[0] : null;
            $scope.isRavelloCredentials = false;

            $scope.$watch('currentClass.ravelloCredentials.overrideTrainerCredentials', function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (!newVal) {
                        $scope.currentClass.ravelloCredentials.username = LoginModel.user.ravelloCredentials.username;
                        $scope.currentClass.ravelloCredentials.password = LoginModel.user.ravelloCredentials.password;
                    }
                }
            });
        };

        $scope.initDates = function() {
            $scope.dateFormat = DateUtil.angular.dateFormat;
            $scope.timeFormat = DateUtil.angular.timeFormat;
            $scope.dateTimeFormat = DateUtil.angular.dateTimeFormat;
        };

        $scope.initStudentsColumns = function () {
            $scope.studentsColumns = [
                {
                    field: 'user.fullName',
                    displayName: 'Full name'
                },
                {
                    field: 'user.username',
                    displayName: 'Username'
                },
                {
                    displayName: 'Actions',
                    width: '180px',
                    resizable: false,
                    cellTemplate:
                        '<a href="" class="btn btn-small btn-link" ng-click="editStudent(row)">' +
                            '<i class="fa fa-pencil" /> Edit' +
                        '</a>' +
                        '<a href="" class="btn btn-small btn-link" ng-click="deleteStudent(row)">' +
                            '<i class="fa fa-trash-o" /> Delete' +
                        '</a>'
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
                selectWithCheckboxOnly: true,
                enableColumnResize: true
            };
        };

        $scope.addStudent = function() {
            $state.go(StatesNames.trainer.training.singleClass.singleStudent.name, {classId: $scope.currentClass.id});
        };

        $scope.editStudent = function(studentToEdit) {
            var studentId = studentToEdit.getProperty('id');
            $state.go(StatesNames.trainer.training.singleClass.singleStudent.name, {classId: $scope.currentClass.id, studentId: studentId});
        };

        $scope.deleteStudent = function(studentToDelete) {
            var dialog = $dialogs.confirm("Delete student", "Are you sure you want to delete the student?");
            dialog.result.then(function(result) {
                var studentId = studentToDelete.getProperty('id');
                _.remove($scope.currentClass.students, {id: studentId});
            });
        };

        $scope.saveClass = function() {
            return ClassesService.saveOrUpdate($scope.currentClass).then(
                function(result) {
                    $state.go(StatesNames.trainer.training.classes.name);
                }
            );
        };

        $scope.back = function() {
            $window.history.back();
        };

        $scope.addToEdit = function() {
			currentClass = ClassesService.createEmptyClass(currentClass.course);
			$scope.currentClass = currentClass;
            $state.go(StatesNames.trainer.training.singleClass.editClass.name);
        };

        $scope.showActive = function() {
            return $state.is(StatesNames.trainer.training.singleClass.editClass.name) ||
                $state.is(StatesNames.trainer.training.singleClass.singleStudent.name);
        };

        $scope.toggleActive = function() {
            $scope.currentClass.active = !$scope.currentClass.active;
        };

        $scope.addToEditDisabled = function() {
            return !$scope.currentClass.course;
        };

        $scope.getTitle = function() {
            var title = $scope.currentClass.name || 'New class';
            title += $scope.abstract.getStudentName ? ' > ' + $scope.abstract.getStudentName() : '';
            return title;
        };

        $scope.init();
    }
]);

