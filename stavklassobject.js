(function($) {

window.StavKlassObject = function(successFunction, closeFunction) {
	
	this.__successFunction = successFunction || function() {};
	this.__closeFunction = closeFunction || function() {};
	this.__rootNode = undefined;
	
	this.__images = [];
	this.__isLoading = false;
	
	StavKlassObject.prototype.createNodes = function() {
		var container = $('<div>')
								.addClass('stavklass-container')
								.click(function(e) {
									e.stopPropagation();
								});
		var relativeContainer = $('<div>')
								.addClass('stavklass-relativecontainer')
								.scrollLock();
		container.append(relativeContainer);
		var searchField = $('<input type="text">')
							.attr('id', 'stavklass-searchfield')
							.addClass('stavklass-searchfield')
							.attr('placeholder', 'ВВЕДИ ТЕКСТ))))))')
							.autocomplete({
								appendTo: relativeContainer,
								forceFixPosition: true,
								triggerSelectOnValidInput: false,
								serviceUrl: 'https://stavklass.ru/images/autocomplete.json',
								paramName: 'term',
								transformResult: function(r) {
									return {suggestions: JSON.parse(r)};
								},
								onSelect: function(e) {
									this.__setSearchedImages($(this.__rootNode).find('#stavklass-searchfield').val());
								}.bind(this)
							})
							.on('keydown', function(e) {
								if (e.which == 13) {
									e.preventDefault();
									this.__setSearchedImages($(this.__rootNode).find('#stavklass-searchfield').val());
								}
							}.bind(this));
		var searchButton = $('<button>')
							.attr('id', 'stavklass-searchbutton')
							.addClass('stavklass-button stavklass-searchbutton')
							.html('НАЙТИ)))').
							click(function() {
								this.__setSearchedImages($(this.__rootNode).find('#stavklass-searchfield').val());
							}.bind(this));
		var dateButton = $('<button>')
							.attr('id', 'stavklass-datebutton')
							.addClass('stavklass-button')
							.html('Самые новые')
							.click(this.__setLatestImages.bind(this));
		var ratingButton = $('<button>')
							.attr('id', 'stavklass-ratingbutton')
							.addClass('stavklass-button')
							.html('Самые рейтинговые')
							.click(this.__setHighestRankedImages.bind(this));
		var randomButton = $('<button>')
							.attr('id', 'stavklass-randombutton')
							.addClass('stavklass-button')
							.html('Случайные')
							.click(this.__setRandomImages.bind(this));
		var imagesContainer = $('<div>')
								.attr('id', 'stavklass-imagescontainer')
								.addClass('stavklass-imagescontainer')
								.scrollLock()
								.on('mousewheel', function(e) {e.stopPropagation()});
		var bottomRow = $('<div>')
						.addClass('stavklass-bottomrow')
						.html('<a href="https://github.com/michaeluskov/StavKlass-Extension#%D0%90-%D0%B3%D0%B4%D0%B5-%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD" target="_blank">ГДЕ ДИЗАЙН???!!</a> | \
						<a href="http://stavklass.ru" target="_blank">stavklass.ru</a> | \
						Вдохновлен <a href="http://vk.com/ok_filial" target="_blank">филиалом Одноклассников</a> | \
						<a href="https://github.com/michaeluskov/StavKlass-Extension" target="_blank">Исходный код и прием сообщений о багах</a> | \
						<a href="https://vk.com/michaeluskov" target="_blank">VK.com (тоже прием сообщений о багах)</a>\
						');
		relativeContainer.append(searchField, searchButton, $('<p />'), dateButton, ratingButton, randomButton, imagesContainer, bottomRow);
		var opacityScreen = $('<div>')
								.addClass('stavklass-opacity')
								.append(container)
								.scrollLock();
		this.__rootNode = $('<div>')
							.attr('id', 'stavklassobject')
							.addClass('stavklass-root')
							.append(opacityScreen)
							.click(function() {this.__closeFunction()}.bind(this));
	};
	
	StavKlassObject.prototype.getRootNode = function() {
		return this.__rootNode;
	};
	
	
	StavKlassObject.prototype.__enableLoading = function() {
		if (this.__isLoading)
			return;
		this.__isLoading = !this.__isLoading;
		var opacity = $('<div>').addClass('stavklass-loadingopacity');
		var progress = $('<div>').addClass('stavklass-loadingprogress');
		$(this.__rootNode).find('.stavklass-relativecontainer').append(opacity, progress);
		$(this.__rootNode).find('.stavklass-searchfield').autocomplete().hide();
	};
	
	StavKlassObject.prototype.__disableLoading = function() {
		if (!this.__isLoading)
			return;
		this.__isLoading = !this.__isLoading;
		$(this.__rootNode).find('.stavklass-loadingopacity, .stavklass-loadingprogress').remove();
	};
	
	StavKlassObject.prototype.__setSearchedImages = function(query) {
		this.__enableLoading();
		$.getJSON('https://stavklass.ru/images/search.json',
				 {'image[text]': query},
				 function(data) {
					this.__images = data;
					this.__updateImages();
					this.__disableLoading();
				 }.bind(this)
				 );
	}
	
	StavKlassObject.prototype.__setLatestImages = function() {
		this.__enableLoading();
		$.getJSON('https://stavklass.ru/images.json',
				 {order: 'date'},
				 function(data) {
					this.__images = data;
					this.__updateImages();
					this.__disableLoading();
				 }.bind(this)
				 );
	};
	
	StavKlassObject.prototype.__setHighestRankedImages = function() {
		this.__enableLoading();
		$.getJSON('https://stavklass.ru/images.json',
				 {order: 'rating'},
				 function(data) {
					this.__images = data;
					this.__updateImages();
					this.__disableLoading();
				 }.bind(this)
				 );
	};
	
	StavKlassObject.prototype.__setRandomImages = function() {
		this.__enableLoading();
		var pageNum = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
		$.getJSON('https://stavklass.ru/images.json',
				 {order: 'rating',
				 page: pageNum},
				 function(data) {
					if (data.length == 0)
						this.__setRandomImages();
					this.__images = data;
					this.__updateImages();
					this.__disableLoading();
				 }.bind(this)
				 );
	};
	
	StavKlassObject.prototype.__updateImages = function() {
		var container = $(this.__rootNode).find('#stavklass-imagescontainer');
		container.html('');
		$.map(this.__images, function(el, num) {
			var imageDiv = $('<div>')
							.addClass('stavklass-imagerow');
			var image = $('<img>')
						.addClass('stavklass-image')
						.attr('src',el.link)
						.click(function() {
							this.__closeFunction();
							this.__successFunction(el.link);
						}.bind(this));
			var rating = $('<span>')
							.addClass('stavklass-rating')
							.html('Рейтинг: ' + el.rating);
			imageDiv.append(image, rating);
			container.append(imageDiv);
		}.bind(this));
	};

};

})(jQuery);