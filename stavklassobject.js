var StavKlassObject = function(successFunction, errorFunction) {
	
	this.__successFunction = successFunction || function() {};
	this.__errorFunction = errorFunction || function() {};
	this.__rootNode = undefined;
	
	StavKlassObject.prototype.createNodes = function() {
		var opacityScreen = $('<div>')
								.addClass('stavklass-opacity');
		this.__rootNode = $('<div>')
							.addClass('stavklass-root')
							.append(opacityScreen)
							.click(function() {this.__errorFunction()}.bind(this)};
	};
	
	StavKlassObject.prototype.getRootNode = function() {
		return this.__rootNode;
	}

};