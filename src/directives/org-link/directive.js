(function() {
	'use strict'; /* jshint -W040 */

	angular.module('app')
		.directive('orgLink',[directive]);

	//sets up the directive
	function directive() {
		return {
			restrict: 'E',
			scope: {
				'data': '='
			},
			transclude: true,
			template: '<a external ng-href="https://trello.com/{{data.organization.id}}">{{data.organization.name}}</a>'
		};
	}
}());
