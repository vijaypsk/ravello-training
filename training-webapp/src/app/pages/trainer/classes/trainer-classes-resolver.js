'use strict';

var classesResolver = {
    classes: ['$q', 'ClassModel',
              function($q, ClassModel) {
                  return ClassModel.getAllClasses().
                      then(function (result) {
                          return _.cloneDeep(result);
                      });
              }
    ]
};
