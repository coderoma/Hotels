'use strict';

var container = document.querySelector( '.hotels-list' );
var activeFilter = 'filter-all';
var hotels = [];
var filteredHotels = [];
var currentPage = 0;
var PAGE_SIZE = 12;


var filters = document.querySelector( '.filters' );

filters.addEventListener( 'click', function ( evt ) {
  var clickedElement = evt.target;
  if ( clickedElement.classList.contains( 'filters__button' ) ) {
    setActiveFilter( clickedElement.id );
  }
} );

var scrollTimeout;
window.addEventListener( 'scroll', function () {
  clearTimeout( scrollTimeout );
  scrollTimeout = setTimeout( function () {
    var footerCoordinates = document.querySelector( 'footer' ).getBoundingClientRect();
    // var viewportSize = window.innerHeight;

    if ( footerCoordinates.bottom - window.innerHeight <= footerCoordinates.height ) {
      if ( currentPage < Math.ceil( filteredHotels.length / PAGE_SIZE ) ) {
        renderHotels( filteredHotels, ++currentPage );
      }
    }
  }, 100 );

} );

getHotels();


/**
 * @param {Array.<Object>} hotels
 * @param {number} pageNumber
 * @param {boolean=} replace
 */
function renderHotels ( hotelsToRender, pageNumber, replace ) {
  if ( replace ) {
    container.innerHTML = '';
  }
  var fragment = document.createDocumentFragment();

  var from = pageNumber * PAGE_SIZE;
  var to = from + PAGE_SIZE;
  var pageHotels = hotelsToRender.slice( from, to );

  pageHotels.forEach( function ( hotel ) {
    var element = getElementFromTemplate( hotel );

    element.addEventListener( 'click', function ( evt ) {
      if ( evt.target.classList.contains( 'hotel' ) ) {
        document.querySelector( '.gallery-overlay' ).classList.remove( 'hidden' );
      }
    } );

    fragment.appendChild( element );
  } );

  container.appendChild( fragment );
}

/**
 *
 * @param {string} id
 */
function setActiveFilter ( id ) {
  if ( activeFilter === id ) {
    return;
  }

  document.querySelector( '#' + activeFilter ).classList.remove( 'filters--selected' );
  document.querySelector( '#' + id ).classList.add( 'filters--selected' );
  activeFilter = id;

  switch ( activeFilter ) {
    case 'filter-expensive':
      filteredHotels = filteredHotels.sort( function ( a, b ) {
        return b.price - a.price;
      } );
      break;
    case 'filter-2stars':
      break;
    case 'filter-all':
      break;
  }

  renderHotels( filteredHotels, 0, true );
}


/**
 * @param {string} method
 * @param {string} URL
 * @param {boolean} async
 */
function getHotels () {
  var xhr = new XMLHttpRequest();
  xhr.open( 'GET', '../data/hotels.json' );
  xhr.timeout = 10000;
  xhr.onload = function ( evt ) {
    var rawData = evt.target.response;
    var loadedHotels = JSON.parse( rawData );
    hotels = loadedHotels;
    filteredHotels = hotels.slice( 0 );
    renderHotels( filteredHotels, 0 );
  };
  xhr.send();
}


/**
 * @param {Object} data
 * @return {Element}
 */
function getElementFromTemplate ( data ) {
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

  if ( data.rating ) {
    rating.textContent = data.rating;
  } else {
    rating.style.display = 'none';
  }

  // prepare image
  var backgroundImage = new Image(); //create image

  var imageLoadTimeout = setTimeout( function () { //fallback if image is cannot load
    backgroundImage.src = '';
    element.classList.add( 'hotel--nophoto' ); // give element class with default background-image
  }, IMAGE_TIMEOUT );

  // load and error handlers we set before changing .src attribute

  backgroundImage.onload = function () {
    clearTimeout( imageLoadTimeout );
    element.style.backgroundImage = 'url(\'' + backgroundImage.src + '\')';
  };
  backgroundImage.onerror = function () {
    element.classList.add( 'hotel--nophoto' );
  };

  // start all this
  backgroundImage.src = data.preview ? data.preview : '';

  return element;
}