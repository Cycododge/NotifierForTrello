/*
License: http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US
  _____                        _             _
 / ____|                      | |           | |
| |     _   _   ___  ____    _| |  ____    _| |  __ _   ___
| |    | | | | / __|/ _  \ / _` | / _  \ / _` | / _` | / _ \
| |____| |_| || (__| (_) || (_| || (_) || (_| || (_| ||  __/
\_____|\__,_ |\___|\____/ \__,__|\____/ \__,__|\__, | \___|
         __/ |                                 __/ |
        |___/                                 |___/

Build: 2.0.0
Date: 7/20/2013
http://cycododge.com
http://twitter.com/cycododge

IMMEDIATE
	var declarations
	login
EVENTS
FUNCTIONS
	initLogin()
	authError()
	authSuccess()
*/


/* IMMEDIATE */

var timeToRefresh = 60 * 1000,
	app = chrome.app.getDetails(); //details from the manifest


//login
initLogin();


/* EVENTS */
/* FUNCTIONS */

//try loggining in the user
function initLogin(){
	//check for a connection first
	if(!navigator.onLine){
		console.log('No Connnection');
		setTimeout(initLogin,timeToRefresh); //check again in timeToRefresh
		return; //exit the function
	}

	//try connecting
	Trello.authorize({
		interactive:false,
		success:authSuccess,
		error:authError
	});
}

//user is not logged in
function authError(){
	chrome.browserAction.setBadgeText({text:'!'}); //indicate there is an error
	chrome.browserAction.setTitle({title:app.name+' v'+app.version+' - Authorization Needed'}); //give some descriptive text
}

//user is logged in
function authSuccess(){
	chrome.browserAction.setBadgeText({text:''}); //clear out any previous text
	chrome.browserAction.setTitle({title:app.name+' v'+app.version+' - Logged In'}); //Reset Title
}