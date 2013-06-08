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

Build: 1.0.4
Date: 6/7/2013
http://cycododge.com
http://twitter.com/cycododge
*/


/* Definitions */
var request_limit = 50, //number of notes to return
	refresh_minutes = 1, //amount of minutes to wait before next refresh
	user_data = {}, //contains object of user data
	note_data = {}, //contains object of note data
	_popup = 'popup.html', //the file name of the popup page
	app = chrome.app.getDetails(), //manifest description
	storage = chrome.storage.local, //the local storage object
	refresh_time = 60 * refresh_minutes * 1000, //refresh data in X seconds
	sndNewNote = new buzz.sound("/snd/newNote.mp3"), //load the sound for new notifications
	lastUnread = 0; //total unread notes since last check

/* Immediate Actions */
document.title = app.name+' v'+app.version+' Background'; //set the title of the page

//check if user is logged in
function loginCheck(){
	//check for a connection first
	if(!navigator.onLine){
		console.log('No Connnection');
		setTimeout(loginCheck,refresh_time); //check again in refresh_time
		return; //exit the function
	}

	//try connecting
	Trello.authorize({
		interactive:false,
		success:auth_success,
		error:auth_error
	});
}loginCheck();

/* Functions */
//user is not logged in
function auth_error(){
	console.log('Error logging in.');
	// storage.set({'loginStatus':false}); //if Trello doesn't think we're logged in, reset here.
	chrome.browserAction.setBadgeText({text:'?'}); //indicate there is an error
	chrome.browserAction.setTitle({title:app.name+' v'+app.version+' - Authorization Needed'}); //give some descriptive text
}

//user is logged in
function auth_success(){
	// storage.set({'loginStatus':true}); //set the user as logged in
	chrome.browserAction.setBadgeText({text:''}); //clear out any previous text
	chrome.browserAction.setTitle({title:app.name+' v'+app.version+' - Logged In'}); //Reset Title
	member_data(); //load the logged in user
}

//returns the popup page
function popup(){
	//loop through the available pages
	for(var i in chrome.extension.getViews()){
		page = chrome.extension.getViews()[i];
		if(page.location.href == chrome.extension.getURL(_popup)){
			return page;
		}
	}
}

//retrieve user information
function member_data(){
	Trello.members.get("me", function(member){
		//console.log(member);
		user_data = member; //make available to other functions
		get_notes(); //make initial call to get all notes
	});
}

//retrieve list of notifications
function get_notes(update){ //filters: all, unread, update
	console.log('Update Check: '+new Date());
	var my_limit = update ? 1 : request_limit; //if only updating, just get the last note

	//if browser is offline - come back around in refresh_time to see if connection is back
	if(!navigator.onLine){
		console.log('No Connection');
		setTimeout(get_notes,refresh_time);
		return;
	}

	//if we're logged in
	if(Trello.authorized()){
		//send request
		if(popup()){ popup().$('#loader img').fadeIn(); } //show the loading animation

		Trello.get(
			'members/me/notifications', //path
			{filter:"all",limit:my_limit,page:0}, //input parameters
			function(data){ //on success
				//if we have no pre-existing notes
				if($.isEmptyObject(note_data)){console.log('No Existing Data - Populating');
					note_data = data; //update global object
					if(popup()){ popup().output(data); }else{ update_badge(); } //update the data on the popup
				}else{
					//if we have new data
					if(/*note_data[0].id != data[0].id*/true){console.log('New Data Found');
						//was this an update check?
						if(update){console.log('Update Event - Getting New Data');
							get_notes(); //re-call this function to get recent [request_limit] notes
						}else{console.log('Request Event - Output Data');
							//update global object
							note_data = data;

							//update the data on the popup or badge
							if(popup()){ popup().output(data); }else{ update_badge(); }
						}
					}else{
						console.log('Nothing New Found');
					}
				}

				//process complete, hide the loading animation
				if(popup()){ popup().$('#loader img').fadeOut(); }

				//check for more notes in refresh_time
				setTimeout(get_notes,refresh_time);
			},
			//on fail
			function(){
				console.log('Error Refreshing Data');

				//check for more notes in refresh_time
				setTimeout(get_notes,refresh_time);
			}
		);
	}else{
		//Trello says we aren't logged in - so log in
		loginCheck();
	}
}

//update the total of unread notes on the badge
function update_badge(){
	//count unread notes
	var count = 0;
	for(var i in note_data){
		if(note_data[i].unread){ count++; }
	}

	//get the saved value from lastupdate
	storage.get('lastUnread',function(data){
		//load the value if it exists
		if(data.hasOwnProperty('lastUnread')){ lastUnread = data.lastUnread; }

		//did the amount change from the last check?
		if(lastUnread < count){
			//try playing a sound to notify the user
			storage.get('sound',function(data){	if(data.sound){	sndNewNote.play(); }});
		}

		//update the new total
		lastUnread = count;
		storage.set({'lastUnread':lastUnread});
	});


	if(count){
		chrome.browserAction.setBadgeText({text:String(count)});
	}else{
		chrome.browserAction.setBadgeText({text:''});
	}
}