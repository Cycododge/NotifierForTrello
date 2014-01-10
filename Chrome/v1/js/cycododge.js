/*
License: http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US
  _____                        _             _
 / ____|                      | |           | |
| |     _   _   ___  ___    __| |  ___    __| |  __ _   ___
| |    | | | | / __|/ _ \  / _` | / _ \  / _` | / _` | / _ \
| |____| |_| || (__| (_) || (_| || (_) || (_| || (_| ||  __/
 \_____|\__, | \___|\___/  \__,_| \___/  \__,_| \__, | \___|
		__/  |                                   _/  |
		|___/                                   |___/

Build: 1.0.5
Date: 1/8/2014
http://cycododge.com
http://twitter.com/cycododge
*/
$(function(){
/* Definitions */
	var app = chrome.app.getDetails(), //details about this app
		lastUnread = 0, //the total unread since last check
		sndNewNote = new buzz.sound("/snd/newNote.mp3"), //load the sound for new notifications
		redirectURLtoMatch = 'trello.com', //match this to redirect instead of open new tab
		storage = chrome.storage.local, //the storage object
		user_data = chrome.extension.getBackgroundPage().user_data || {}, //contains object of user data
		note_data = {}, //contains object of note data
		note_structures = [ //list of classes to show
		/*0*/['user','user_gone','action','card_name','text-on-board','board_name'],
		/*1*/['user','user_gone','action','card_name','text-on-board','board_name','mention'],
		/*2*/['user','user_gone','action','card_name','text-to','list_name','text-on-board','board_name'],
		/*3*/['user','user_gone','action','board_name'],
		/*4*/['user','user_gone','action','organization'],
		/*5*/['user','user_gone','action','card_name','text-in','list_name','text-on-board','board_name'],
		/*6*/['user','user_gone','action','attached','text-to','card_name','text-on-board','board_name'],
		/*7*/['user','user_gone','action','checked','text-on-card','card_name','text-on-board','board_name']
			],
		note_types = {
			removedFromCard:{ text:'removed you from the card', structure:note_structures[0] },
			addedToCard:{ text:'added you to the card', structure:note_structures[0] },
			mentionedOnCard:{ text:'mentioned you on the card', structure:note_structures[1] },
			commentCard:{ text:'commented on the card', structure:note_structures[1] },
			changeCard:{ text:'moved the card', structure:note_structures[2] },
			createdCard:{ text:'created', structure:note_structures[5] },
			updateCheckItemStateOnCard:{ text:'checked', structure:note_structures[7] },

			addedMemberToCard:{ text:'joined the card', structure:note_structures[0] },
			removedMemberFromCard:{ text:'left the card', structure:note_structures[0] },
			addedAttachmentToCard:{ text:'attached', structure:note_structures[6] },

			addedToBoard:{ text:'added you to the board', structure:note_structures[3] },
			removedFromBoard:{ text:'removed you from the board', structure:note_structures[3] },
			invitedToBoard:{ text:'invited you to the board', structure:note_structures[3] },
			addAdminToBoard:{ text:'made you a co-owner on the board', structure:note_structures[3] },
			makeAdminOfBoard:{ text:'made you a co-owner on the board', structure:note_structures[3] },
			closeBoard:{ text:'closed the board', structure:note_structures[3] },

			removedFromOrganization:{ text:'removed you from the organization', structure:note_structures[4] },
			invitedToOrganization:{ text:'invited you to the organization', structure:note_structures[4] },
			addAdminToOrganization:{ text:'made you an admin on the organization', structure:note_structures[4] },
			makeAdminOfOrganization:{ text:'made you an admin of the organization', structure:note_structures[4] }
			},
		//create filters from note_types and add unread
		filters = function(){var obj={};for(var i in note_types){obj[i]=false;}obj.unread=false;return obj;}();


/* Immediate Actions */
document.title = app.name+' v'+app.version+' Popup'; //set the title of the page
$('#login .title').text(app.name+' v'+app.version); //set the text when asking to login

/* Events */

	//if the login button has been pressed
	$('#auth_button').on('click',function(){
		// chrome.tabs.create({url:chrome.extension.getURL('options.html')});
		chrome.extension.getBackgroundPage().login(); //login
	});

	//log the user out
	$('#btn_logout').on('click',function(){
		Trello.deauthorize(); //logout of popup
		chrome.extension.getBackgroundPage().Trello.deauthorize(); //logout from background
		chrome.browserAction.setBadgeText({text:'?'}); //indicate there is an error
		chrome.browserAction.setTitle({title:app.name+' - Authorization Needed'});
		$('#logged_in,#logged_out').toggle(); //hide #logged_in and show #logged_out
	});

	//perform actions when marking note as read/unread
	$('#data').on('click','.info',function(){
		var toggle = $(this).find('.check'), //cache this <input>
			note = $(this).parent('.note'); //the note wrapper
		//make card unread
		if(toggle.hasClass('marked')){
			Trello.put('notifications/'+note.attr('id'),{unread:true},function(s){console.log('success');},function(e){console.log('error');}); //mark unread on trello
			note.addClass('unread'); //change styling
			toggle.removeClass('marked').siblings('.help').text('Mark Read'); //mark unread
			for(var i in note_data){ if(note_data[i].id == note.attr('id')){ note_data[i].unread = true; break; } } //make object unread
		}else{ //make card read
			Trello.put('notifications/'+note.attr('id'),{unread:false},function(s){console.log('success');},function(e){console.log('error');}); //mark read on trello
			note.removeClass('unread'); //change styling
			toggle.addClass('marked').siblings('.help').text('Mark Unread'); //mark read
			for(var n in note_data){ if(note_data[n].id == note.attr('id')){ note_data[n].unread = false; break; } } //make object unread
			if(filters.unread){ note.slideUp(400); } //if showing unread notes, remove this note.
		}
		update_unread(true); //update user on number of unread notes
		if(filters.unread){ $('#viewing_count .total').text($('.note.unread').length); } //if showing unread notes, update total output
	});

	//mark all notes as read
	$('#btn_mark_all').on('click',function(){
		//for each unread note only
		$.each($('.note.unread'),function(){
			$(this).find('.info').click(); //perform the click action
		});
	});

	//display only unread notes
	$('#filter_unread').on('click',function(){
		$(this).hide(); //hide this button
		$('#filter_all').show(); //replace with filter all button
		output(note_data,{unread:true}); //set the filter
	});

	//display all notes
	$('#filter_all').on('click',function(){
		$(this).hide(); //hide this button
		$('#filter_unread').show(); //replace with filter all button
		output(note_data,{unread:false});
	});

	//for links on notes, get the href and go there through goToUrl();
	$('#data').on('click','.note a',function(e){ console.log($(this).attr('href'));
		e.preventDefault(); //don't follow the link
		goToUrl($(this).attr('href')); //navigate to the link
	});


/* Functions */

	//output cards
	function init(){
		output(chrome.extension.getBackgroundPage().note_data);
		$('#logged_in,#logged_out').toggle(); //hide #logged_out and show #logged_in
	}

	//output the notes to the screen
	window.output = function(notes,new_filters){
		note_data = notes; //update global object
		$('#data').empty(); //clear the current set of notes

		//if new filters were passed, update current
		for(var i in new_filters){
			filters[i] = new_filters[i];
		}

		//loop though notes
		for(var index in notes){
			var note = notes[index], //cache this note
				html = $('<div class="note"></div>'); //create the html object

			//validate note against filters
			if(filters.unread && !note.unread){ continue; } //unread; skip read notes

			//build the HTML object
			html.append('<div class="message"></div>'); //message
				html.find('.message').append('<span class="unknown_type">Unsupported Note Type: '+note.type+'</span> '); //
				html.find('.message').append('<span class="user_gone"></span> '); //who made the note
				html.find('.message').append('<span class="action"></span> '); //the note type (action)
				html.find('.message').append('<span class="attached"></span> '); //the item that was attached
				html.find('.message').append('<span class="checked"></span> '); //the item that was checked
				html.find('.message').append('<span class="text-on-card">on</span> '); //text = on
				html.find('.message').append('<span class="text-to">to</span> '); //text = to
				html.find('.message').append('<a class="card_name"></a> '); //card name
				html.find('.message').append('<span class="text-in">in</span> '); //text = in
				html.find('.message').append('<span class="list_name"></span> '); //list moved to
				html.find('.message').append('<span class="text-on-board">on</span> '); //text = on
				html.find('.message').append('<a class="board_name"></a> '); //board name
				html.find('.message').append('<a class="organization"></a> '); //organization name
				html.find('.message').append('<pre class="mention"></pre> '); //mention wrappper
			html.append('<div class="info"></div>'); //info
				html.find('.info').append('<div class="timestamp"></div>'); //date
				html.find('.info').append('<div class="status"><div class="help">Mark Unread</div><div class="check"></div></div>');

			//insert data
			try{ html.attr('id',note.id); }catch(e){} //set the note id
			try{ //who made the note
				html.find('.message .user_gone').replaceWith('<a class="user" href="http://trello.com/'+note.memberCreator.username+'">'+note.memberCreator.fullName+'</a>');
			}catch(e){
				html.find('.message .user_gone').text('[someone]'); //format for non-existing user
			}
			try{ html.find('.message .action').text(note_types[note.type].text); }catch(e){} //type of note
			try{ //item attached
				if(note.type == 'addedAttachmentToCard'){
					var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig; //detect url
					//if the name contains a URL, keep it short.
					var name_output = (note.data.name.match(urlRegex) ? (note.data.url.length > 25 ? note.data.name.slice(0,22)+'...' : name.data.url) : note.data.name);
					html.find('.message .attached').html('<a href="'+note.data.url+'">'+name_output+'</a>'); //output data
				}
			}catch(e){
				html.find('.message .attached').html('<span class="unknown">[unknown]</span>'); //don't know what the attachment is
			}
			try{ //item checked (also contains note.data.state == 'complete'. Keep an eye out for other states.
				if(note.type == 'updateCheckItemStateOnCard'){
					var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig; //detect url
					//if the name contains a URL, format it and keep it short.
					var name_output = note.data.name.replace(urlRegex,function(url){
						return '<a href="'+url+'">'+(url.length > 25 ? url.slice(0,22)+'...' : url)+'</a>';
					});
					html.find('.message .checked').html(name_output); //output data
				}
			}catch(e){
				html.find('.message .checked').html('<span class="unknown">[unknown]</span>'); //don't know what the checked item is
			}
			try{ html.find('.message .card_name').text(note.data.card.name).attr('href','http://trello.com/card/'+note.data.board.id+'/'+note.data.card.idShort); }catch(e){} //the card the action happened on
			try{ html.find('.message .list_name').text(note.data.listAfter.name); }catch(e){} //name of list card moved to
			try{ html.find('.message .list_name').text(note.data.list.name); }catch(e){} //name of list
			try{ html.find('.message .board_name').text(note.data.board.name).attr('href','http://trello.com/board/'+note.data.board.id); }catch(e){} //the board the note belongs to
			try{ html.find('.message .organization').text(note.data.organization.name).attr('href','http://trello.com/'+note.data.organization.id); }catch(e){} //link to organization
			try{ //parse @user's and the message - apply to tag
				var msg = note.data.text.replace(/@[a-z]+/gi,function(user){ return '<span class="at other">'+user+'</span>'; }), //style all mentions
					msg = msg.replace('other">@'+user_data.username,'me">@'+user_data.username); //style my mentions
				html.find('.message .mention').html(msg); //output text
			}catch(e){}
			try{ //format and output the date
				var date = new Date(note.date), //convert to date object
					hour = date.getHours() < 13 ? date.getHours():date.getHours()-12, //hours
					minutes = date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes(), //minutes
					ampm = date.getHours() < 13 ? 'a':'p', //if its morning or evening
					month = date.getMonth()+1,
					day = date.getDate(),
					year = date.getFullYear(),
					output = month + '/' + day + '/' + year + ' @ ' + (hour == 0 ? '12':hour) + ':' + minutes + ampm; //build the string
				html.find('.info .timestamp').text(output);
			}catch(e){} //date
			if(!note.unread){ //determine if unread
				html.find('.info .status .check').addClass('marked');
			}else{
				html.addClass('unread'); //specify unread class for styling
				html.find('.info .help').text('Mark Read'); //change help text on .info hover
			}

			//if this note has a structure
			try{
				if(note_types[note.type].structure){
				//loop through note structure
					for(var ind in note_types[note.type].structure){
						html.find('.message .'+note_types[note.type].structure[ind]).show(); //make visisble
					}
				}else{
					console.log(note);
				}
			}catch(e){
				html.find('.message .card_name').show();
				html.find('.message .unknown_type').append('<br />').show();
				console.log(note); //log a note that has no programmed structure
			}

			//output note to user
			$('#data').append(html);
		}

		//update note counts
		update_unread();
		if(!$('#data .note').length){ $('#data').html('<div style="margin-top:20px;">No notifications for this filter!</div>'); } //if no notes displayed
		$('#viewing_count .total').text($('.note').length); //total output
	};

	//update the total of unread notes on the page and badge
	function update_unread(suppressSound){
		//find each unread note
		var unread_count = 0;
		$.each($('.note.unread'),function(){ unread_count++; }); //add to total count of unread items

		//load the last unread total
		storage.get('lastUnread',function(data){
			//load data if it exists
			if(data.hasOwnProperty('lastUnread')){ lastUnread = data.lastUnread; }

			//did the amount change from the last check?
			if(lastUnread < unread_count){
				//try playing a sound to notify the user
				storage.get('sound',function(data){	if(data.sound && !suppressSound){ sndNewNote.play(); }});
			}

			//update the new total
			lastUnread = unread_count;
			storage.set({'lastUnread':lastUnread});
		});


		if(unread_count > 0){
			chrome.browserAction.setBadgeText({text:String(unread_count)}); //update unread count
		}else{
			chrome.browserAction.setBadgeText({text:''}); //remove badge
		}
		$('#unread_count .total').text(unread_count); //update page with total
		if(!unread_count){ $('#unread_count').addClass('zero'); }else{ $('#unread_count').removeClass('zero'); } //change color if unread == 0
	}

	//send user to link
	function goToUrl(myURL){console.log(myURL);
		//find the current tab
		chrome.tabs.getSelected(null,function(tab) {
			//if the current tab is on the correct site AND the myURL matches too
			if(tab.url.indexOf(redirectURLtoMatch) > -1 && myURL.indexOf(redirectURLtoMatch) > -1){
				// go to this url via the current tab
				chrome.tabs.update(tab.id,{url:myURL});
			}else{
				chrome.tabs.create({url:myURL});
			}
		});
	}

	$('#viewing_count').on('click','.twitter.sound',function(){
		//get status of sound
		storage.get('sound',function(v){
			//if the value is false (or doesn't exist), turn it off
			if(!v.sound){
				storage.set({'sound':true});
				$('.twitter.sound .status').text('On');
			}else{
				storage.set({'sound':false});
				$('.twitter.sound .status').text('Off');
			}
		});
	});

/* Page Initialization */
	//if logged in, start the script
	Trello.authorize({interactive:false,success:init});

	//determine if sound if on/off and set appropriately
	storage.get('sound',function(v){
		if(v.sound){
			$('.twitter.sound .status').text('On');
		}else{
			$('.twitter.sound .status').text('Off');
		}
	});
});