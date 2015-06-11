'use strict';

var _ = require('lodash');

var findIpConfig = function(vm, service) {
	var ipConfig = null;

	_.forEach(vm.networkConnections, function(nic) {
		if (nic.ipConfig && nic.ipConfig.id === service.ipConfigLuid) {
			ipConfig = nic.ipConfig;
		}

		if (nic.additionalIpConfig && nic.additionalIpConfig.length > 0) {
			_.forEach(nic.additionalIpConfig, function(currentIpConfig) {
				if (currentIpConfig && currentIpConfig.id === service.ipConfigLuid) {
					ipConfig = currentIpConfig;
				}
			});
		}
	});

	return ipConfig;
};

exports.createVmViewObject = function(vm) {
	var hostnames = _.map(vm.hostnames, function(hostname) {
		return {
			name: hostname
		};
	});

	var externalAccesses = [];

	_.forEach(vm.suppliedServices, function(currentService) {
		if (currentService && currentService.external) {
			var ipConfig = findIpConfig(vm, currentService);
			var matchingExternalAccess = _.find(externalAccesses, {name: ipConfig.fqdn});

			if (!matchingExternalAccess) {
				matchingExternalAccess = {
					name: ipConfig.fqdn,
					ip: ipConfig.publicIp,
					services: []
				};
				externalAccesses.push(matchingExternalAccess);
			}

			matchingExternalAccess.services.push({
				name: currentService.name,
				protocol: currentService.protocol,
				port: currentService.portRange,
				externalPort: currentService.externalPort
			});
		}
	});

	var firstExternalAccess = _.find(externalAccesses, function(externalAccess) {
		return (externalAccess && externalAccess.services && externalAccess.services.length > 0);
	});

	var vmViewObject = {
		id: vm.id,
		name: vm.name,
		description: vm.description,
		status: vm.state,
		hostnames: hostnames,
		allDns: externalAccesses,
		firstDns: firstExternalAccess
	};

	return vmViewObject;
};
