(function() {
	'use strict'; /* jshint -W040 */

	angular.module('app')
		.directive('cardLink',[directive]);

	//sets up the directive
	function directive() {
		return {
			restrict: 'E',
			scope: {
				'card': '='
			},
			transclude: true,
			template: '<a external ng-href="https://trello.com/c/{{card.shortLink}}">{{card.name}}</a>'
		};
	}
}());
