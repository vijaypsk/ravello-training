'use strict';

exports.downloadText = function(request, response) {
	var filename = request.params.filename;
	var content = request.body.content;

	response.setHeader('Content-disposition', 'attachment; filename=' + filename);
	response.setHeader('Content-Type', 'text/csv');

	response.send(content);
};