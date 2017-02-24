(function() {
	'use strict'; /* jshint -W040 */

	angular.module('app')
		.directive('external',[directive]);

	//sets up the directive
	function directive() {
		return {
			restrict: 'A',
			scope: {},
			link: controller
		};

		//runs the controller
		function controller(scope, element, attrs) {
			//when the user clicks on an external link
			element.on('click', function(e){
				//stop the default action
				e.preventDefault();

				//use custom method to navigate user
				goToUrl(attrs.href);
			});
		}

		//send user to an external link
		function goToUrl(URL){
			//The Trello URL to check against
			var urlCheck = 'trello.com';

			//find the current tab
			chrome.tabs.getSelected(null, function(tab){
				//if the current tab is on the correct site AND the URL matches too
				if(tab.url.indexOf(urlCheck) > -1 && URL.indexOf(urlCheck) > -1){
					//go to this url via the current tab
					chrome.tabs.update(tab.id,{ url: URL });
				}else{
					//open a new tab
					chrome.tabs.create({ url: URL });
				}
			});
		}
	}
}());
