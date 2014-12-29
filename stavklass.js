var $  = jQuery;

var KlassMutationObserver = function() {
	this.__MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	
	this.__callback = function(mutations, observer) {
		console.log(mutations, observer);
	};
	
	this.__observer = new this.__MutationObserver(this.__callback);
	
	KlassMutationObserver.prototype.start = function() {
		this.__observer.observe($('#custom_menu_cont')[0], {
					childList: true,
					subtree: true
					});
	};
	
};


var init = function() {
	var observer = new KlassMutationObserver();
	observer.start();
};

jQuery(window).load(function() {
	init();
});