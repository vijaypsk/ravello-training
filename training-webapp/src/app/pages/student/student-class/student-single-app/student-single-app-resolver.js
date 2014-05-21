'use strict';

var studentSingleAppResolver = {
    currentApp: [
        '$q', '$stateParams', 'StudentsService', 'student',
        function($q, $stateParams, StudentsService, student) {
            var appId = $stateParams.appId;

            if (!appId || !student) {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            }

            return StudentsService.getStudentClassSingleApp(student._id, student.userClass._id, appId);
        }
    ]
};
