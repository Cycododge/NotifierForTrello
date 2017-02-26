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
			commentCard: '<user-link user="vm.note.memberCreator"></user-link> commented on the card <card-link data="vm.note.data"></card-link> on <board-link data="vm.note.data"></board-link>',

			memberJoinedTrello: '<user-link user="vm.note.memberCreator"></user-link> joined Trello on your recommendation. You earned a free month of Trello Gold',

			removedFromCard: '<user-link user="vm.note.memberCreator"></user-link> removed you from the card <card-link data="vm.note.data"></card-link> on <board-link data="vm.note.data"></board-link>',

			addedToCard: '<user-link user="vm.note.memberCreator"></user-link> added you to the card <card-link data="vm.note.data"></card-link> on <board-link data="vm.note.data"></board-link>',

			mentionedOnCard: '<user-link user="vm.note.memberCreator"></user-link> mentioned you on the card <card-link data="vm.note.data"></card-link> on <board-link data="vm.note.data"></board-link> [mention]',

			changeCard: '<user-link user="vm.note.memberCreator"></user-link> moved the card <card-link data="vm.note.data"></card-link> to [list_name] on <board-link data="vm.note.data"></board-link>',

			createdCard: '<user-link user="vm.note.memberCreator"></user-link> created <card-link data="vm.note.data"></card-link> in [list_name] on <board-link data="vm.note.data"></board-link>',

			updateCheckItemStateOnCard: '<user-link user="vm.note.memberCreator"></user-link> checked [checked] on <card-link data="vm.note.data"></card-link> on <board-link data="vm.note.data"></board-link>',

			addedMemberToCard: '<user-link user="vm.note.memberCreator"></user-link> joined the card <card-link data="vm.note.data"></card-link> on <board-link data="vm.note.data"></board-link>',

			removedMemberFromCard: '<user-link user="vm.note.memberCreator"></user-link> left the card <card-link data="vm.note.data"></card-link> on <board-link data="vm.note.data"></board-link>',

			addedAttachmentToCard: '<user-link user="vm.note.memberCreator"></user-link> attached [attached] to <card-link data="vm.note.data"></card-link> on <board-link data="vm.note.data"></board-link>',

			addedToBoard: '<user-link user="vm.note.memberCreator"></user-link> added you to the board <board-link data="vm.note.data"></board-link>',

			removedFromBoard: '<user-link user="vm.note.memberCreator"></user-link> removed you from the board <board-link data="vm.note.data"></board-link>',

			invitedToBoard: '<user-link user="vm.note.memberCreator"></user-link> invited you to the board <board-link data="vm.note.data"></board-link>',

			addAdminToBoard: '<user-link user="vm.note.memberCreator"></user-link> made you a co-owner on the board <board-link data="vm.note.data"></board-link>',

			makeAdminOfBoard: '<user-link user="vm.note.memberCreator"></user-link> made you a co-owner on the board <board-link data="vm.note.data"></board-link>',

			closeBoard: '<user-link user="vm.note.memberCreator"></user-link> closed the board <board-link data="vm.note.data"></board-link>',

			removedFromOrganization: '<user-link user="vm.note.memberCreator"></user-link> removed you from the organization [organization]',

			invitedToOrganization: '<user-link user="vm.note.memberCreator"></user-link> invited you to the organization [organization]',

			addAdminToOrganization: '<user-link user="vm.note.memberCreator"></user-link> made you an admin on the organization [organization]',

			makeAdminOfOrganization: '<user-link user="vm.note.memberCreator"></user-link> made you an admin of the organization [organization]'
		};
		vm.fn = {
		};

		//initialize the component when ready
		vm.$onInit = init;


		//////////////////// FUNCTIONS ////////////////////

		//initialization of component
		function init() {

			console.log(vm.note);

		}
	}
}());
