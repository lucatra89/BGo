define(function(require) {

  var Backbone = require('backbone');
  var PointOfInterest = require('models/PointOfInterest');
  var $ = require('jquery');
  var constants = require('constants');

  var PointsOfInterest = Backbone.Collection.extend({
    constructorName: 'PointsOfInterest',
    model: PointOfInterest,

    fetchNeighbors: function(position) {
      var self = this,
      promise,
      data = {
      	lat: position.lat,
      	lon: position.lon,
      	city: constants.city
      };
      
      $.getJSON(constants.uriRoot + '/search', data, success);
      
      function success(data){
      	var list = JSON.parse(data);
      	self.reset(list);
      }

    }


  });

  return PointsOfInterest;
});
