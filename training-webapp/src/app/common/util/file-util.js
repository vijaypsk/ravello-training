'use strict';

angular.module('trng.common.utils').factory('FileUtil', [
	function () {
		var service = {
			downloadText: function(filename, text) {
				var form = document.createElement('form');
				form.setAttribute('method', 'post');
				form.setAttribute('action', '/download/' + filename);
				form.setAttribute('target', 'keypairDownloadIframe');

				var input = document.createElement('input');
				input.setAttribute('type', 'hidden');
				input.setAttribute('name', 'content');
				input.setAttribute('value', text);

				var iframe = document.createElement('iframe');
				iframe.setAttribute('name', 'keypairDownloadIframe');

				form.appendChild(input);
				form.appendChild(iframe);

				document.body.appendChild(form);
				form.submit();

				// We don't want to leave garbage of HTML in the body, which is not visible and only serves us
				// for the mere post of the data to the server...
				// We assume that a timeout of 5000 millis will suffice for generating the post, and then safely
				// removing the unnecessary element.
				setTimeout(function() {
					form.remove();
				}, 5000);
			}
		};

		return service;
	}
]);


