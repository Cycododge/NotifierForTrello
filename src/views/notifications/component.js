(function() {
	'use strict'; /* jshint -W040 */

	angular.module('app')
		.component('notifications',{
			templateUrl: 'views/notifications/template.html',
			controllerAs: 'vm',
			controller: [controller]
		});

	//runs the component
	function controller() {
		//config
		var vm = this;

		//perform initial setup
		init();


		////////////// FUNCTIONS //////////////

		//setup the component for initial use
		function init() {
			//
		}
	}
}());
