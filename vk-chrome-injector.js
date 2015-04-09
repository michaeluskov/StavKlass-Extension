function addScript(url) {
	var s = document.createElement('script');
	s.src = chrome.extension.getURL(url);
	(document.body||document.documentElement).appendChild(s);
}

function addStylesheet(url) {
	var s = document.createElement('link');
	s.rel = 'stylesheet';
	s.href = chrome.extension.getURL(url);
	(document.head||document.documentElement).appendChild(s);
}

addScript('jquery.js');
addScript('autocomplete.js');
addScript('scrollock.js');
addScript('stavklassobject.js');
addScript('vk.js');
addStylesheet('stavklass.css');