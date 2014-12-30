function addScript(url) {
	var s = document.createElement('script');
	s.src = chrome.extension.getURL(url);
	s.onload = function() {
		this.parentNode.removeChild(this);
	};
	(document.head||document.documentElement).appendChild(s);
}

addScript('jquery.js');
addScript('stavklass.js');