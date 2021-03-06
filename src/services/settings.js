(function() {
	'use strict'; /* jshint -W040 */

	angular.module('app')

	.factory('settingsService', [function(){
		//config
		var storageKey = 'settings';
		var defaults = {
			readOnView: true
		};
		var cachedSettings = load();

		//send back methods to play with
		return {
			save: save,
			load: load
		};


		///////////////// FUNCTIONS /////////////////

		//save settings to localStorage
		//@settings: object of settings to update
		function save(updatedSettings) {
			//update the cachedSettings with incoming settings
			cachedSettings = angular.extend(cachedSettings, updatedSettings);

			//save updated to localStorage
			localStorage[storageKey] = JSON.stringify(cachedSettings);
		}

		//loads settings from storage OR sets defaults
		function load() {
			//get the localStorage settings as an object
			var settings = JSON.parse(localStorage[storageKey] || '{}');

			//merge settings and defaults
			settings = angular.extend(defaults, settings);

			//send back the settings
			return settings;
		}
	}]);
})();
