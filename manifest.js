{
  "name": "Notifier for Trello",
	"version": "1.0.3",
	"description": "View, filter, and save your Trello notifications as read or unread.",
	"background": {
		"page":"background.html"
	},
	"browser_action": {
		"default_icon": "img/icon19.png",
		"default_popup":"popup.html"
	},
	"options_page": "options.html",
	"permissions": [ "tabs", "https://*.trello.com/*", "storage" ],
	"icons":{ "16":"img/icon16.png","48":"img/icon48.png","128":"img/icon128.png" },
	"manifest_version": 2
}
