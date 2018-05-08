(function () {
/**
   * @param {Object} data
   * @constructor
   */
  function Hotel( data ) {
    this._data = data;
    this._onClick = this._onClick.bind(this);
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
    var backgroundImage = new Image();
    var imageLoadTimeout = setTimeout( function () { // fallback if image is cannot load
      backgroundImage.src = '';
      this.element.classList.add( 'hotel--nophoto' );
    }.bind(this), IMAGE_TIMEOUT );

    // load and error handlers we set before changing .src attribute
    backgroundImage.onload = function () {
      clearTimeout( imageLoadTimeout );
      this.element.style.backgroundImage = 'url(\'' + backgroundImage.src + '\')';
    }.bind(this);
    
    backgroundImage.onerror = function () {
      this.element.classList.add( 'hotel--nophoto' );
    }.bind(this);

    backgroundImage.src = this._data.preview ? this._data.preview : '';

    this.element.addEventListener('click', this._onClick);
  };


  Hotel.prototype.remove = function () {
    this.element.removeEventListener('click', this._onClick);
  };
  

  /**
   * @param  {Event} evt
   * @private
   */
  Hotel.prototype._onClick = function ( evt ) {
    if ( evt.target.classList.contains( 'hotel' ) &&
      !this.element.classList.contains( 'hotel--nophoto' ) ) {
      if ( typeof this.onClick === 'function' ) {
        this.onClick();
      }
    }
  };

  window.Hotel = Hotel;
}());