define(function(require) {

  var $ = require('jquery');
  var Backbone = require('backbone');
  var StructureView = require('views/StructureView');
  var ListView = require('views/pages/ListView');
  var MapView = require('views/pages/MapView');
  var PointsOfInterest = require('collections/PointsOfInterest');
  var Utils = require('utils');

  var AppRouter = Backbone.Router.extend({

    constructorName: 'AppRouter',

    routes: {
      '': 'showStructure',
      'home': 'home',
      'map': 'map',
      'point/:id':'point'
    },

    firstView: 'home',

    initialize: function(options) {
      var self = this;
      this.currentView = undefined;
      this.neighbors = new PointsOfInterest();      
      this.on("position", function(){
        self.neighbors.fetchNeighbors(self.position);
      });
      this.watchPosition();

    },

    home: function() {
      alert();
      debugger;
      var page = new ListView({model: this.neighbors});
      this.changePage(page);
      this.neighbors.on('reset', function(){
        page.render();
      });

      this.structureView.setActiveTabBarElement('nav_home');
    },

    map: function() {
      var page = new MapView({model:this.neighbors});
      this.changePage(page);
      this.structureView.setActiveTabBarElement('nav_map');
    },
    favourites: function() {
    },

    profile: function() {

    },
    point: function(id) {

    },

    showStructure: function() {

      if (!this.structureView) {
        this.structureView = new StructureView();
        document.body.appendChild(this.structureView.render().el);
        this.structureView.trigger('inTheDOM');
        Backbone.history.navigate(this.firstView,{
          trigger:true
        });
    }

    },


    watchPosition: function(){
      var self = this;

      function success (position) {
        self.position={
          lat:44.494887,//position.coords.latitude
          lon:11.34261644//position.coords.longitude
        };
        self.trigger("position");
      }
      
      success();//debug

      navigator.geolocation.watchPosition(success);
    }

  });

  return AppRouter;

});
