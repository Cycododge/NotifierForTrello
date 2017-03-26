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
				text: 'Unread Only',
				count: 0,
				filter: { unread: true }
			},
			{
				text: 'My Mentions',
				count: 0,
				filter: { type: 'mentionedOnCard' }
			},
			{
				text: 'Comments Only',
				count: 0,
				filter: { data: { text: ''} }
			}
		];
		vm.activeMenu = 0;
		vm.fn = {
			setFilter: setFilter
		};

		//perform initial setup
		init();


		////////////// FUNCTIONS //////////////

		//sets the active filter
		function setFilter(index, btn) {
			vm.filter = btn.filter;
			vm.activeMenu = index;
		}

		//setup the component for initial use
		function init() {
			//if logged in, get the data
			Trello.authorize({
				interactive: false,
				success: function(){
					//get the note data
					vm.notes = bkg.note_data;

					//create dynamic people filters
					populatePeopleFilters(vm.notes);
				}
			});
		}

		//Create filters for people who created notifications
		function populatePeopleFilters(notes){
			var people = {};

			//loop through each note
			notes.forEach(function(note){
				//if a person created this note AND they aren't already added
				if(note.memberCreator && !people[note.memberCreator.id]){
					//cache this person
					people[note.memberCreator.id] = {
						id: note.memberCreator.id,
						name: note.memberCreator.fullName,
						filter: { idMemberCreator: note.memberCreator.id }
					};
				}
			});

			//add the people object to the menu array
			for (var person in people) {
				if(people.hasOwnProperty(person)) {
					vm.menu.push({
						text: 'By ' + people[person].name,
						count: 0,
						filter: people[person].filter
					});
				}
			}
		}
	}
}());
