'use strict';

angular.module('trng.transformers').factory('trng.transformers.ClassesTransformer', [
	'trng.transformers.GeneralTransformer',
	'trng.common.utils.DateUtil',
	function(generalTrans, dateUtil) {

        var service = {
			dtoToEntity: function(dto) {
		        var entity = _.cloneDeep(dto);

                entity['startDate'] = Date.parse(entity['startDate']);
                entity['endDate'] = Date.parse(entity['endDate']);

                return entity;
			},
			
			entityToDto: function(entity) {
                var dto = _.cloneDeep(entity);

                dto['startDate'] = dto['startDate'].toString(dateUtil.dateFormat);
                dto['endDate'] = dto['endDate'].toString(dateUtil.dateFormat);

                return dto;
			}
		};
		
		return service;
}]);
