define(function(require) {

  var Backbone = require('backbone');
  var PointOfInterest = require('models/PointOfInterest');
  var Utils = require('utils');

  var ItemView = Backbone.View.extend({
    constructorName: 'ItemView',
    tagName: 'li',
    className: 'table-view-cell media',

    initialize: function() {
      this.template = Utils.templates.listItem;
    },
    events: {
      'tap': 'goToDetail'
    },

    render: function() {
      var data = this.model.toJSON();
      this.el.innerHTML = this.template(data);
     
      return this;
    },

    goToDetail: function() {
      var id = this.model.get('id');
      Backbone.history.navigate('point/' + id, {
        trigger: true
      });
    }
  });

  return ItemView;
});
