(function() {
	'use strict';

	angular.module('app')
		.filter('human_date', function () {
			return function(date) {
				//send back the date in a human readable format
				return moment(date).calendar();
			};
		});
}());
