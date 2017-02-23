(function() {
	'use strict'; /* jshint -W040 */

	angular.module('app')
		.component('authorize',{
			templateUrl: 'views/authorize/template.html',
			controllerAs: 'vm',
			controller: [controller]
		});

	//runs the component
	function controller() {
		//config
		var vm = this;
		var bkg = chrome.extension.getBackgroundPage();
		vm.fn = {
			login: bkg.login
		};
	}
}());
