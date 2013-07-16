/*
License: http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US
  _____                        _             _
 / ____|                      | |           | |
| |     _   _   ___  ___    __| |  ___    __| |  __ _   ___
| |    | | | | / __|/ _ \  / _` | / _ \  / _` | / _` | / _ \
| |____| |_| || (__| (_) || (_| || (_) || (_| || (_| ||  __/
 \_____|\__, | \___|\___/  \__,_| \___/  \__,_| \__, | \___|
         __/ |                                   __/ |
        |___/                                   |___/

Build: 1.0.2
Date: 2/15/2013
http://cycododge.com
http://twitter.com/cycododge
*/

/* Variable Declaration */
var app = chrome.app.getDetails(), //information from the manifest
	storage = chrome.storage.local; //the storage object


/* Immediate Actions */
document.title = app.name+' v'+app.version+' Authorization'; //set the title of the page
//grab the authorization
Trello.authorize({
	expiration:'never',
	persist:true,
	scope:{read:true,write:true,account:true},
	name:app.name+' v'+app.version,
	success: function(){
		storage.set({'loginStatus':true}); //successfully logged in
		chrome.extension.getBackgroundPage().login_check(); //start the next step

		chrome.tabs.getCurrent(function(tab){ //get the current tab id
			chrome.tabs.remove(tab.id); //close the current tab
		});
	}
});