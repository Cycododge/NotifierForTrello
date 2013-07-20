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
*/

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

	//user menu
	$('.btnUserMenu').on('mouseenter',function(){
		$('#userMenu').slideDown(100);
	}).on('mouseleave',function(){
		$('#userMenu').slideUp();
	});

	//open settings menu
	$('#userMenu .btnSettings').on('click',function(){
		$('#settings').show(500);
	});

	//close settings menu
	$('#settings .header').on('click',function(){
		$('#settings').hide(500);
	});

	/* FUNCTIONS */
})($);