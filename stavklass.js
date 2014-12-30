﻿var old$ = $;
var $  = jQuery;

var KlassMutationObserver = function(buttonsManager) {
	this.__buttonsManager = buttonsManager;
	this.__MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	
	this.__callback = function(mutations, observer) {
		this.__buttonsManager.handle();
	};
	
	this.__observer = new this.__MutationObserver(this.__callback.bind(this));
	
	KlassMutationObserver.prototype.start = function() {
		if (!($('#custom_menu_cont').length)) {
			setTimeout(this.start.bind(this), 300);
			return;
		}
		this.__observer.observe($('#custom_menu_cont')[0], {
					childList: true,
					subtree: true
					});
	};
	
};

var KlassButton = function(menuSelectHandler) {

	this.__menuSelectHandler = menuSelectHandler;
	
	this.__button = $('<a class="add_media_item"	\
								style="background-image: url(http://vk.com/images/icons/attach_icons.png?6);  \
								background-position: 3px 3px;"><nobr>СТАВЬ КЛАСС)))</nobr></a>')
					.click(function() {this.__buttonClick()}.bind(this));
					
	this.__buttonClick = function() {
		console.log(this.__menuSelectHandler.getState());
		this.__menuSelectHandler.getState().setPicFunction('http://cs14102.vk.me/c624023/v624023334/9c31/YJJvMSNZREU.jpg');
	};
								
								
	KlassButton.prototype.getButton = function() {
		return this.__button;
	};
	
};

var KlassButtonsManager = function(menuSelectHandler) {

	this.__menuSelectHandler = menuSelectHandler;	
	this.__klassButtons = {};
	
	this.__menuHasMore = function(menu) {
		return $(menu).find('.add_media_more_node').length;
	};
	
	KlassButtonsManager.prototype.handle = function() {
		$('.add_media_menu').each(function (num, el) {
			num = el.id.split('_')[3];
			if (!(num in this.__klassButtons)) {
				this.__klassButtons[num] = new KlassButton(this.__menuSelectHandler);
				if (!this.__menuHasMore(el))
					$(el).find('.add_media_items').append(this.__klassButtons[num].getButton());
				else
					$(el).find('.add_media_more_node').append(this.__klassButtons[num].getButton());
			}
		}.bind(this));
	
	};

};

var AttachMenuObserver = function(menuSelectHandler) {
	this.__menuSelectHandler = menuSelectHandler;
	this.__MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	
	this.__callback = function(mutations, observer) {
		for (var i=0; i<mutations.length; i++) {
			for (var j=0; j<mutations[i].addedNodes.length; j++) {
				var el = mutations[i].addedNodes[j];
				this.setEventHandlers(el);
			}
		}
	}
	
	AttachMenuObserver.prototype.setEventHandlers = function(el) {
		$(el).find('div').each(function(num, elem) {
			if (this.__menuSelectHandler.getElementType(elem)) {
				$(elem).on("mouseover", function(e) {this.__menuSelectHandler.setState(e.target);}.bind(this));
			}
		}.bind(this));
	}.bind(this);
	
	this.__observer = new this.__MutationObserver(this.__callback.bind(this));
	
	AttachMenuObserver.prototype.start = function() {
		this.__observer.observe(document, {
					childList: true,
					subtree: true
					});
	};
	
};

var MenuSelectHandler = function() {

	this.__state = {};

	this.__typeCheckers = {
		pagepost: function(el) {return $(el).attr('id') == 'page_add_media'},
		comment: function(el) {return $(el).hasClass('reply_media_lnk')}
	};
	
	this.__stateSetters = {
		pagepost: function(el) {
			this.__state = {type: 'pagepost'};
			this.__state.setPicFunction = function(url) {
				var old = $('#post_field').val();
				$('#post_field').val(old+' '+url+' ');
				Wall.onPostValChange();
			}.bind(this);
		}.bind(this),
		comment: function(el) {
			this.__state = {type: 'comment'};
		}.bind(this)
	};

	MenuSelectHandler.prototype.getElementType = function(el) {
		for (var i in this.__typeCheckers) {
			if (this.__typeCheckers[i](el))
				return i;
		}
		return false;
	}.bind(this);
	
	MenuSelectHandler.prototype.setState = function(el) {
		var type = this.getElementType(el);
		if (!type) return;
		this.__stateSetters[type](el);
	}.bind(this);
	
	MenuSelectHandler.prototype.getState = function() {
		return this.__state;
	};

};


var init = function() {
	var menuSelectHandler = new MenuSelectHandler();
	var buttonsManager = new KlassButtonsManager(menuSelectHandler);
	var buttonsObserver = new KlassMutationObserver(buttonsManager);
	buttonsManager.handle();
	buttonsObserver.start();
	var attachObserver = new AttachMenuObserver(menuSelectHandler);
	attachObserver.setEventHandlers(document);
	attachObserver.start();
};

jQuery(window).load(function() {
	init();
});

var $ = old$;