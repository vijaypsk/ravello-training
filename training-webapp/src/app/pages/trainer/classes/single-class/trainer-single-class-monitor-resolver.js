'use strict';

var singleClassMonitorResolver = {
    classApps: [
        'currentClass',
        'ClassModel',
        function(currentClass, ClassModel) {
            return ClassModel.getClassApps(currentClass.id);
        }
    ]
};
