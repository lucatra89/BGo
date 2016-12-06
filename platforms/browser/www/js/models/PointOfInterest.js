define(function(require) {

  var Backbone = require('backbone');

  var PointOfInterest = Backbone.Model.extend({
    constructorName: 'PointOfInterest',
    initialize: function(data) {
      var desc = data.description,
      m = Math.floor(data.distance);
      km = m / 1000;

      if (km >= 1) {
        this.set('km', km);
      }
      this.set('meters', m);

      shortDesc = desc.substring(0, 140) + ' ...';
      this.set('shortDesc', shortDesc);

    }
  });

  return PointOfInterest;
});
