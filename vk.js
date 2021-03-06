﻿(function($) {

window.KlassMutationObserver = function(buttonsManager) {
	this.__buttonsManager = buttonsManager;
	this.__MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
	
	this.__callback = function(mutations, observer) {
		this.__buttonsManager.handle();
	};
	
	this.__observer = new this.__MutationObserver(this.__callback.bind(this));
	
	KlassMutationObserver.prototype.start = function() {
		if (!($('#custom_menu_cont').length)) {
			setTimeout(this.start.bind(this), 0);
			return;
		}
		this.__observer.observe($('#custom_menu_cont')[0], {
					childList: true,
					subtree: true
					});
	};
	
};

window.KlassButton = function(menuSelectHandler) {

	this.__menuSelectHandler = menuSelectHandler;
	
	this.__preventEventsBubblingFunction = function(e) {
		e.stopPropagation();
	};
	
	this.__button = $('<a class="add_media_item stavklass-attachicon"	\
								><nobr>СТАВЬ КЛАСС)))</nobr></a>')
					.click(function() {this.__buttonClick()}.bind(this));
					
	this.__buttonClick = function() {
		console.log(this.__menuSelectHandler.getState());
		var stavklassobject = new StavKlassObject(this.__menuSelectHandler.getState().setPicFunction,
												  function() {
													$('#stavklassobject').remove();
													$('.autocomplete-suggestions').remove();
													document.body.onkeydown = undefined;
												  });
		stavklassobject.createNodes();
		$(document.body).append(stavklassobject.getRootNode());
		$('.stavklass-searchfield').focus();
		$('.autocomplete-suggestions').scrollLock();
		$('#stavklassobject, .autocomplete-suggestions').on('keydown keyup mousedown click',
								this.__preventEventsBubblingFunction);
		document.body.onkeydown = function(e) {
												e.preventDefault(); 
												e.stopPropagation(); 
												return false;
											};
	};
								
								
	KlassButton.prototype.getButton = function() {
		return this.__button;
	};
	
};

window.KlassButtonsManager = function(menuSelectHandler) {

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

window.AttachMenuObserver = function(menuSelectHandler) {
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
		$(el).find('div, a').each(function(num, elem) {
			if (this.__menuSelectHandler.getElementType(elem)) {
				$(elem).on("mouseout", function(e) {this.__menuSelectHandler.setState(e.currentTarget);}.bind(this));
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

window.MenuSelectHandler = function() {

	this.__state = {};

	this.__typeCheckers = {
		pagepost: function(el) {
			return $(el).attr('id') == 'page_add_media';
		},
		comment: function(el) {
			return $(el).attr('id') && $(el).attr('id').indexOf('reply_media_lnk') == 0;
		},
		im: function(el) {
			return $(el).attr('id') == 'im_add_media';
		},
		fastim: function(el) {
			return $(el).attr('class') == 'fc_tab_attach';
		},
		photo: function	(el) {
			return $(el).attr('id') == 'pv_add_media';
		},
		video: function(el) {
			return $(el).attr('id') == 'mv_add_media';
		},
		share: function(el) {
			return $(el).attr('id') == 'like_share_add_media';
		},
		edit: function(el) {
			return $(el).attr('id') == 'wpe_add_media';
		}
	};
	
	this.__stateSetters = {
		pagepost: function(el) {
			this.__state = {type: 'pagepost'};
			this.__state.setPicFunction = function(url) {
				var old = $('#post_field').val();
				$('#post_field').val(old+' '+url+' ');
				$('#post_field').focus();
				Wall.onPostValChange(url, 1);
			}.bind(this);
		}.bind(this),
		comment: function(el) {
			this.__state = {type: 'comment'};
			this.__state.setPicFunction = function(url) {
				var matches = /reply_media_lnk(.+)/.exec(el.id);
				var replyID = matches[1];
				var inputElement = $('#reply_field'+replyID);
				var old = inputElement.html();
				inputElement.html(old+' '+url+'&nbsp;');
				Wall.showEditReply(replyID);
				inputElement.focus();
				inputElement[0].dispatchEvent(new Event('keyup'));
			}.bind(this);
		}.bind(this),
		im: function(el) {
			this.__state = {type: 'im'};
			this.__state.setPicFunction = function(url) {
				var inputElement = $('.im_editable:visible');
				var old = inputElement.html();
				inputElement.html(old+' '+url+'&nbsp;');
				inputElement.focus();
				inputElement[0].dispatchEvent(new Event('keyup'));
			}
		}.bind(this),
		fastim: function(el) {
			this.__state = {type: 'fastim'};
			this.__state.element = el;
			this.__state.setPicFunction = function(url) {
				var curMedia;
				var filtered = $.each(cur.addMedia, function(i, el) {
					if (el._addMediaLink == this.__state.element) {
						curMedia = el;
						return false;
					}
				}.bind(this));
				curMedia.checkURL(url);
				window.onUploadDone = function(data) {
					curMedia.chooseMedia(data[0], data[1], data[2], '', true);
					curMedia.onCheckURLDone();
				};
			}.bind(this);
		}.bind(this),
		photo: function(el) {
			this.__state = {type: 'photo'};
			this.__state.setPicFunction = function(url) {
				var inputElement = $('#pv_comment');
				var old = inputElement.html();
				inputElement.html(old+' '+url+'&nbsp;');
				inputElement.focus();
				inputElement[0].dispatchEvent(new Event('keyup'));
			}
		}.bind(this),
		video: function(el) {
			this.__state = {type: 'photo'};
			this.__state.setPicFunction = function(url) {
				var inputElement = $('#mv_comment');
				var old = inputElement.html();
				inputElement.html(old+' '+url+'&nbsp;');
				inputElement.focus();
				inputElement[0].dispatchEvent(new Event('keyup'));
			};
		}.bind(this),
		share: function(el) {
			this.__state = {type: 'share'};
			this.__state.setPicFunction = function(url) {
				var inputElement = $('#like_share_text');
				var old = inputElement.val();
				inputElement.val(old+' '+url+' ');
				inputElement.focus();
				inputElement[0].dispatchEvent(new Event('keyup'));
			};
		}.bind(this),
		edit: function(el) {
			this.__state = {type: 'edit'};
			this.__state.setPicFunction = function(url) {
				var inputElement = $('#wpe_text');
				var old = inputElement.html();
				inputElement.html(old+' '+url+'&nbsp;');
				inputElement.focus();
				inputElement[0].dispatchEvent(new Event('keyup'));
			};
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


window.initAfterLoad = function() {
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
});

initAfterLoad();


})(jQuery);
