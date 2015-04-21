'use strict';

angular.module('trng.transformers').factory('ClassesTransformer', [
	function() {
		function studentDtoToEntity(dto) {
			var entity = _.cloneDeep(dto);

			entity.id = dto._id;
			entity = _.omit(entity, '_id');

			entity.user.id = dto.user._id;
			entity.user = _.omit(entity.user, '_id');

			return entity;
		}

		function studentEntityToDto(entity) {
			var dto = _.cloneDeep(entity);

			dto._id = entity.id;
			dto = _.omit(dto, 'id');

			dto.user._id = entity.user.id;
			dto.user = _.omit(dto.user, 'id');

			return dto;
		}

        var service = {
			dtoToEntity: function(dto) {
		        var entity = _.cloneDeep(dto);

                entity.id = dto._id;
                entity = _.omit(entity, '_id');

                entity.students = _.map(dto.students, function(studentDto) {
                    return studentDtoToEntity(studentDto);
                });

				_.forEach(entity.bpPublishDetailsList, function(publishDetails) {
					if (publishDetails.autoStop !== -1) {
						publishDetails.autoStop = publishDetails.autoStop;
					}
				});

                return entity;
			},
			
			entityToDto: function(entity) {
                var dto = _.cloneDeep(entity);

                dto._id = entity.id;
                dto = _.omit(dto, 'id');

                dto.students = _.map(entity.students, function(studentEntity) {
                    return studentEntityToDto(studentEntity);
                });

				_.forEach(dto.bpPublishDetailsList, function(publishDetails) {
					delete publishDetails.bpName;
					if (publishDetails.autoStop !== -1) {
						publishDetails.autoStop = publishDetails.autoStop;
					}
				});

                return dto;
			}
		};
		
		return service;
    }
]);
