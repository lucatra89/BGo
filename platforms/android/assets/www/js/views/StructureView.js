define(function(require) {

  var $ = require('jquery');
  var Backbone = require('backbone');
  var Utils = require('utils');
  var _ = require('underscore');

  var StructureView = Backbone.View.extend({

    constructorName: 'StructureView',

    id: 'main',

    events: {
      'tap #nav_home': 'home',
      'tap #nav_map': 'map',
      'tap #nav_profile': 'profile',
      'tap #nav_fav': 'favourites',
      'tap #back': 'goBack',
      'tap #fav': 'toggleFav'
    },

    initialize: function(options) {
      // load the precompiled template
      this.template = Utils.templates.structure;
      this.on('showTitle', this.showTitle);
      this.on('hideTitle', this.hideTitle);
      this.on('toggleSuccess', this.onToggleSuccess);
      this.on('inTheDOM', this.rendered);
    },

    render: function() {
      // load the template
      this.el.innerHTML = this.template({});
      // cache a reference to the content element
      this.contentElement = this.$el.find('#content')[0];
      return this;
    },

    rendered: function() {
      var self = this;
      var throttled = _.throttle(search, 100);

      this.$el.find('#searchbox').on('keyup',throttled);

      function search() {
        self.search();
      }

      window.addEventListener("native.keyboardshow", this.hideNavBar);
      window.addEventListener("native.keyboardhide", this.showNavBar);
    },

    goBack: function() {
      window.history.back();
    },

    setActiveTabBarElement: function(elementId) {
      // here we assume that at any time at least one tab bar element is active
      document.getElementsByClassName('active')[0].classList.remove('active');
      document.getElementById(elementId).classList.add('active');
    },

    home: function(event) {

      Backbone.history.navigate('home', {
        trigger: true
      });
    },

    map: function(event) {

      Backbone.history.navigate('map', {
        trigger: true
      });
    },

    profile: function(event) {

      Backbone.history.navigate('profile', {
        trigger: true
      });
    },

    favourites: function(event) {

      Backbone.history.navigate('favourites', {
        trigger: true
      });
    },

    showTitle: function(options) {
      var title = options.title,
      favourite = options.favourite;

      this.$el.find('header').addClass('poi');
      this.$el.find('header h1').text(title);
      if (favourite) {
        this.$el.find('header .fa-star').addClass('active');
      }
    },

    hideTitle: function() {
      this.$el.find('header').removeClass('poi');
      this.$el.find('header h1').text('');
      this.$el.find('header .fa-star').removeClass('active');
    },

    toggleFav: function() {
      this.trigger('toggleFavourite');
    },

    onToggleSuccess: function() {
      this.$el.find('header .fa-star').toggleClass('active');
    },

    search: function() {
      var q = this.el.querySelector('#searchbox').value;
      if (q === '') {
        Backbone.history.navigate('home', {trigger: true});
      }
      Backbone.history.navigate('search/' + q, {trigger: true});
    },

    hideNavBar:function(){
      $('#bar-footer').hide();
    },

    showNavBar:function(){
      $('#bar-footer').show();
    }

  });

  return StructureView;

});
