define(function(require) {

  var Backbone = require('backbone');
  var constants = require('constants');
  var $ = require('jquery');

  var User = Backbone.Model.extend({
    url: function() {
      return constants.uriRoot + '/profile';
    },
    fetchCurrentUser: function() {
      var self = this,
      promise = $.getJSON(this.url());

      promise.done(success);

      function success(data) {
        debugger;
        self.set(JSON.parse(data));
        self.trigger('loaded');
      }
    },

    updateEmail: function(email) {
      var self = this,
    	promise,options;

      options = {
      url: this.url() + '/email',
      type: 'PUT',
      data: JSON.stringify({email: email}),
      contentType: 'application/json'
    	};

      promise = $.ajax(options);

      promise.done(success).fail(error);

      function success() {
        self.set('email', email);
        self.trigger('updated');
      }

      function error() {
        alert('Si è verificato un errore');
      }
    },
    updatePassword: function(old_pwd, new_pwd) {
      var self = this,
    	promise, json;

      json = JSON.stringify({
        old_pwd: old_pwd,
        new_pwd: new_pwd
      });

      promise = $.ajax({
      url: this.url() + '/password',
      type: 'PUT',
      data: json,
      contentType: 'application/json'
    	});

      promise.done(success).fail(error);

      function success() {
        self.trigger('updated');
      }

      function error() {
        alert('Si è verificato un errore');
      }
    }

  });

  return User;
});
