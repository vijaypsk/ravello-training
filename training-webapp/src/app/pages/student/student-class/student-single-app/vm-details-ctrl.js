'use strict';

angular.module('trng.student').controller('studentVmDetailsController', [
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

        $scope.hostnames = function() {
            var hostnamesString = "";

            _.forEach($scope.selectedVm.hostnames, function(hostname) {
                hostnamesString += hostname.name + ",";
            });

            // Get rid of the last ',' char.
            return hostnamesString.slice(0, hostnamesString.length - 2);
        };

        $scope.ok = function() {
            $modalInstance.close();
        };

        $scope.init();
    }
]);
