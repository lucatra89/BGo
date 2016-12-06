define(function(require) {

  var Backbone = require('backbone');
  var Utils = require('utils');
  var PointOfInterest = require('models/PointOfInterest');
  var $ = require('jquery');
  var constants = require('constants');

  var ProfileView = Utils.Page.extend({
    constructorName: 'ProfileView',

    className: 'content',

    events: {
      'tap #editemail': 'editEmail',
      'tap #editpwd': 'editPassword',
      'tap #logout': 'logout'
    },

    initialize: function(options) {
      this.template = Utils.templates.profile;
      this.listenTo(this.model,'loaded', this.render);
      this.modal = $('#modal');

      this.on('removing',function() {
        this.modal.html('');
      });

      this.listenTo(this.model,'updated',function() {
        this.modal.removeClass('active');
        this.modal.html('');
        swal('Ok!', 'Aggiornamento avvenuto con successo!', 'success');
      });

      this.listenTo(this.model,'change:email', function() {
        this.el.querySelector('#email').innerHTML = this.model.get('email');
      });

    },

    render: function() {
      var html = this.template(this.model.toJSON());
      this.el.innerHTML = html;

      return this;
    },

    editEmail: function() {
      var self = this,
      html = Utils.templates.editEmail(this.model.toJSON());

      this._activateModal(html);
      this.modal.find('#change').on('tap',update);

      function update() {
        var email = self.modal.find('#i-email').val();
        self.model.updateEmail(email);
      }
    },

    editPassword: function() {
      var self = this,
      html = Utils.templates.editPwd({});

      this._activateModal(html);

      this.modal.find('#change').on('tap',update);

      function update() {
        var old_pwd = self.modal.find('#old_pwd').val(),
        new_pwd = self.modal.find('#new_pwd').val(),
        check_pwd = self.modal.find('#check_pwd').val();
        if (new_pwd != check_pwd || old_pwd === '' || new_pwd === '') {
          alert('Attenzione c\'è un errore!');
        }
        self.model.updatePassword(old_pwd,new_pwd);
      }
    },
    logout: function() {
      var promise = $.ajax({
        url: constants.uriRoot + '/logout',
        type: 'POST'
      });

      promise.done(success).fail(error);

      function success() {
        Backbone.history.navigate('logout', {trigger: true});
      }

      function error() {
        swal('Ops..','Si è verificato un errore','error');
      }
    },
    _activateModal: function(html) {
      var self = this;
      this.modal.html(html);
      this.modal.addClass('active');
      this.modal.find('#closemodal').on('tap', closeModal);

      function closeModal() {
        self.modal.removeClass('active');
        self.modal.html('');
      }
    }

  });

  return ProfileView;
});
