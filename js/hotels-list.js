'use strict';

var container = document.querySelector( '.hotels-list' );
var activeFilter = 'filter-all';
var hotels = [];

var filters = document.querySelectorAll( '.filters__button' );
for ( var i = 0; i < filters.length; i++ ) {
  filters[ i ].onclick = function( evt ) {
    var clickedElementID = evt.target.id;
    setActiveFilter( clickedElementID );
  };
}

getHotels();


/**
 * @param {Array.<Object>} hotels
 */
function renderHotels( hotels ) {
  container.innerHTML = '';
  var fragment = document.createDocumentFragment();

  hotels.forEach( function( hotel ) {
    var element = getElementFromTemplate( hotel );

    fragment.appendChild( element );
  } );

  container.appendChild( fragment );
}

/**
 *
 * @param {string} id
 */
function setActiveFilter( id ) {
  if ( activeFilter === id ) {
    return;
  }

  document.querySelector( '#' + activeFilter ).classList.remove( 'filters--selected' );
  document.querySelector( '#' + id ).classList.add( 'filters--selected' );
  activeFilter = id;

  var filteredHotels = hotels.slice( 0 );
  switch ( activeFilter ) {
    case 'filter-expensive':
      filteredHotels = filteredHotels.sort( function( a, b ) {
        return b.price - a.price;
      } );
      break;
    case 'filter-2stars':
      break;
  }

  console.log( filteredHotels );
  renderHotels( filteredHotels );
}


/**
 * @param {string} method
 * @param {string} URL
 * @param {boolean} async
 */
function getHotels() {
  var xhr = new XMLHttpRequest();
  xhr.open( 'GET', '../data/hotels.json' );
  xhr.timeout = 10000;
  xhr.onload = function( evt ) {
    var rawData = evt.target.response;
    var loadedHotels = JSON.parse( rawData );
    hotels = loadedHotels;
    renderHotels( loadedHotels );
  };
  xhr.send();
}


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
    var element = template.children[ 0 ].cloneNode( true );
  }

  var rating = element.querySelector( '.hotel__rating' );
  element.querySelector( '.hotel__name' ).textContent = data.name;
  element.querySelector( '.hotel__price-value' ).textContent = data.price;

  data.rating ? rating.textContent = data.rating : rating.style.display = 'none';

  // prepare image
  var backgroundImage = new Image(); //create image

  var imageLoadTimeout = setTimeout( function() { //fallback if image is cannot load
    backgroundImage.src = '';
    element.classList.add( 'hotel--nophoto' ); // give element class with default background-image
  }, IMAGE_TIMEOUT );

  // load and erorr handlers we set before changing .src attribute

  backgroundImage.onload = function() {
    clearTimeout( imageLoadTimeout );
    element.style.backgroundImage = 'url(\'' + backgroundImage.src + '\')';
  };
  backgroundImage.onerror = function() {
    element.classList.add( 'hotel--nophoto' );
  };

  // start all this
  backgroundImage.src = data.preview ? data.preview : '';

  return element;
}