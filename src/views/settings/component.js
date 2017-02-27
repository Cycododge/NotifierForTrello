(function() {
	'use strict'; /* jshint -W040 */

	angular.module('app')
		.component('settings',{
			templateUrl: 'views/settings/template.html',
			controllerAs: 'vm',
			controller: ['$state', controller]
		});

	//runs the component
	function controller($state){
		//config
		var vm = this;
		var app = chrome.app.getDetails();
		var bkg = chrome.extension.getBackgroundPage();
		vm.fn = {
			logout: logout
		};

		/////////////////

		//deauthorize the extension from Trello
		function logout() {
			//logout of popup
			Trello.deauthorize();

			//logout from background
			bkg.Trello.deauthorize();

			//indicate there is an error
			chrome.browserAction.setBadgeText({ text: '?' });
			chrome.browserAction.setTitle({ title: app.name + ' - Authorization Needed' });

			//send the user back to the auth view
			$state.go('authorize');
		}
	}
}());
