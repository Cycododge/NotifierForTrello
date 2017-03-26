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
				id: 1,
				text: 'Show All',
				count: 0,
				filter: {}
			},
			{
				id: 2,
				text: 'Unread Only',
				count: 0,
				filter: { unread: true }
			},
			{
				id: 3,
				text: 'My Mentions',
				count: 0,
				filter: { type: 'mentionedOnCard' }
			},
			{
				id: 4,
				text: 'Comments Only',
				count: 0,
				filter: { data: { text: ''} }
			}
		];
		vm.activeFilter = localStorage.activeFilter || '0';
		vm.fn = {
			setFilter: setFilter
		};

		//perform initial setup
		init();


		////////////// FUNCTIONS //////////////

		//sets the active filter
		function setFilter(index, btn) {
			vm.filter = btn.filter;
			vm.activeFilter = index;
			localStorage.activeFilter = index;
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

					//set the active filter
					vm.filter = vm.menu[vm.activeFilter].filter;
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
			var count = vm.menu.length;
			for (var person in people) {
				if(people.hasOwnProperty(person)) {
					vm.menu.push({
						id: count++,
						text: 'From ' + people[person].name,
						count: 0,
						filter: people[person].filter
					});
				}
			}
		}
	}
}());
