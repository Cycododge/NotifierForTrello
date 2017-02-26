(function() {
	'use strict'; /* jshint -W040 */

	angular.module('app')
		.directive('attachment',[directive]);

	//sets up the directive
	function directive() {
		return {
			restrict: 'E',
			scope: {
				'data': '='
			},
			transclude: true,
			templateUrl: '/directives/attachment/template.html'
		};
	}
}());
