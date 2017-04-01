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
		var storageKey = 'settings';
		var settingsDefaults = {
			readOnView: true
		};
		vm.settings = loadSettings(settingsDefaults);
		vm.fn = {
			logout: logout,
			saveSettings: saveSettings
		};


		///////////////// FUNCTIONS /////////////////

		//saves settings to local storage
		function saveSettings() {
			localStorage[storageKey] = JSON.stringify(vm.settings);
		}

		//loads settings from storage OR sets defaults
		function loadSettings(defaults) {
			//get the localStorage settings as an object
			var settings = JSON.parse(localStorage[storageKey] || '{}');

			//merge settings and defaults
			settings = angular.extend(defaults, settings);

			//send back the settings
			return settings;
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
