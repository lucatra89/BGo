define(function(require) {

  var Backbone = require('backbone');
  var L = require('leaflet');
  var Utils = require('utils');

  var MapView = Utils.Page.extend({

    constructorName: 'MapView',

    id: 'map',

    initialize: function(options) {
      // when I am in the DOM, I can start adding all the Leaflet stuff
      this.listenTo(this, 'inTheDOM', this.addMap);

    },

    render: function() {
      return this;
    },

    addMap: function() {
      var position = this.model.position,
      neighbors = this.model.neighbors;

      var options = {
        center: new L.LatLng(position.lat, position.lon),
        zoom: 19
      };
      var map = L.map('map', options);

      var positionIcon = L.icon({
        iconUrl: './img/hereIcon.png',
        iconSize: [20, 20],
      });

      var mapUrl = 'https://maps.google.com/?saddr=' + position.lat + ',' + position.lon + '&daddr=';

      map.attributionControl.setPrefix('Leaflet');

      L.marker([position.lat,position.lon],{icon: positionIcon})
      .addTo(map);

      neighbors.each(addMarker);

      var layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; OpenStreetMap',
        maxZoom: 20
      });
      map.addLayer(layer);

      function addMarker(point) {
        var lat = point.get('latitude'),
        lon = point.get('longitude'),
        url = mapUrl + lat + ',' + lon,
        title = point.get('title'),
        dist = (point.get('km')) ? point.get('km') + ' Km' : point.get('meters') + ' metri',
        popup = title + '<br/>' + dist + '<br/>' + '<a href=\'' + url + '\'\'>Apri navigatore</a>';

        L.marker([lat, lon])
        .addTo(map)
        .bindPopup(popup);
      }

    }

  });

  return MapView;

});
