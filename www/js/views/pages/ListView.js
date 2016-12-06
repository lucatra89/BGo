define(function(require) {

  var Backbone = require('backbone');
  var Utils = require('utils');
  var ItemView = require('views/subviews/ItemView');
  var PointsOfInterest = require("collections/PointsOfInterest");

  var ListView = Utils.Page.extend({

    constructorName: 'ListView',
    tagName: "ul",
    className: "table-view",

    initialize: function() {
      this.listenTo(this.model,"loaded", this.render);
    },

    render: function() {
      var self=this,
      df= document.createDocumentFragment(),
      collection = this.model;

      this.el.innerHTML="";
      this.subViews=[];
      collection.each(function(model){
        var view = new ItemView({model:model});
        self.subViews.push(view);
        df.appendChild(view.render().el);
      });

      this.el.appendChild(df);
      return this;
    }

  });

  return ListView;

});
