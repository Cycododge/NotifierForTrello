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
			//open the link in a new tab
			chrome.tabs.create({ url: URL });


			////////////////////////////////
			// Below is pending work/brainstorming for Smart Tabs
			////////////////////////////////


			//The Trello URL to check against
			// var urlCheck = 'trello.com';

			//find all open Trello tabs
			// chrome.tabs.query({ url: 'https://trello.com/*' }, function(tabs){
			// 	console.log(tabs);
			// });

			//find the current tab
			// chrome.tabs.getSelected(null, function(tab){
				//"Open Trello Links in a New Tab"
				//// "Hold CTRL to toggle behavior"
				//alwaysNewTab = false;
				//viewingTrello = false;

				//if alwaysNewTab
					//new tab
				//if !alwaysNewTab
					//if linking to trello
						//replace current tab
					//if !viewingTrello
						//new tab

				//viewing Trello website
					//if alwaysNewTab
						//new tab
					//if !alwaysNewTab
						//if linking to trello
						//if !linking to trello
				//not viewing Trello
					//if new tab page
						//current tab
					//if !new tab page
						//new tab

				//if the current tab is Trello AND the URL matches too
				// if(tab.url.indexOf(urlCheck) > -1 && URL.indexOf(urlCheck) > -1){
					//go to this url via the current tab
					// chrome.tabs.update(tab.id,{ url: URL });
				// }else{
					//open a new tab
					// chrome.tabs.create({ url: URL });
				// }
			// });
		}
	}
}());
