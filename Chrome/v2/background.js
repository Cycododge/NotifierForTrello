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

// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });