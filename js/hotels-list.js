"use strict";

var container = document.querySelector( '.hotels-list' );
var activeFilter = localStorage.getItem('activeFilter') || 'filter-all';
var hotels = [];
var filteredHotels = [];
var renderedElements = [];
var currentPage = 0;
var PAGE_SIZE = 12;
var gallery = new Gallery();

var filters = document.querySelector( '.filters' );


filters.addEventListener( 'click', function ( event ) {
  if ( event.target.classList.contains( 'filters__button' ) ) {
    setActiveFilter(event.target.id );
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
function renderHotels( hotelsToRender, pageNumber, replace ) {
  if ( replace ) {
    var el;
    while ( ( el = renderedElements.shift() ) ) {
      container.removeChild( el.element );
      el.onClick = null;
      el.remove();
    }
  }
  var fragment = document.createDocumentFragment();
  var from = pageNumber * PAGE_SIZE;
  var to = from + PAGE_SIZE;

  var pageHotels = hotelsToRender.slice( from, to );

  renderedElements = renderedElements.concat( pageHotels.map( function ( hotel ) {
    /**
     * @type  {Constructor}
     */
    var hotelElement = new Hotel( hotel );
    hotelElement.setData( hotel );
    hotelElement.render();
    fragment.appendChild( hotelElement.element );

    hotelElement.onClick = function () {
      gallery.setData( hotelElement.getData() );
      gallery.render();
    };

    return hotelElement;
  } ) );

  container.appendChild( fragment );
}

/**
 *
 * @param {string} id
 */
function setActiveFilter( id ) {
  document.querySelector('#' + activeFilter).classList.remove( 'filters--selected' );
  document.querySelector( '#' + id ).classList.add( 'filters--selected' );

  activeFilter = id;
  currentPage = 0;

  switch ( activeFilter ) {
    case 'filter-expensive':
      filteredHotels = Array.prototype.slice.call( Hotels ).sort( function ( a, b ) {
        return b.getPrice() - a.getPrice();
      } );
      break;
    case 'filter-cheap':
      filteredHotels = Array.prototype.slice.call( Hotels ).sort( function ( a, b ) {
        return a.getPrice() - b.getPrice();
      } );
      break;
    case 'filter-all':
      filteredHotels = Array.prototype.slice.call( Hotels );
      break;
    case 'filter-6raiting':
      filteredHotels = Array.prototype.slice.call( Hotels ).sort( function ( a, b ) {
        return b.getRating() - a.getRating();
      } ).filter( function ( item ) {
        return item.getRating() >= 6;
      } );
      break;
  }

  localStorage.setItem('activeFilter', id);

  renderHotels( filteredHotels, 0, true );
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
  xhr.onload = function ( evt ) {
    var rawData = evt.target.response;
    var loadedHotels = JSON.parse( rawData );

    loadedHotels = loadedHotels.map( function ( hotel ) {
      return new HotelData( hotel );
    } );

    Hotels = loadedHotels.slice( 0 );
    filteredHotels = Hotels;
    setActiveFilter( activeFilter );
  };
  xhr.send();
}