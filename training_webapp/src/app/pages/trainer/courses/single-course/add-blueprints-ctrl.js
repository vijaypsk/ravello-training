'use strict';

angular.module('trng.trainer.training.courses').controller('addBlueprintsController', [
    '$scope',
    '$log',
    '$modalInstance',
    'trng.common.utils.DateUtil',
    'allBlueprints',
    'courseBlueprints',
     function($scope, $log, $modalInstance, dateUtil, allBlueprints, courseBlueprints) {

         $scope.init = function() {
             $scope.initBlueprints();
             $scope.initBlueprintsDataGrid();
         };

         $scope.initBlueprints = function() {
             $scope.allBlueprints = _.cloneDeep(allBlueprints);

             $scope.courseBlueprints = [];

             _.forEach(courseBlueprints, function(selectedBp) {
                var matchingBp = _.find($scope.allBlueprints, function(bp) {
                    return (bp && selectedBp && bp.hasOwnProperty('id') && selectedBp.hasOwnProperty('id') &&
                        bp.id === selectedBp.id);
                });

                 if (matchingBp) {
                     $scope.courseBlueprints.push(matchingBp);
                 }
             });
         };

         $scope.initBlueprintsColumns = function () {
             $scope.allBlueprintsColumns = [
                 {
                     field: 'name',
                     displayName: 'name'
                 },
                 {
                     field: 'description',
                     displayName: 'description'
                 },
                 {
                     field: 'creationTime',
                     displayName: 'Creation time',
                     cellFilter: 'date:\'' + dateUtil.dateTimeFormat + '\''
                 },
                 {
                     field: 'owner',
                     displayName: 'owner'
                 }
             ];
         };

         $scope.initBlueprintsDataGrid = function () {
             $scope.initBlueprintsColumns();
             $scope.allBlueprintsDataGrid = {
                 data: 'allBlueprints',
                 columnDefs: $scope.allBlueprintsColumns,
                 selectedItems: $scope.courseBlueprints,
                 showSelectionCheckbox: true,
                 selectWithCheckboxOnly: true,
                 enableColumnResize: true
             };
         };

         $scope.ok = function() {
             $modalInstance.close($scope.courseBlueprints);
         };

         $scope.cancel = function() {
             $modalInstance.dismiss('cancel');
         };

         $scope.init();
     }
    ]);