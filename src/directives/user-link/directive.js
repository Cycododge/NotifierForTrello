(function() {
	'use strict'; /* jshint -W040 */

	angular.module('app')
		.directive('userLink',[directive]);

	//sets up the directive
	function directive() {
		return {
			restrict: 'E',
			scope: {
				'user': '='
			},
			transclude: true,
			template: '<a external ng-href="https://trello.com/{{user.username}}">{{user.fullName}}</a>'
		};
	}
}());
