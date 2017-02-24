(function() {
	'use strict'; /* jshint -W040 */

	angular.module('app')
		.component('note',{
			templateUrl: 'components/note/template.html',
			controllerAs: 'vm',
			controller: [controller],
			bindings: {
				note: '<'
			}
		});

	//runs the component
	function controller() {
		//config
		var vm = this;
		vm.fn = {
		};

		//initialize the component when ready
		vm.$onInit = init;


		//////////////////// FUNCTIONS ////////////////////

		//initialization of component
		function init() {

			console.log(vm.note);

		}
	}
}());
