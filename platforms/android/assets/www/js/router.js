define(function(require) {

  var $ = require('jquery');
  var Backbone = require('backbone');
  var StructureView = require('views/StructureView');
  var ListView = require('views/pages/ListView');
  var MapView = require('views/pages/MapView');
  var PointView = require('views/pages/PointView');
  var ProfileView = require('views/pages/ProfileView');
  var LoginView = require('views/pages/LoginView');
  var PointsOfInterest = require('collections/PointsOfInterest');
  var PointOfInterest = require('models/PointOfInterest');
  var User = require('models/User');
  var Utils = require('utils');

  var AppRouter = Backbone.Router.extend({

    constructorName: 'AppRouter',

    routes: {
      '': 'showStructure',
      'home': 'home',
      'map': 'map',
      'point/:id': 'point',
      'favourites': 'favourites',
      'profile': 'profile',
      'login': 'login',
      'logout': 'logout',
      'search/:q': 'search',
    },

    firstView: 'login',

    initialize: function(options) {
      var self = this;
      this.currentView = undefined;
      this.neighbors = new PointsOfInterest();
      this.favourites = new PointsOfInterest();
      this.searched = new PointsOfInterest();
      this.user = new User();

    },

    login: function() {
      var self = this;
      if (localStorage.getItem('logged') === 'true') {
        Backbone.history.navigate('home',{
          trigger: true
        });
        self._init();

      }else {

        var page = new LoginView();
        this.changePage(page);
        this.listenTo(page, 'authSuccess', onAuthSuccess);
      }

      function onAuthSuccess() {
        localStorage.setItem('logged', 'true');
        self._init();
        Backbone.history.navigate('home',{
          trigger: true
        });
      }
    },

    home: function() {
      var page = new ListView({model: this.neighbors});
      this.changePage(page);

      this.structureView.setActiveTabBarElement('nav_home');
    },

    map: function() {
      var page, model;

      model = {
        position: this.position,
        neighbors: this.neighbors
      };
      page = new MapView({model: model});
      this.changePage(page);
      this.structureView.setActiveTabBarElement('nav_map');
    },
    favourites: function() {
      var position = this.position,
      favourites = this.favourites,
      page = new ListView({model: favourites});

      this.changePage(page);
      this.structureView.setActiveTabBarElement('nav_fav');

    },

    profile: function() {
      var model = this.user,
      page = new ProfileView({model: model});
      this.changePage(page);
      this.structureView.setActiveTabBarElement('nav_profile');
    },

    point: function(id) {
      var point,page,model,
      query = {id: parseInt(id)};
      point = this.neighbors.findWhere(query) || this.favourites.findWhere(query) || this.searched.findWhere(query);

      model = {
        position: this.position,
        point: point
      };

      page = new PointView({model: model});

      this._activatePoiView(page,point);
      this.changePage(page);

    },
    search: function(q) {
      var self = this,
       pois = this.searched;
      pois.fetchByName(q);
      pois.once('reset', onReset);

      var page = new ListView({model: pois});
      this.changePage(page);

      function onReset() {
        this.setDistancesFrom(self.position);
        this.comparator = 'meters';
        this.sort();
        this.trigger('loaded');
      }
    },
    logout: function() {
      localStorage.removeItem('logged');
      Backbone.history.navigate('login',{trigger: true});
      this.profile = new User();
      this.neighbors = new PointsOfInterest();
    },

    showStructure: function() {

      if (!this.structureView) {
        this.structureView = new StructureView();
        document.body.appendChild(this.structureView.render().el);
        this.structureView.trigger('inTheDOM');
        Backbone.history.navigate(this.firstView,{
          trigger: true
        });
      }

    },

    _loadPosition: function() {
      var self = this;

      function success(position) {
        self.position = {
          lat: 44.494887,//position.coords.latitude
          lon: 11.34261644//position.coords.longitude
        };
        self.trigger('position');
      }

      navigator.geolocation.getCurrentPosition(success);
    },

    _loadNeighbors: function() {
      this.neighbors.fetchNeighbors(this.position);
    },

    _loadFavourites: function() {
      var self = this;

      this.favourites.once('reset', onReset);
      this.favourites.fetchFavourites();

      function onReset() {
        this.setDistancesFrom(self.position);
        this.comparator = 'meters';
        this.sort();
        this.trigger('loaded');
      }

    },

    _activatePoiView: function(page, point) {
      var options = {
        title: point.get('title'),
        favourite: this.favourites.contains(point)
      };

      var structureView = this.structureView;
      

      structureView.trigger('showTitle',options);

      this.listenToOnce(page,'removing', deactivate);

      this.listenTo(structureView,'toggleFavourite',saveOrRemove);
      structureView.listenTo(point,'favouriteSaved favouriteRemoved',triggerSuccess);

      function deactivate(argument) {
        structureView.trigger('hideTitle');
        this.stopListening(structureView,'toggleFavourite');
        structureView.stopListening(point);
      }

      function  saveOrRemove(argument) {
        this.favourites.saveOrRemove(point);
      }

      function triggerSuccess(){
        structureView.trigger('toggleSuccess');
      }

    },

    _loadUser: function() {
      this.user.fetchCurrentUser();
    },

    _init: function() {
      this.on('position', function() {
        this._loadNeighbors();
        this._loadFavourites();
      });
      this._loadPosition();
      this._loadUser();
    }

  });

  return AppRouter;

});
