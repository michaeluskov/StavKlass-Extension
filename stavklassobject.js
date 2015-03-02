var StavKlassObject = function(successFunction, errorFunction) {
	
	this.__successFunction = successFunction || function() {};
	this.__errorFunction = errorFunction || function() {};
	this.__rootNode = undefined;
	
	StavKlassObject.prototype.createNodes = function() {
		this.__rootNode = $('<div>');
	};
	
	StavKlassObject.prototype.getRootNode = function() {
		return this.__rootNode;
	}

};