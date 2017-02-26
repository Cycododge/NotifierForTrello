(function() {
	'use strict'; /* jshint -W040 */

	angular.module('app')
		.directive('boardLink',[directive]);

	//sets up the directive
	function directive() {
		return {
			restrict: 'E',
			scope: {
				'data': '='
			},
			transclude: true,
			template: '<a external ng-href="http://trello.com/board/{{data.board.id}}">{{data.board.name}}</a>'
		};
	}
}());
