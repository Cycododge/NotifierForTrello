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
				id: 'all',
				text: 'Show All',
				filter: {}
			},
			{
				id: 'unread',
				text: 'Unread Only',
				filter: { unread: true }
			},
			{
				id: 'mentions',
				text: 'My Mentions',
				filter: { type: 'mentionedOnCard' }
			},
			{
				id: 'comments',
				text: 'Comments Only',
				filter: { data: { text: ''} }
			}
		];
		vm.activeFilter = localStorage.activeFilter || '0';
		vm.fn = {
			setFilter: setFilter,
			clearFilter: clearFilter
		};

		//perform initial setup
		init();


		////////////// FUNCTIONS //////////////

		//clears the user's selected filter
		function clearFilter() {
			vm.filter = {};
			vm.activeFilter = vm.menu[0].id;
			localStorage.activeFilter = vm.activeFilter;
		}

		//sets the active filter
		function setFilter(btn) {
			vm.filter = btn.filter;
			vm.activeFilter = btn.id;
			localStorage.activeFilter = vm.activeFilter;
		}

		//sets the default active filter
		function loadDefaultFilter() {
			//track if the filter was set
			var filterSet = false;

			//loop through each menu item
			for (var i = 0; i < vm.menu.length; i++) {
				//if this button is the active one
				if(vm.menu[i].id === vm.activeFilter){
					//set the active filter to the button
					vm.filter = vm.menu[i].filter;

					//mark that the filter was found
					filterSet = true;

					//stop the loop
					break;
				}
			}

			//if the loaded filter wasn't found in the list, clear altogether.
			if(!filterSet){ clearFilter(); }
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
					loadDefaultFilter();
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
						id: people[person].id,
						text: 'From ' + people[person].name,
						filter: people[person].filter
					});
				}
			}
		}
	}
}());
