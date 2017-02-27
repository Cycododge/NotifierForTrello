$(function(){
/* Definitions */
	var app = chrome.app.getDetails(), //details about this app
		lastUnread = 0, //the total unread since last check
		sndNewNote = new buzz.sound("/snd/newNote.mp3"), //load the sound for new notifications
		redirectURLtoMatch = 'trello.com', //match this to redirect instead of open new tab
		storage = chrome.storage.local, //the storage object
		$dom = $(document), //DOM cache
		bkg = chrome.extension.getBackgroundPage(), //references to the background page
		user_data = bkg.user_data || {}, //contains object of user data
		note_data = {}, //contains object of note data
		note_structures = [ //list of classes to show
		/*1*/['mention'],
		/*7*/['checked']
			],
		note_types = { },
		//create filters from note_types and add unread
		filters = function(){var obj={};for(var i in note_types){obj[i]=false;}obj.unread=false;return obj;}();


/* Immediate Actions */
document.title = app.name+' v'+app.version+' Popup'; //set the title of the page
$('#login .title').text(app.name+' v'+app.version); //set the text when asking to login

/* Events */

	//perform actions when marking note as read/unread
	$dom.on('click','#data .info',function(){
		var toggle = $(this).find('.check'), //cache this <input>
			note = $(this).parent('.note'); //the note wrapper

		//make card unread
		if(toggle.hasClass('marked')){
			Trello
				.put(
					'notifications/' + note.attr('id'),
					{ unread: true },
					function(s){
						console.log('success');
					},
					function(e){
						console.log('error');
					}
				); //mark unread on trello

			note
				.addClass('unread'); //change styling

			toggle
				.removeClass('marked')
				.siblings('.help')
				.text('Mark Read'); //mark unread

			for(var i in note_data){
				if(note_data[i].id == note.attr('id')){
					note_data[i].unread = true;
					break;
				}
			} //make object unread
		}else{ //make card read
			Trello
				.put(
					'notifications/' + note.attr('id'),
					{ unread: false },
					function(s){ console.log('success'); },
					function(e){ console.log('error'); }
				); //mark read on trello

			note
				.removeClass('unread'); //change styling

			toggle
				.addClass('marked')
				.siblings('.help')
				.text('Mark Unread'); //mark read

			for(var n in note_data){
				if(note_data[n].id == note.attr('id')){
					note_data[n].unread = false;
					break;
				}
			} //make object unread

			if(filters.unread){
				note.slideUp(400);
			} //if showing unread notes, remove this note.
		}

		update_unread(true); //update user on number of unread notes

		if(filters.unread){
			$('#viewing_count .total')
				.text(
					$('.note.unread').length
				);
		} //if showing unread notes, update total output
	});

	//mark all notes as read
	$dom.on('click','#btn_mark_all',function(){
		//for each unread note only
		$.each($('.note.unread'),function(){
			$(this).find('.info').click(); //perform the click action
		});
	});


/* Functions */

	//output the notes to the screen
	window.output = function(notes,new_filters){
		console.log(notes, new_filters);

		note_data = notes; //update global object

		$('#data').empty(); //clear the current set of notes

		var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig; //detect url

		//if new filters were passed, update current
		for(var i in new_filters){
			filters[i] = new_filters[i];
		}

		//loop though notes
		for(var index in notes){
			var note = notes[index], //cache this note
				$note = $('<div class="note" id="'+note.id+'"></div>'); //create the html object

			//validate note against filters
			if(filters.unread && !note.unread){ continue; } //unread; skip read notes

			//build a message
			$note.append(`
				<div class="message">
					<span class="checked"></span>
					<pre class="mention"></pre>
				</div>
				<div class="info">
					<div class="timestamp"></div>
					<div class="status">
						<div class="help">Mark Unread</div>
						<div class="check"></div>
					</div>
				</div>
			`);

			try{ //item checked (also contains note.data.state == 'complete'. Keep an eye out for other states.
				if(note.type == 'updateCheckItemStateOnCard'){

					//if the name contains a URL, format it and keep it short.
					var name_output = note.data.name.replace(urlRegex,function(url){
						return '<a href="'+url+'">'+(url.length > 25 ? url.slice(0,22)+'...' : url)+'</a>';
					});
					$note.find('.message .checked').html(name_output); //output data
				}
			}catch(e){
				$note.find('.message .checked').html('<span class="unknown">[unknown]</span>'); //don't know what the checked item is
			}

			try{ //parse @user's and the message - apply to tag
				var msg = note.data.text.replace(/@[a-z]+/gi,function(user){ return '<span class="at other">'+user+'</span>'; }), //style all mentions
					msg = msg.replace('other">@'+user_data.username,'me">@'+user_data.username); //style my mentions
				$note.find('.message .mention').html(msg); //output text
			}catch(e){}

			if(!note.unread){ //determine if unread
				$note
					.find('.info .status .check')
					.addClass('marked');
			}else{
				$note
					.addClass('unread'); //specify unread class for styling

				$note
					.find('.info .help')
					.text('Mark Read'); //change help text on .info hover
			}

			//if this note has a structure
			try{
				if(note_types[note.type].structure){
				//loop through note structure
					for(var ind in note_types[note.type].structure){
						$note.find('.message .'+note_types[note.type].structure[ind]).show(); //make visisble
					}
				}else{
					console.log(note);
				}
			}catch(e){
				$note.find('.message .card_name').show();
				$note.find('.message .unknown_type').append('<br />').show();
				console.log(note); //log a note that has no programmed structure
			}

			//output note to user
			$('#data').append($note);
		}

		//update note counts
		update_unread();

		if(!$('#data .note').length){
			$('#data')
				.html('<div style="margin-top:20px;">No notifications for this filter!</div>');
			} //if no notes displayed

		$('#viewing_count .total')
			.text($('.note').length); //total output
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

		if(!unread_count){
			$('#unread_count').addClass('zero');
		}else{
			$('#unread_count').removeClass('zero'); } //change color if unread == 0
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
	//determine if sound if on/off and set appropriately
	storage.get('sound',function(v){
		if(v.sound){
			$('.twitter.sound .status').text('On');
		}else{
			$('.twitter.sound .status').text('Off');
		}
	});
});
