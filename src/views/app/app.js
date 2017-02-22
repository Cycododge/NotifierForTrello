(function() {
	'use strict';

	//init angular
	angular
		//import modules
		.module('app', ['ui.router'])

		//disable angular debug
		.config(['$compileProvider', function($compileProvider){
			$compileProvider.debugInfoEnabled(false);
		}])

		//setup routing
		.config(['$stateProvider', '$urlRouterProvider', routes]);

	//views the user can interact with
	function routes($stateProvider, $urlRouterProvider) {
		//set a default route
		$urlRouterProvider.otherwise('/');

		//define each route
		$stateProvider
			//the list of notifications
			.state('notifications', {
				url: '/',
				template: '<notifications></notifications>'
			})

			//if the user needs to authorize
			.state('authorize', {
				url: '/authorize',
				template: '<authorize></authorize>'
			});
	}
}());
