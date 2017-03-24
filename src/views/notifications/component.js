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
		vm.people = {};

		//perform initial setup
		init();


		////////////// FUNCTIONS //////////////

		//setup the component for initial use
		function init() {
			//if logged in, get the data
			Trello.authorize({
				interactive: false,
				success: function(){
					//get the note data
					vm.notes = bkg.note_data;
					console.log(vm.notes);

					//create dynamic people filters
					populatePeopleFilters(vm.notes);
				}
			});
		}

		//Create filters for people who created notifications
		function populatePeopleFilters(notes){
			//loop through each note
			notes.forEach(function(note){
				//if a person created this note AND they aren't already added
				if(note.memberCreator && !vm.people[note.memberCreator.id]){
					//cache this person
					vm.people[note.memberCreator.id] = {
						id: note.memberCreator.id,
						name: note.memberCreator.fullName,
						filter: { idMemberCreator: note.memberCreator.id }
					};
				}
			});
		}
	}
}());
