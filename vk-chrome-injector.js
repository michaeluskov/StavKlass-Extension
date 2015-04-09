function addScript(url) {
	var s = document.createElement('script');
	s.src = chrome.extension.getURL(url);
	(document.body||document.documentElement).appendChild(s);
}

function startWaitingForjQuery() {
	var s = document.createElement('script');
	s.id = 'jQuerycheckah';
	s.innerHTML = "function checkJq() {\
						if (typeof jQuery !== 'undefined') {\
							jQuery(document.body).append(jQuery('<div id=\"jQueryhere\">'));\
							jQuery('#jQuerycheckah').remove();\
						} else {\
							setTimeout(checkJq, 0);\
						}\
					}\
					\
					checkJq();";
	document.head.appendChild(s);
	hasJq = 0;
}

function isjQueryLoaded() {
	if (hasJq == 1)
		return hasJq;
	var here = document.getElementById('jQueryhere');
	if (here !== null) {
		here.parentNode.removeChild(here);
		hasJq = 1;
	} else {
		hasJq = 0;
	}
	return hasJq;
}

function addScriptIfjQuery(url) {
	if (isjQueryLoaded()) {
		addScript(url);
	} else {
		setTimeout(function() {addScriptIfjQuery(url)}, 0);
	}
}

function addStylesheet(url) {
	var s = document.createElement('link');
	s.rel = 'stylesheet';
	s.href = chrome.extension.getURL(url);
	(document.head||document.documentElement).appendChild(s);
}


addScript('jquery.js');
startWaitingForjQuery();
addScriptIfjQuery('autocomplete.js');
addScriptIfjQuery('scrollock.js');
addScriptIfjQuery('stavklassobject.js');
addScriptIfjQuery('vk.js');
addStylesheet('stavklass.css');