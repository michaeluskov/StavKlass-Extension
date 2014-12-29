var lastLocation = '';
var checkChangeIntervalID = '';

var addCommentButtons = function() {
	var postButton = jQuery("<a class='add_media_type_1_komment add_media_item' " +
									"style='background-image: url(http://vk.com/images/icons/attach_icons.png?6); " +
									"background-position: 3px -152px;'><nobr>КОММЕНТ)))</nobr></a>");
	jQuery(".add_media_more_node").append(postButton);
};

var checkIfLocationChanged = function() {
	var newLocation = document.location.pathname;
	var isChanged = (newLocation !== lastLocation);
	lastLocation = newLocation;
	return isChanged;
};

jQuery(window).load(function() {
	setInterval(function() {
		if (checkIfLocationChanged())
			addCommentButtons();
	}, 500);
});