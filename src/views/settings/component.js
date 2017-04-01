(function() {
	'use strict'; /* jshint -W040 */

	angular.module('app')
		.component('settings',{
			templateUrl: 'views/settings/template.html',
			controllerAs: 'vm',
			controller: ['$state','settingsService', controller]
		});

	//runs the component
	function controller($state, settingsService){
		//config
		var vm = this;
		var app = chrome.app.getDetails();
		var bkg = chrome.extension.getBackgroundPage();
		vm.settings = settingsService.load();
		vm.fn = {
			logout: logout,
			saveSettings: saveSettings
		};


		///////////////// FUNCTIONS /////////////////

		//saves current settings
		function saveSettings() {
			settingsService.save(vm.settings);
		}

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
