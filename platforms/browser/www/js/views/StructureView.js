define(function(require) {

  var $ = require("jquery");
  var Backbone = require("backbone");
  var Utils = require("utils");

  var StructureView = Backbone.View.extend({

    constructorName: "StructureView",

    id: "main",

    events: {
      "tap #nav_home": "home",
      "tap #nav_map": "map",
      "tap #nav_profile": "profile",
      "tap #nav_fav": "favourites",
      "tap #search":"search"
    },

    initialize: function(options) {
      // load the precompiled template
      this.template = Utils.templates.structure;
      //this.on("inTheDOM", this.rendered);
      // bind the back event to the goBack function
      //document.getElementById("back").addEventListener("back", this.goBack(), false);
    },

    render: function() {
      // load the template
      this.el.innerHTML = this.template({});
      // cache a reference to the content element
      this.contentElement = this.$el.find('#content')[0];
      return this;
    },

    // rendered: function(e) {
    // },

    // generic go-back function
    goBack: function() {
      //window.history.back();
    },

    setActiveTabBarElement: function(elementId) {
      // here we assume that at any time at least one tab bar element is active
      document.getElementsByClassName("active")[0].classList.remove("active");
      document.getElementById(elementId).classList.add("active");
    },

    home: function(event) {

      Backbone.history.navigate("home", {
        trigger: true
      });
    },

    map: function(event) {
      
      Backbone.history.navigate("map", {
        trigger: true
      });
    },

    profile: function(event) {
      
      Backbone.history.navigate("profile", {
        trigger: true
      });
    },

    favourites: function(event) {
      
      Backbone.history.navigate("favourites", {
        trigger: true
      });
    },

    search: function(e){
      alert();
      debugger;
        var q = this.el.querySelector('#search').value;
        Backbone.history.navigate("search/"+q, {trigger:true} );

    }
  });

  return StructureView;

});