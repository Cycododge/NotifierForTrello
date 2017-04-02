(function() {
	'use strict'; /* jshint -W040 */

	angular.module('app')

	.factory('exclusionService', [function(){
		//config
		var storageKey = 'exclusions';
		var cachedExclusions = load();

		//send back methods to play with
		return {
			exclude: exclude,
			isExcluded: isExcluded,
			remove: remove
		};


		///////////////// FUNCTIONS /////////////////

		//removes an item from the exclusion list
		function remove(id) {
			//get the index of the id in the list
			var index = cachedExclusions.indexOf(id);

			//exit if an index was not returned
			if(!~index){ return; }

			//remove the item from the list
			cachedExclusions.splice(index,1);

			//update storage
			save();
		}

		//adds an id to the exclusion list and saves it
		function exclude(id) {
			//if the id is already in the list, exit
			if(isExcluded(id)){ return; }

			//add it to the list
			cachedExclusions.push(id);

			//update storage
			save();
		}

		//checks if a note is excluded from the auto-read functionality
		function isExcluded(id) {
			//check the array for an id match
			return Boolean(~cachedExclusions.indexOf(id));
		}

		//saves the cache to localStorage
		function save() {
			localStorage[storageKey] = JSON.stringify(cachedExclusions);
		}

		//loads exclusions from localStorage
		function load() {
			//get the list of exclusions as an array
			return JSON.parse(localStorage[storageKey] || '[]');
		}
	}]);
})();
