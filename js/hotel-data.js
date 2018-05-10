'use strict';

( function () {
  /**
   * @param  {Object} data
   * @constructor
   */
  var HotelData = function ( data ) {
    this.params = data;
  };

  /**
   * @return {Array.<string>}
   */
  HotelData.prototype.getPictures = function () {
    return this.params.pictures;
  };
  
  /**
   * @return {number}
   */
  HotelData.prototype.getPrice = function () {
    return this.params.price;
  };
  
  /**
   * @return {string}
   */
  HotelData.prototype.getName = function () {
    return this.params.name;
  };

  /**
   * @return {number}
  */
  HotelData.prototype.getRating = function () {
    return this.params.rating;
  };
  
  /**
   * @return {string}
   */
  HotelData.prototype.getPreview = function () {
    return this.params.preview;
  };


  window.HotelData = HotelData;
} )();