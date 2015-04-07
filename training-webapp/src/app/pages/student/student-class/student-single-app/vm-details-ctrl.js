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

		$scope.getServiceGoLink = function(dns, service) {
			var type = 'http://';
			if (isHttps(service)) {
				type = 'https://';
			}
			return type + dns.name + ':' + service.externalPort;
		};

		$scope.showServiceGoLink = function(service) {
			return isHttp(service) || isHttps(service);
		};

		function isHttp(service) {
			return (service.protocol ? service.protocol === 'HTTP' : false) ||
				(service.externalPort ? service.port === 80 || service.port === 8080 : false) ||
				(service.name ? service.name === 'http' || service.name === 'www' || service.name === 'web' : false);
		}

		function isHttps(service) {
			return (service.protocol ? service.protocol === 'HTTPS' : false) ||
				(service.externalPort ? service.port === 443 : false) ||
				(service.name ? service.name === 'https' : false);
		}

        $scope.init();
    }
]);
