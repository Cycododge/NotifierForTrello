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
		var vm = this;
		vm.noteTypes = {
			commentCard: '<user-link user="vm.note.memberCreator"></user-link> commented on the card <card-link card="vm.note.data.card"></card-link> on <board-link board="vm.note.data.board"></board-link>',

			memberJoinedTrello: '<user-link user="vm.note.memberCreator"></user-link> joined Trello on your recommendation. You earned a free month of Trello Gold',

			removedFromCard: '<user-link user="vm.note.memberCreator"></user-link> removed you from the card <card-link card="vm.note.data.card"></card-link> on <board-link board="vm.note.data.board"></board-link>',

			addedToCard: '<user-link user="vm.note.memberCreator"></user-link> added you to the card <card-link card="vm.note.data.card"></card-link> on <board-link board="vm.note.data.board"></board-link>',

			mentionedOnCard: '<user-link user="vm.note.memberCreator"></user-link> mentioned you on the card <card-link card="vm.note.data.card"></card-link> on <board-link board="vm.note.data.board"></board-link> [mention]',

			changeCard: '<user-link user="vm.note.memberCreator"></user-link> moved the card <card-link card="vm.note.data.card"></card-link> to <list-name data="vm.note.data"></list-name> on <board-link board="vm.note.data.board"></board-link>',

			createdCard: '<user-link user="vm.note.memberCreator"></user-link> created <card-link card="vm.note.data.card"></card-link> in <list-name data="vm.note.data"></list-name> on <board-link board="vm.note.data.board"></board-link>',

			updateCheckItemStateOnCard: '<user-link user="vm.note.memberCreator"></user-link> checked [checked] on <card-link card="vm.note.data.card"></card-link> on <board-link board="vm.note.data.board"></board-link>',

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
			toggleStatus: toggleStatus
		};


		//////////////////// FUNCTIONS ////////////////////

		//marks a note as read or unread
		function toggleStatus(note){
			//toggle the current status of the note
			note.unread = !note.unread;

			//update Trello with the new status
			Trello
				.put(
					'notifications/' + note.id,
					{ unread: note.unread }
				);
		}
	}
}());
