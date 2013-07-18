/* 7/17/2013 */
(function($){
	/* INITIALIZE */



	/* EVENTS */

	//open/close filters menu
	$('#filters').on('mouseenter',function(){
		$('#filters .text').show();
	}).on('mouseleave',function(){
		$('#filters .text').hide(500);
	}).on('click','.filter',function(){
		$('#filters .filter').removeClass('active');
		$(this).addClass('active');
	});

	//settings menu
	$('.btnUserMenu').on('mouseenter',function(){
		$('#userMenu').slideDown(100);
	}).on('mouseleave',function(){
		$('#userMenu').slideUp();
	});

	/* FUNCTIONS */
})($);