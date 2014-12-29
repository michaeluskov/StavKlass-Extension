var addCommentButtons = function() {
	jQuery(".add_media_menu").each(function(num, el) {
		var num = el.id.split('_')[3];
		if (!jQuery("#add_media_item_"+num+"_komment").length) {
			var button = jQuery('<a class="add_media_item"	\
								style="background-image: url(http://vk.com/images/icons/attach_icons.png?6);  \
								background-position: 3px 3px;"><nobr>СМЕШНОЙ КОММЕНТ)))</nobr></a>');
			jQuery(button).attr('id', "add_media_item_"+num+"_komment");
			jQuery(el).find('.add_media_items').append(button);
		}
	});
};

jQuery(window).load(function() {
	checkChangeIntervalID = setInterval(function() {
			addCommentButtons();
	}, 2000);
});