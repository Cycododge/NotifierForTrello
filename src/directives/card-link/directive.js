(function() {
	'use strict'; /* jshint -W040 */

	angular.module('app')
		.directive('cardLink',[directive]);

	//sets up the directive
	function directive() {
		return {
			restrict: 'E',
			scope: {
				'data': '='
			},
			transclude: true,
			template: '<a external ng-href="http://trello.com/card/{{data.board.id}}/{{data.card.idShort}}">{{data.card.name}}</a>'
		};
	}
}());
