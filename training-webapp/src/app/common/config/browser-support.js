'use strict';

angular.module('trng.config').constant('SupportedBrowserVersions', {
	MinVersions: {
		IE: 10
	}
});

angular.module('trng.config').run(['$dialogs', 'SupportedBrowserVersions', function($dialogs, SupportedBrowserVersions) {
	var uaParser = new UAParser();
	var browserInfo = uaParser.getBrowser();

	if (browserInfo && browserInfo.name && browserInfo.version) {
		var browserSupportedVersion = SupportedBrowserVersions.MinVersions[browserInfo.name];

		if (browserSupportedVersion && parseInt(browserInfo.version) < browserSupportedVersion) {
			$dialogs.notify('Unsupported browser version', 'Version ' + browserInfo.version + ' of browser ' + browserInfo.name + ' is not supported!<br> ' +
				'We support only version ' + browserSupportedVersion + ' and up.<br> ' +
				'Please be aware that unexpected and unaccounted behaviour may occur.');
		}
	}
}]);