'use strict';

angular.module('trng.transformers').factory('trng.transformers.SingleStudentTransformer', [
    'trng.common.utils.DateUtil',
    function(dateUtil) {

        var service = {
			dtoToEntity: function(dto) {
		        var entity = _.cloneDeep(dto);

                if (dto.userClass.startDate) {
                    entity.userClass.startDate = new Date(dto.userClass.startDate).toString(dateUtil.dateJs.dateTimeFormat);
                }
                if (dto.userClass.endDate) {
                    entity.userClass.endDate = new Date(dto.userClass.endDate).toString(dateUtil.dateJs.dateTimeFormat);
                }

                return entity;
			},

			entityToDto: function(entity) {
		        var dto = _.cloneDeep(entity);

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
}]);
