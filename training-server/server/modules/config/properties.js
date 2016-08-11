'use strict';

exports.ravelloUrl = 'https://cloud.ravellosystems.com';

exports.baseUrl = '/services';

exports.dbUsername = 'training';
exports.dbPassword = 'training';

exports.defaultAutoStopSeconds = 7200;

exports.dateFormat = 'dd.MM.yyyy hh:mm:ss tt';

exports.numOfWorkers = 4;

// The number of applications to create in every batch.
exports.publishAppsChunkSize = 30;

// The time in millis to wait between every batch App creation.
exports.publishAppsChunkDelay = 1000 * 60 * 5;

exports.logLevel = 'debug';

// Feature toggles.
exports.featureToggles = {
	EXPORT_STUDENTS_APP_TO_CSV: false
};