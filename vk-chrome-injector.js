function addScript(url) {
	var s = document.createElement('script');
	s.src = chrome.extension.getURL(url);
	(document.head||document.documentElement).appendChild(s);
}

function addScriptIfJquery(url) {
	if (typeof jQuery === undefined)
		setTimeout(function() {addScriptIfJquery(url)}, 100);
	else
		addScript(url);
}

function addStylesheet(url) {
	var s = document.createElement('link');
	s.rel = 'stylesheet';
	s.href = chrome.extension.getURL(url);
	(document.head||document.documentElement).appendChild(s);
}

addScript('jquery.js');
addScriptIfJquery('autocomplete.js');
addScriptIfJquery('scrollock.js');
addScriptIfJquery('stavklassobject.js');
addScriptIfJquery('vk.js');
addStylesheet('stavklass.css');