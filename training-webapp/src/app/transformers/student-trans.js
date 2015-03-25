'use strict';

angular.module('trng.transformers').factory('StudentTransformer', [
    'DateUtil',
    function(DateUtil) {

        var service = {
			dtoToEntity: function(dto) {
		        var entity = _.cloneDeep(dto);

				entity.id = dto._id;
				entity = _.omit(entity, '_id');

				if (dto.userClass.startDate) {
                    entity.userClass.startDate = new Date(dto.userClass.startDate).toString(DateUtil.dateJs.dateTimeFormat);
                }
                if (dto.userClass.endDate) {
                    entity.userClass.endDate = new Date(dto.userClass.endDate).toString(DateUtil.dateJs.dateTimeFormat);
                }

                return entity;
			},

			entityToDto: function(entity) {
		        var dto = _.cloneDeep(entity);

				dto._id = entity.id;
				dto = _.omit(dto, 'id');

				if (entity.userClass.startDate) {
                    dto.userClass.startDate = entity.userClass.startDate.getTime();
                }
                if (entity.userClass.endDate) {
                    dto.userClass.endDate = entity.userClass.endDate.getTime();
                }

                return dto;
			}
		};
		
		return service;
    }
]);
