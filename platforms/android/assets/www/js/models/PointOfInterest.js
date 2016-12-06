define(function(require) {

  var Backbone = require('backbone');
  var constants = require('constants');

  var PointOfInterest = Backbone.Model.extend({
    constructorName: 'PointOfInterest',
    initialize: function(data) {
      if (!this.isNew()) {
        this._format(data);
      }

    },

    url: function() {
      return constants.uriRoot + '/point/' + this.get('id');
    },

    parse: function(response) {
      this.set(JSON.parse(response));
      this._format(response);
    },

    _format: function(data) {
      var desc = data.description;

      if (data.distance) {
        this._generateDistanceInfo(data.distance);
      }

      if(data.crop_img_url){
        this.set( 'crop_img_url' ,constants.uriImg + '/' + data.crop_img_url);
      }

      shortDesc = desc.substring(0, 47) + ' ...';
      this.set('shortDesc', shortDesc);
    },

    setDistanceFrom: function(position) {
      var distance = this._distance(position.lat, position.lon,this.get('latitude'), this.get('longitude'));
      this.set('distance',distance);
      this._generateDistanceInfo(distance);
    },

    _distance: function(lat1, lon1, lat2, lon2) {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var radlon1 = Math.PI * lon1 / 180;
      var radlon2 = Math.PI * lon2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344;
      return dist;
    },

    _generateDistanceInfo: function(distance) {
      var m = Math.ceil(distance * 10) * 100;
      var km = Math.floor(m / 1000);

      if (km >= 1) {
        this.set('km', km);
      }
      this.set('meters', m);
    }

  });

  return PointOfInterest;
});
