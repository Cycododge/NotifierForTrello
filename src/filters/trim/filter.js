(function() {
	'use strict';

	angular.module('app')
		.filter('trim', function () {
			return function(value) {
				if(!angular.isString(value)) {
					return value;
				}

				//send back the trimmed value
				return value.trim();
			};
		});
}());
