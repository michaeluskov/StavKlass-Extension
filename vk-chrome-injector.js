function addScript(url) {
	var s = document.createElement('script');
	s.src = chrome.extension.getURL(url);
	(document.head||document.documentElement).appendChild(s);
}

addScript('jquery.js');
addScript('stavklassobject.js');
addScript('vk.js');