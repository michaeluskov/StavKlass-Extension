var StavKlassObject = function(successFunction, rejectFunction) {
	
	this.__successFunction = successFunction || function() {};
	this.__rejectFunction = rejectFunction || function() {};
	this.__rootNode = undefined;
	
	StavKlassObject.prototype.createNodes = function() {
		var container = $('<div>')
								.addClass('stavklass-container')
								.click(function(e) {
									e.stopPropagation();
									});
		var searchField = $('<input type="text">')
							.attr('id', 'stavklass-searchfield')
							.addClass('stavklass-searchfield')
							.attr('placeholder', 'ВВЕДИ ТЕКСТ))))))')
							.autocomplete({
								serviceUrl: 'http://stavklass.ru/images/autocomplete.json',
								paramName: 'term',
								transformResult: function(r) {
									return {suggestions: JSON.parse(r)};
								}
							});
		var searchButton = $('<button>')
							.attr('id', 'stavklass-searchbutton')
							.addClass('stavklass-button stavklass-searchbutton')
							.html('НАЙТИ)))');
		var dateButton = $('<button>')
							.attr('id', 'stavklass-datebutton')
							.addClass('stavklass-button')
							.html('Самые новые');
		var ratingButton = $('<button>')
							.attr('id', 'stavklass-ratingbutton')
							.addClass('stavklass-button')
							.html('Самые рейтинговые');
		var imagesContainer = $('<div>')
								.attr('id', 'stavklass-imagescontainer')
								.addClass('stavklass-imagescontainer');
		container.append(searchField, searchButton, $('<p />'), dateButton, ratingButton, imagesContainer);
		var opacityScreen = $('<div>')
								.addClass('stavklass-opacity')
								.append(container);
		this.__rootNode = $('<div>')
							.attr('id', 'stavklassobject')
							.addClass('stavklass-root')
							.append(opacityScreen)
							.click(function() {this.__rejectFunction()}.bind(this));
	};
	
	StavKlassObject.prototype.getRootNode = function() {
		return this.__rootNode;
	};

};