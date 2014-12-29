var $  = jQuery;

var KlassMutationObserver = function(buttonsManager) {
	this.__buttonsManager = buttonsManager;
	this.__MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	
	this.__callback = function(mutations, observer) {
		this.__buttonsManager.handle();
	};
	
	this.__observer = new this.__MutationObserver(this.__callback.bind(this));
	
	KlassMutationObserver.prototype.start = function() {
		this.__observer.observe($('#custom_menu_cont')[0], {
					childList: true,
					subtree: true
					});
	};
	
};

var KlassButton = function() {
	
	this.__button = $('<a class="add_media_item"	\
								style="background-image: url(http://vk.com/images/icons/attach_icons.png?6);  \
								background-position: 3px 3px;"><nobr>СТАВЬ КЛАСС)))</nobr></a>');
								
								
	KlassButton.prototype.getButton = function() {
		return this.__button;
	};
	
};

var KlassButtonsManager = function() {
	
	this.__klassButtons = {};
	
	KlassButtonsManager.prototype.handle = function() {
		$('.add_media_menu').each(function (num, el) {
			num = el.id.split('_')[3];
			if (!(num in this.__klassButtons)) {
				this.__klassButtons[num] = new KlassButton(this);
				$(el).find('.add_media_items').append(this.__klassButtons[num].getButton());
			}
		}.bind(this));
	
	};

};


var init = function() {
	var buttonsManager = new KlassButtonsManager();
	var observer = new KlassMutationObserver(buttonsManager);
	observer.start();
};

jQuery(window).load(function() {
	init();
});