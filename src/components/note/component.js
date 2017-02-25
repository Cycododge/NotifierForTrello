(function() {
	'use strict'; /* jshint -W040 */

	angular.module('app')
		.component('note',{
			templateUrl: 'components/note/template.html',
			controllerAs: 'vm',
			controller: ['$sce', controller],
			bindings: {
				note: '<'
			}
		});

	//runs the component
	function controller($sce) {
		//config
		var vm = this;
		vm.noteTypes = {
			commentCard: '<user-link user="vm.note.memberCreator"></user-link> commented on the card [card_name] on [board_name]',

			memberJoinedTrello: '<user-link user="vm.note.memberCreator"></user-link> joined Trello on your recommendation. You earned a free month of Trello Gold',

			removedFromCard: '<user-link user="vm.note.memberCreator"></user-link> removed you from the card [card_name] on [board_name]',

			addedToCard: '<user-link user="vm.note.memberCreator"></user-link> added you to the card [card_name] on [board_name]',

			mentionedOnCard: '<user-link user="vm.note.memberCreator"></user-link> mentioned you on the card [card_name] on [board_name] [mention]',

			changeCard: '<user-link user="vm.note.memberCreator"></user-link> moved the card [card_name] to list_name on [board_name]',

			createdCard: '<user-link user="vm.note.memberCreator"></user-link> created [card_name] in list_name on [board_name]',

			updateCheckItemStateOnCard: '<user-link user="vm.note.memberCreator"></user-link> checked [checked] on [card_name] on [board_name]',

			addedMemberToCard: '<user-link user="vm.note.memberCreator"></user-link> joined the card [card_name] on [board_name]',

			removedMemberFromCard: '<user-link user="vm.note.memberCreator"></user-link> left the card [card_name] on [board_name]',

			addedAttachmentToCard: '<user-link user="vm.note.memberCreator"></user-link> attached [attached] to [card_name] on [board_name]',

			addedToBoard: '<user-link user="vm.note.memberCreator"></user-link> added you to the board [board_name]',

			removedFromBoard: '<user-link user="vm.note.memberCreator"></user-link> removed you from the board [board_name]',

			invitedToBoard: '<user-link user="vm.note.memberCreator"></user-link> invited you to the board [board_name]',

			addAdminToBoard: '<user-link user="vm.note.memberCreator"></user-link> made you a co-owner on the board [board_name]',

			makeAdminOfBoard: '<user-link user="vm.note.memberCreator"></user-link> made you a co-owner on the board [board_name]',

			closeBoard: '<user-link user="vm.note.memberCreator"></user-link> closed the board [board_name]',

			removedFromOrganization: '<user-link user="vm.note.memberCreator"></user-link> removed you from the organization [organization]',

			invitedToOrganization: '<user-link user="vm.note.memberCreator"></user-link> invited you to the organization [organization]',

			addAdminToOrganization: '<user-link user="vm.note.memberCreator"></user-link> made you an admin on the organization [organization]',

			makeAdminOfOrganization: '<user-link user="vm.note.memberCreator"></user-link> made you an admin of the organization [organization]'
		};
		vm.fn = {
			getActionText: getActionText
		};

		//initialize the component when ready
		vm.$onInit = init;


		//////////////////// FUNCTIONS ////////////////////

		//initialization of component
		function init() {

			console.log(vm.note);

		}

		//
		function getActionText(type) {
			return $sce.trustAsHtml(vm.noteTypes[type]);
		}
	}
}());
