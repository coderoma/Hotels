(function(){
  
  /**
   * @constructor
   */
  var Gallery = function() {
    this.element = document.querySelector('.gallery-overlay');
    this._closeButton = this.element.querySelector('.gallery-overlay__close');
    this._nextButton = this.element.querySelector('.gallery-overlay-control-right');
    this._onCloseClick = this._onCloseClick.bind(this);
  };

  
  Gallery.prototype.show = function () {
    this.element.classList.remove('hidden');

    var thumbnailsContainer = this.element.querySelector('.gallery-overlay__thumbnails');

    this.data.pictures.forEach(function(pic, i) {
      var picture = new Image(); 
      picture.height = 40;
      picture.src = pic;
      thumbnailsContainer.appendChild(picture); 
    }, this);

    this.setCurrentImage(0);


    this._nextButton.addEventListener('click', this._onNextClick(i));

    this._closeButton.addEventListener('click', this._onCloseClick);
  
  };

  Gallery.prototype.hide = function() {
    this.element.classList.add('hidden');
    this._closeButton.removeEventListener('click', this._onCloseClick);
  };

  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };

  Gallery.prototype._onNextClick = function (i) {
    this.setCurrentImage(i)
  }

  Gallery.prototype.setCurrentImage = function (i) {
    if (this._currentImage === i) {
      return;
    }

    this._currentImage = i;

    if (this.element.querySelector('img.selected')) {
      this.element.querySelector('img.selected').classList.remove('selected');
    }
    this.element.querySelectorAll('.gallery-overlay__thumbnails img')[i].classList.add('selected');

    var image = new Image();
    image.src = this.data.pictures[i];

    var previewContainer = this.element.querySelector('.gallery-overlay__preview');

    while(previewContainer.firstChild) {
      console.log(previewContainer.firstChild)
      previewContainer.removeChild(previewContainer.firstChild);
    }

    previewContainer.appendChild(image);
  };

  window.Gallery = Gallery;
})();