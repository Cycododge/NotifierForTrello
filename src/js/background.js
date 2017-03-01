/* Declarations */

//user
var request_limit = 50, //number of notes to return
	refresh_minutes = 1, //amount of minutes to wait before next refresh
	_popup = 'popup.html', //the file name of the popup page
	refresh_time = 60 * refresh_minutes * 1000; //refresh data in X seconds

//system
var sndNewNote = new Howl({ src: ['/snd/newNote.mp3' ]}), //load the sound for new notifications
	user_data = {}, //contains object of user data
	note_data = {}, //contains object of note data
	app = chrome.app.getDetails(), //manifest description
	storage = chrome.storage.local, //the local storage object
	lastUnread = 0; //total unread notes since last check

/* Immediate Actions */
document.title = app.name + ' v' + app.version + ' Background'; //set the title of the page

//check if user is logged in
function loginCheck(){
	//check for a connection first
	if(!navigator.onLine){
		setTimeout(loginCheck, refresh_time); //check again in refresh_time
		return; //exit the function
	}

	//try connecting
	Trello.authorize({
		interactive: false, //check locally for token
		success: auth_success,
		error: auth_error
	});
}

//run this immediately
loginCheck();


////////////////////////// Functions //////////////////////////

//take the user through the login process
function login(){
	//request authorization
	Trello.authorize({
		expiration: 'never',
		persist: true,
		type: 'chromeTab', //open in a new tab
		redirect_uri: 'http://trello.com',
		scope: {
			read: true,
			write: true,
			account: true
		},
		name: app.name + ' v' + app.version
	});

	//determine when the user logs in
	chrome.tabs.onUpdated.addListener(function(id, whatChanged, tab){
		//if page found with token
		if(tab.url.indexOf('https://trello.com/token=') >= 0){
			var token = tab.url.split(/[&#]?token=([0-9a-f]{64})/)[1]; //parse out token
			if(!token){ return; } //exit here if token wasn't found
			Trello.setToken(token); //successfully logged in
			storage.set({ loginStatus: true }); //successfully logged in
			loginCheck(); //start the next step
			chrome.tabs.remove(id); //close tab
		}
	});
}

//user is not logged in
function auth_error(){
	chrome.browserAction.setBadgeText({ text: '?' }); //indicate there is an error
	chrome.browserAction.setTitle({ title: app.name + ' v' + app.version + ' - Authorization Needed' }); //give some descriptive text
}

//user is logged in
function auth_success(){
	chrome.browserAction.setBadgeText({ text: '' }); //clear out any previous text
	chrome.browserAction.setTitle({ title: app.name + ' v' + app.version + ' - Logged In' }); //Reset Title
	member_data(); //load the logged in user
}

//returns the popup page
function popup(fn){
	var view = null; //cache

	//loop through the available pages
	for(var i in chrome.extension.getViews()){
		var check = chrome.extension.getViews()[i]; //cache this result
		if(check.location.href == chrome.extension.getURL(_popup)){ view = check; break; } //if found, save match.
	}

	//if no view found OR no function passed, give a response.
	if(!view || !fn){ return view; }

	//run any passed function and pass in the view context
	fn.call(view);
}

//retrieve user information
function member_data(){
	Trello.members.get('me', function(member){
		user_data = member; //make available to other functions
		get_notes(); //make initial call to get all notes
	});
}

//retrieve list of notifications
function get_notes(update){ //filters: all, unread, update
	var my_limit = update ? 1 : request_limit; //if only updating, just get the last note

	//if browser is offline - come back around in refresh_time to see if connection is back
	if(!navigator.onLine){
		setTimeout(get_notes, refresh_time);
		return;
	}

	//if we're logged in
	if(Trello.authorized()){
		//send request
		setBadge('...');

		Trello.get(
			'members/me/notifications', //path
			{ filter: 'all', limit: my_limit, page: 0 }, //input parameters
			function(data){ //on success
				//if we have no pre-existing notes
				if($.isEmptyObject(note_data)){
					note_data = data; //update global object
					if(popup()){ popup().output(data); }else{ update_badge(); } //update the data on the popup
				}else{
					//was this an update check?
					if(update){
						get_notes(); //re-call this function to get recent [request_limit] notes
					}else{
						//update global object
						note_data = data;

						//update the data on the popup or badge
						if(popup()){ popup().output(data); }else{ update_badge(); }
					}
				}

				//process complete, update the badge
				update_badge();

				//check for more notes in refresh_time
				setTimeout(get_notes,refresh_time);
			},
			//on fail
			function(){
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
			storage.get('sound', function(data){
				if(data.sound){
					sndNewNote.play();
				}
			});
		}

		//update the new total
		lastUnread = count;
		storage.set({ lastUnread: lastUnread });
	});

	//update the badge text
	chrome.browserAction.setBadgeText({ text: String(count || '') });
}

//sets the text on the extension's badge
function setBadge(text){
	chrome.browserAction.setBadgeText({ text: text });
}
