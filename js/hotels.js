(function () {
/**
   * @param {Object} data
   * @constructor
   */
  function Hotel( data ) {
    this._data = data;
  }

  Hotel.prototype.render = function () {
    var template = document.querySelector( '#hotel-template' );
    var IMAGE_TIMEOUT = 10000;

    if ( 'content' in template ) {
      this.element = template.content.children[ 0 ].cloneNode( true );
    } else {
      this.element = template.children[ 0 ].cloneNode( true );
    }

    var rating = this.element.querySelector( '.hotel__rating' );
    this.element.querySelector( '.hotel__name' ).textContent = this._data.name;
    this.element.querySelector( '.hotel__price-value' ).textContent = this._data.price;

    if ( this._data.rating ) {
      rating.textContent = this._data.rating;
    } else {
      rating.style.display = 'none';
    }

    // prepare image
    var backgroundImage = new Image(); // create image

    var imageLoadTimeout = setTimeout( function () { // fallback if image is cannot load
      backgroundImage.src = '';
      this.element.classList.add( 'hotel--nophoto' ); // give element class with default background-image
    }, IMAGE_TIMEOUT );

    // load and error handlers we set before changing .src attribute
 
    backgroundImage.onload = function () {
      clearTimeout( imageLoadTimeout );
      this.element.style.backgroundImage = 'url(\'' + backgroundImage.src + '\')';
    };
    backgroundImage.onerror = function () {
      this.element.classList.add( 'hotel--nophoto' );
    };

    // start all this
    backgroundImage.src = this._data.preview ? this._data.preview : '';
  };

  window.Hotel = Hotel;
}());