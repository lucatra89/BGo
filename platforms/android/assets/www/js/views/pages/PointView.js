define(function(require) {

  var Backbone = require('backbone');
  var Utils = require('utils');
  var PointOfInterest = require('models/PointOfInterest');

  var PointView = Utils.Page.extend({

    constructorName: 'PointView',

    initialize: function() {
      this.template = Utils.templates.point;
      this.on('inTheDOM',this.addMap);
    },

    events: {
      'tap #site': 'openSite'
    },

    render: function() {
      var data = this.model.point.toJSON(),
      html = this.template(data);

      this.$el.html(html);
      return this;
    },

    addMap: function() {
      var position = this.model.position,
      mapUrl = 'https://maps.google.com/?saddr=' + position.lat + ',' + position.lon + '&daddr=',
      point = this.model.point;

      var lat = point.get('latitude'),
      lon = point.get('longitude'),
      url = mapUrl + lat + ',' + lon,
      title = point.get('title'),
      dist = (point.get('km')) ? point.get('km') + ' Km' : point.get('meters') + ' metri',
      popup = title + '<br/>' + dist + '<br/>' + '<a href=\'' + url + '\'\'>Apri navigatore</a>';


      var options = {
        center: new L.LatLng(lat, lon),
        zoom: 19
      };

      var map = L.map('smallmap', options);

      var positionIcon = L.icon({
        iconUrl: './img/hereIcon.png',
        iconSize: [20, 20],
      });


      map.attributionControl.setPrefix('Leaflet');

      L.marker([position.lat,position.lon],{icon: positionIcon})
      .addTo(map);

      L.marker([lat, lon])
      .addTo(map)
      .bindPopup(popup);

      var layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; OpenStreetMap',
        maxZoom: 20
      });
      map.addLayer(layer);
    },

    openSite:function(){
      var url=this.model.point.get('site_url', '_blank');
      cordova.InAppBrowser.open(url);
    }

  });

  return PointView;

});
