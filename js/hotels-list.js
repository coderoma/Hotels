"use strict";

var container = document.querySelector( '.hotels-list' );
var activeFilter = 'filter-all';
var hotels = [];
var filteredHotels = [];
var renderedElements = [];
var currentPage = 0;
var PAGE_SIZE = 12;
var gallery = new Gallery();


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
    Array.prototype.forEach.call(renderedElements, function(element){
      element.removeEventListener('click', _onClick);
      container.removeChild(element);
    });
    
  }
  var fragment = document.createDocumentFragment();
  var from = pageNumber * PAGE_SIZE;
  var to = from + PAGE_SIZE;
  var pageHotels = hotelsToRender.slice( from, to );

  pageHotels.forEach( function ( hotel ) {
    /**
     * @type  {Constructor}
     */
    var hotelElement = new Hotel( hotel );
    hotelElement.render();
    fragment.appendChild( hotelElement.element );

    hotelElement.onClick = function() {
      gallery.data = hotelElement._data;
      gallery.show();
    }
  });

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
      return filteredHotels;
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