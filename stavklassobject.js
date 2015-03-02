var StavKlassObject = function(successFunction, rejectFunction) {
	
	this.__successFunction = successFunction || function() {};
	this.__rejectFunction = rejectFunction || function() {};
	this.__rootNode = undefined;
	
	StavKlassObject.prototype.createNodes = function() {
		var opacityScreen = $('<div>')
								.addClass('stavklass-opacity');
		this.__rootNode = $('<div>')
							.attr('id', 'stavklassobject')
							.addClass('stavklass-root')
							.append(opacityScreen)
							.click(function() {this.__rejectFunction()}.bind(this));
	};
	
	StavKlassObject.prototype.getRootNode = function() {
		return this.__rootNode;
	}

};