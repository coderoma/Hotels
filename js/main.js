'use strict';

var formElement = document.forms[ 'searchform' ];

var searchform = document.querySelector( '.searchform' );

var guests = formElement[ 'searchform-guests-number' ];
var rooms = formElement[ 'searchform-guests-rooms' ];

guests.min = 1;
guests.max = 6;

var MAX_GUESTS_PER_ROOM = 3;

function setMinAndMaxRooms( roomsElement, guestNumber ) {
	roomsElement.min = Math.ceil( guestNumber / MAX_GUESTS_PER_ROOM );
	roomsElement.max = guestNumber
}

guests.value = docCookies.getItem('guests');
setMinAndMaxRooms( rooms, guests.value );
rooms.value = docCookies.getItem('rooms');


guests.onchange = function() {
	setMinAndMaxRooms( rooms, guests.value );
};

formElement.onsubmit = function( evt ) {
	evt.preventDefault();

	var dateToExpire = +Date.now() + 3 * 24 * 60 * 60 * 1000; // сегодня + вторая часть это через три дня
	var formattedDateToExpire = new Date( dateToExpire ).toUTCString();

	document.cookie = 'guests=' + guests.value + ';expires=' + formattedDateToExpire;
	document.cookie = 'rooms=' + rooms.value + ';expires=' + formattedDateToExpire;

	formElement.submit();
}

searchform.addEventListener( 'mouseover', function( event ) {
	if ( event.target.classList.contains( 'searchform__guests' ) ) {
		event.target.focus();
	}

} );


