define(function(require) {

  var Backbone = require('backbone');
  var Utils = require('utils');
  var $ = require('jquery');
  var constants = require('constants');

  var LoginView = Utils.Page.extend({
    constructorName: 'LoginView',

    className: 'fullscreen',

    initialize: function() {
      this.template = Utils.templates.login;
      this.on('inTheDOM', this.rendered);

      this.on('removing', function(){
        window.removeEventListener("native.keyboardshow", this.hideBarFooter);
        window.removeEventListener("native.keyboardhide", this.showBarFooter);
      });

    },

    events: {
      'tap #login': 'login',
      'tap #signup': 'signup',
      'focus input': 'hideBarFooter',
      'blur input': 'showBarFooter'
    },

    render: function() {
      this.el.innerHTML = this.template({});
      return this;
    },

    rendered: function() {
      this.emailEl = this.el.querySelector('#email');
      this.pwdEl = this.el.querySelector('#pwd');

      var $inputs = this.$el.find('input');

      window.addEventListener('native.keyboardshow', this.hideBarFooter);
      window.addEventListener('native.keyboardhide', this.showBarFooter);

    },

    login: function() {
      var promise,self, data;

      self = this;
      data = {
        email: this.emailEl.value,
        password: this.pwdEl.value
      };

      promise = $.ajax({
        url: constants.uriRoot + '/login',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify(data)
      });

      promise.done(success).fail(error);

      function success() {
        self.trigger('authSuccess');
      }

      function error() {
        swal('Ops...','login non riuscito', 'error');
        self.pwdEl.value = '';
        self.emailEl.value = '';
      }

    },
    signup: function() {
      var promise,self, data;

      self = this;
      data = {
        email: this.emailEl.value,
        password: this.pwdEl.value
      };

      promise = $.ajax({
        url: constants.uriRoot + '/signup',
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify(data)
      });

      promise.done(success).fail(error);

      function success() {
        self.trigger('authSuccess');
      }

      function error() {
        swal('Ops...','registrazione non riuscita', 'error');
        self.pwdEl.value = '';
        self.emailEl.value = '';
      }
    },

    hideBarFooter: function() {
      $('.bar-footer-secondary').hide();
    },

    showBarFooter: function() {
      $('.bar-footer-secondary').show();
    }

  });

  return LoginView;
});
