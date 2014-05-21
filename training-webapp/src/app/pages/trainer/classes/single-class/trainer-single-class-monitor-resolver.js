'use strict';

var singleClassMonitorResolver = {
    classApps: [
        'currentClass', 'ClassesService',
        function(currentClass, ClassesService) {
            return ClassesService.getClassApps(currentClass.id).then(
                function(classApps) {
                    return _.cloneDeep(classApps);
                }
            );
        }
    ]
};
