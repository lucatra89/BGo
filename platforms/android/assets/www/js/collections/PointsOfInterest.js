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
      data = {
        lat: position.lat,
        lon: position.lon,
        city: constants.city
      };

      $.getJSON(constants.uriRoot + '/neighbors', data, success);

      function success(data) {
        var list = JSON.parse(data);
        self.reset(list);
        self.trigger('loaded');
      }

    },

    fetchFavourites: function() {
      var self = this,
      data = {city: constants.city};

      var promise = $.getJSON(constants.uriRoot + '/favourites',data, success);

      function success(data) {
        var list = JSON.parse(data);
        self.reset(list);
      }

    },
    fetchByName: function(name) {
      var self = this,
      data = {
        city: constants.city,
        q: name
      };

      var promise = $.getJSON(constants.uriRoot + '/search',data, success);

      function success(data) {
        var list = JSON.parse(data);
        self.reset(list);
      }

    },

    setDistancesFrom: function(position) {
      this.each(function(model) {
        model.setDistanceFrom(position);
      });
    },

    saveOrRemove: function(model) {
      if (this.contains(model)) {
        this.removeFavourite(model);
      }else {
        this.saveFavourite(model);
      }
    },

    saveFavourite: function(model) {
      var self = this,
      promise = $.ajax({
        url: constants.uriRoot + '/favourites',
        data: JSON.stringify(model.toJSON()),
        type: 'POST',
        contentType: 'application/json'
      });

      promise.done(success);

      function success() {
        self.add(model);
        model.trigger('favouriteSaved');
      }

    },

    removeFavourite: function(model) {
      var self = this,
      promise = $.ajax({
        url: constants.uriRoot + '/favourites/' + model.get('id'),
        type: 'DELETE'
      });

      promise.done(success);

      function success() {
        self.remove(model.get('id'));
        model.trigger('favouriteRemoved');
      }
    }

  });

  return PointsOfInterest;
});
