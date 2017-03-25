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
	function controller(){
		//config
		var vm = this,
			bkg = chrome.extension.getBackgroundPage();
		vm.noteTypes = {
			addAttachmentToCard: '<user-link user="vm.note.memberCreator"></user-link> attached {{vm.note.data.attachment.name}} to <card-link card="vm.note.data.card"></card-link> on <board-link board="vm.note.data.board"></board-link>',

			cardDueSoon: '<card-link card="vm.note.data.card"></card-link> on <board-link board="vm.note.data.board"></board-link> is due {{vm.note.data.card.due | human_date}}',

			commentCard: '<user-link user="vm.note.memberCreator"></user-link> commented on the card <card-link card="vm.note.data.card"></card-link> on <board-link board="vm.note.data.board"></board-link>',

			memberJoinedTrello: '<user-link user="vm.note.memberCreator"></user-link> joined Trello on your recommendation. You earned a free month of Trello Gold',

			removedFromCard: '<user-link user="vm.note.memberCreator"></user-link> removed you from the card <card-link card="vm.note.data.card"></card-link> on <board-link board="vm.note.data.board"></board-link>',

			addedToCard: '<user-link user="vm.note.memberCreator"></user-link> added you to the card <card-link card="vm.note.data.card"></card-link> on <board-link board="vm.note.data.board"></board-link>',

			mentionedOnCard: '<user-link user="vm.note.memberCreator"></user-link> mentioned you on the card <card-link card="vm.note.data.card"></card-link> on <board-link board="vm.note.data.board"></board-link>',

			changeCard: '<user-link user="vm.note.memberCreator"></user-link> moved the card <card-link card="vm.note.data.card"></card-link> to <list-name data="vm.note.data"></list-name> on <board-link board="vm.note.data.board"></board-link>',

			createdCard: '<user-link user="vm.note.memberCreator"></user-link> created <card-link card="vm.note.data.card"></card-link> in <list-name data="vm.note.data"></list-name> on <board-link board="vm.note.data.board"></board-link>',

			addedMemberToCard: '<user-link user="vm.note.memberCreator"></user-link> joined the card <card-link card="vm.note.data.card"></card-link> on <board-link board="vm.note.data.board"></board-link>',

			removedMemberFromCard: '<user-link user="vm.note.memberCreator"></user-link> left the card <card-link card="vm.note.data.card"></card-link> on <board-link board="vm.note.data.board"></board-link>',

			addedAttachmentToCard: '<user-link user="vm.note.memberCreator"></user-link> attached <attachment data="vm.note.data"></attachment> to <card-link card="vm.note.data.card"></card-link> on <board-link board="vm.note.data.board"></board-link>',

			addedToBoard: '<user-link user="vm.note.memberCreator"></user-link> added you to the board <board-link board="vm.note.data.board"></board-link>',

			removedFromBoard: '<user-link user="vm.note.memberCreator"></user-link> removed you from the board <board-link board="vm.note.data.board"></board-link>',

			invitedToBoard: '<user-link user="vm.note.memberCreator"></user-link> invited you to the board <board-link board="vm.note.data.board"></board-link>',

			addAdminToBoard: '<user-link user="vm.note.memberCreator"></user-link> made you a co-owner on the board <board-link board="vm.note.data.board"></board-link>',

			makeAdminOfBoard: '<user-link user="vm.note.memberCreator"></user-link> made you a co-owner on the board <board-link board="vm.note.data.board"></board-link>',

			closeBoard: '<user-link user="vm.note.memberCreator"></user-link> closed the board <board-link board="vm.note.data.board"></board-link>',

			removedFromOrganization: '<user-link user="vm.note.memberCreator"></user-link> removed you from the organization <org-link data="vm.note.data"></org-link>',

			invitedToOrganization: '<user-link user="vm.note.memberCreator"></user-link> invited you to the organization <org-link data="vm.note.data"></org-link>',

			addAdminToOrganization: '<user-link user="vm.note.memberCreator"></user-link> made you an admin on the organization <org-link data="vm.note.data"></org-link>',

			makeAdminOfOrganization: '<user-link user="vm.note.memberCreator"></user-link> made you an admin of the organization <org-link data="vm.note.data"></org-link>'
		};
		vm.fn = {
			toggleStatus: toggleStatus,
			parseMentions: parseMentions
		};


		//////////////////// FUNCTIONS ////////////////////

		//find a mention within a string of text and make it a link
		function parseMentions(text) {
			//expression that finds mentions
			var regex = new RegExp(/@\w+/gi);

			//convert any html into text for safety
			var wrapper = document.createElement('div');
			wrapper.innerText = text;
			text = wrapper.innerHTML;

			//if string contains a mention
			if(regex.test(text)){
				//Find each mention in the sentence
				text = text.replace(/@\w+/gi,function(match, index, string){
					return '<a external class="mention" href="https://trello.com/' + match.slice(1) + '">' + match + '</a>';
				});
			}

			//send back the html safe string
			return '<div class="d-inline-block">' + text + '</div>';
		}

		//marks a note as read or unread
		function toggleStatus(note){
			//toggle the current status of the note
			note.unread = !note.unread;

			//update Trello with the new status
			Trello
				.put(
					//send the note id
					'notifications/' + note.id,

					//update this field
					{ unread: note.unread },

					//on success
					function(){
						//update the badge
						bkg.update_badge();
					}
				);
		}
	}
}());
