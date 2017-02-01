'use strict';

angular.module('trng.config').constant('CommonConstants', {
    baseUrl: '',
    autoRefreshDuration: 15000,
    messagesCloseTime: 6000,
	maximumActiveDialogs: 1,

	defaultPublishMethod: 'COST_OPTIMIZED',
	defaultAutoStopMinutes: 120,

	courseChangedEvent: 'COURSE_CHANGED',

	EXPORT_STUDENT_APPS_TO_CSV_TOGGLE: 'EXPORT_STUDENTS_APP_TO_CSV',
	
	//Replace the header title here.
	PORTAL_HEADER_TITLE: 'SDN Training Portal',

	//Replace below logo URL.  To read image from images folder use '../images/default_logo.png'.  
	//Image dimensions for logo should be 35x#35
	PORTAL_HEADER_TITLE_LOGO: 'http://lorempixel.com/35/35/nature/', 
});