'use strict';


angular.module('trng.labs.sessions').controller('labsSessionsController', [
	'$scope', 
	'trng.sessions.entities.SessionModel',
	'trng.services.SessionsService',
	function($scope, sessionModel, sessionsService) {

	$scope.init = function() {
		var promise = sessionsService.getAllSessions();
		promise.then(function(result) {
			for (var i = 0; i < result.length; i++) {
				$scope.sessions.push(result[i]);
			}
			
			$scope.sessionsDataGrid = {
					data: $scope.sessions,
					columnDefs: $scope.sessionColumns
			};
		});
		
		$scope.sessions = [];
		$scope.initSessionsDataGrid();
	};
	
	$scope.initSessionsDataGrid = function() {
		$scope.sessionColumns = [
	         {
	        	 field: 'name',
	        	 displayName: 'Name'
	         },
	         {
	        	 field: 'lab',
	        	 displayName: 'Lab'
	         },
	         {
	        	 field: 'startDate',
	        	 displayName: 'Start date'
	         },
	         {
	        	 field: 'endDate',
	        	 displayName: 'End date'
	         }
         ];
		
		$scope.sessionsDataGrid = {
				data: $scope.sessions,
				columnDefs: $scope.sessionColumns
		};
	};
	
	$scope.init();
}]);
