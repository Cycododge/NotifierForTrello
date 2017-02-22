(function() {
	'use strict'; /* jshint -W040 */

	angular.module('app')
		.component('authorize',{
			templateUrl: 'views/authorize/template.html',
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
