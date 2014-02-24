'use strict';

angular.module('trng.transformers').factory('trng.transformers.ClassesTransformer', [
	'trng.transformers.StudentsTransformer',
	'trng.common.utils.DateUtil',
	function(studentTrans, dateUtil) {

        var service = {
			dtoToEntity: function(dto) {
		        var entity = _.cloneDeep(dto);

                entity.id = dto._id;
                entity = _.omit(entity, '_id');

                entity.students = _.map(entity.students, function(student) {
                    return studentTrans.dtoToEntity(student);
                });

                entity['startDate'] = Date.parse(entity['startDate']);
                entity['endDate'] = Date.parse(entity['endDate']);

                return entity;
			},
			
			entityToDto: function(entity) {
                var dto = _.cloneDeep(entity);

                dto._id = dto.id;
                dto = _.omit(dto, 'id');

                dto.students = _.map(dto.students, function(student) {
                    return studentTrans.entityToDto(student);
                });

                if (dto['startDate']) {
                    dto['startDate'] = dto['startDate'].toString(dateUtil.dateFormat);
                }
                if (dto['endDate']) {
                    dto['endDate'] = dto['endDate'].toString(dateUtil.dateFormat);
                }

                return dto;
			}
		};
		
		return service;
}]);
