(function() {
	'use strict'; /* jshint -W040 */

	angular.module('app')
		.component('notifications',{
			templateUrl: 'views/notifications/template.html',
			controllerAs: 'vm',
			controller: [controller]
		});

	//runs the component
	function controller(){
		//config
		var vm = this;
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
	}
}());
