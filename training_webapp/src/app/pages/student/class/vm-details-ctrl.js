'use strict';

angular.module('trng.student').controller('vmDetailsController', [
    '$log',
    '$scope',
    '$modalInstance',
    'selectedVm',
    function($log, $scope, $modalInstance, selectedVm) {
        $scope.init = function() {
            $scope.selectedVm = selectedVm;
            $scope.dnsWithExternalServices = $scope.determineDnsWithExternalServices();
        };

        $scope.determineDnsWithExternalServices = function() {
            return _.map(selectedVm.allDns, function(dns) {
                if (dns.services && dns.services.length > 0) {
                    return dns;
                }
            });
        };

        $scope.ok = function() {
            $modalInstance.close();
        };

        $scope.init();
    }
]);
