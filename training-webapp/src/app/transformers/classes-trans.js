'use strict';

angular.module('trng.transformers').factory('trng.transformers.ClassesTransformer', [
	'trng.transformers.TrainerStudentsTransformer',
	'trng.common.utils.DateUtil',
	function(studentTrans, dateUtil) {

        var service = {
			dtoToEntity: function(dto) {
		        var entity = _.cloneDeep(dto);

                entity.id = dto._id;
                entity = _.omit(entity, '_id');

                entity.students = _.map(dto.students, function(studentDto) {
                    return studentTrans.dtoToEntity(studentDto);
                });

                entity.startDate = new Date(dto.startDate);
                entity.endDate = new Date(dto.endDate);

                return entity;
			},
			
			entityToDto: function(entity) {
                var dto = _.cloneDeep(entity);

                dto._id = entity.id;
                dto = _.omit(dto, 'id');

                dto.students = _.map(entity.students, function(studentEntity) {
                    return studentTrans.entityToDto(studentEntity);
                });

                if (entity.startDate) {
                    dto.startDate = entity.startDate.getTime();
                }
                if (entity.endDate) {
                    dto.endDate = entity.endDate.getTime();
                }

                return dto;
			}
		};
		
		return service;
}]);
