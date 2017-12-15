var container = document.querySelector( '.hotels-list' );

hotels.forEach( function( hotel ) {
	var element = getElementFromTemplate( hotel );
	container.appendChild( element );
} );


/**
 * @param {Object} data
 * @return {Element}
 */
function getElementFromTemplate( data ) {
  var template = document.querySelector( '#hotel-template' );
  var IMAGE_TIMEOUT = 10000;

	if ( 'content' in template ) {
		var element = template.content.children[ 0 ].cloneNode( true );
	} else {
    var element = template.children[0].cloneNode( true );
  }
  
  var rating = element.querySelector( '.hotel__rating' );
  element.querySelector( '.hotel__name' ).textContent = data.name;
  element.querySelector( '.hotel__price-value' ).textContent = data.price;

  data.rating ? rating.textContent = data.rating : rating.style.display = "none";  
  
  // prepare image
  var backgroundImage = new Image(); //create image

  var imageLoadTimeout = setTimeout(function(){ //fallback if image is cannot load
    backgroundImage.src = '';
    element.classList.add('hotel--nophoto'); // give element class with default background-image
  }, IMAGE_TIMEOUT);

// load and erorr handlers we set before changing .src attribute

  backgroundImage.onload = function(){ 
    clearTimeout(imageLoadTimeout);
    element.style.backgroundImage = 'url(\'' + backgroundImage.src + '\')';
  }
  backgroundImage.onerror = function(){
    element.classList.add('hotel--nophoto');
  }

// start all this
  backgroundImage.src = data.preview ? data.preview : '';

	return element;
}