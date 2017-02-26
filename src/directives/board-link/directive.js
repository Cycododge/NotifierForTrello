(function() {
	'use strict'; /* jshint -W040 */

	angular.module('app')
		.directive('boardLink',[directive]);

	//sets up the directive
	function directive() {
		return {
			restrict: 'E',
			scope: {
				'board': '='
			},
			transclude: true,
			template: '<a external ng-href="https://trello.com/b/{{board.shortLink}}">{{board.name}}</a>'
		};
	}
}());
