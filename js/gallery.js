( function () {

  /**
   * @constructor
   * @extends {HotelBase}
   */
  var Gallery = function () {
    this.element = document.querySelector( '.gallery-overlay' );

    this._closeButton = this.element.querySelector( '.gallery-overlay__close' );
    this._nextButton = this.element.querySelector( '.gallery-overlay-control-right' );
    this._prevButton = this.element.querySelector( '.gallery-overlay-control-left' );

    this._onNextClick = this._onNextClick.bind( this );
    this._onPrevClick = this._onPrevClick.bind( this );
    this._onCloseClick = this._onCloseClick.bind( this );
  };

  Gallery.prototype = new HotelBase();

  //gallery methods
  Gallery.prototype.render = function () {
    this.element.classList.remove( 'hidden' );

    var thumbnailsContainer = this.element.querySelector( '.gallery-overlay__thumbnails' );

    while ( thumbnailsContainer.firstChild ) {
      thumbnailsContainer.removeChild( thumbnailsContainer.firstChild );
    }

    this.getData().pictures.forEach( function ( pic, i ) {
      var picture = new Image();
      picture.height = 40;
      picture.src = pic;
      thumbnailsContainer.appendChild( picture );
    }, this );

    this.setCurrentImage( 0 );
    this._nextButton.addEventListener( 'click', this._onNextClick );
    this._prevButton.addEventListener( 'click', this._onPrevClick );
    this._closeButton.addEventListener( 'click', this._onCloseClick );

  };

  Gallery.prototype.remove = function () {
    this.element.classList.add( 'hidden' );
    this._closeButton.removeEventListener( 'click', this._onCloseClick );
    this._NextButton.removeEventListener( 'click', this._onNextClick );
    this._PrevButton.removeEventListener( 'click', this._onPrevClick );
  };

  Gallery.prototype._onCloseClick = function () {
    this.remove();
  };

  Gallery.prototype._onNextClick = function () {
    var count = this._currentImage;
    count++;
    this.setCurrentImage( count );
  };

  Gallery.prototype._onPrevClick = function () {
    var count = this._currentImage;
    count--;
    this.setCurrentImage( count );
  };


  // show preview image
  Gallery.prototype.setCurrentImage = function ( i ) {

    if ( this.getData().pictures[ i ] ) {
      this._currentImage = i;

      if ( this.element.querySelector( 'img.selected' ) ) {
        this.element.querySelector( 'img.selected' ).classList.remove( 'selected' );
      }
      this.element.querySelectorAll( '.gallery-overlay__thumbnails img' )[ i ].classList.add( 'selected' );

      var image = new Image();
      image.src = this.getData().pictures[ i ];

      var previewContainer = this.element.querySelector( '.gallery-overlay__preview' );

      while ( previewContainer.firstChild ) {
        previewContainer.removeChild( previewContainer.firstChild );
      }

      previewContainer.appendChild( image );
    }
  };

  window.Gallery = Gallery;
} )();