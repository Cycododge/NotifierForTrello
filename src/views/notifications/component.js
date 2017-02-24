(function() {
	'use strict'; /* jshint -W040 */

	angular.module('app')
		.component('notifications',{
			templateUrl: 'views/notifications/template.html',
			controllerAs: 'vm',
			controller: ['$state', controller]
		});

	//runs the component
	function controller($state){
		//config
		var vm = this;
		var app = chrome.app.getDetails();
		var bkg = chrome.extension.getBackgroundPage();
		vm.notes = [];
		vm.filter = '';
		vm.menu = [
			{
				text: 'Show All',
				count: 0,
				filter: {}
			},
			{
				text: 'Unread',
				count: 0,
				filter: { unread: true }
			}
		];
		vm.fn = {
			logout: logout
		};

		//perform initial setup
		init();


		////////////// FUNCTIONS //////////////

		//setup the component for initial use
		function init() {
			//if logged in, start the script
			Trello.authorize({
				interactive: false,
				success: function(){
					//get the note data
					vm.notes = bkg.note_data;
				}
			});
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
