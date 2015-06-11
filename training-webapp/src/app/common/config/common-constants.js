'use strict';

angular.module('trng.config').constant('CommonConstants', {
    baseUrl: '',
    autoRefreshDuration: 15000,
    messagesCloseTime: 6000,
	maximumActiveDialogs: 1,

	defaultPublishMethod: 'COST_OPTIMIZED',
	defaultCloud: 'AMAZON',
	defaultRegion: 'Virginia',
	defaultAutoStopMinutes: 120,

	courseChangedEvent: 'COURSE_CHANGED',

	EXPORT_STUDENT_APPS_TO_CSV_TOGGLE: 'EXPORT_STUDENTS_APP_TO_CSV'
});