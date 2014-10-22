import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  needs: 'application',
  auth_token: Ember.computed.alias('controllers.application.auth_token'),
  currentUser: Ember.computed.alias('controllers.application.currentUser'),
  email: null,
  password: null,
  response: null,

  actions: {
    authenticate: function() {
      var self = this;
      ajax('/api/sign_in', {
        type: 'POST',
        data: this.getProperties('email', 'password')
      }).then(function(response) {
        self.set('response', response);
        self.set('auth_token', response.auth_token);
        var currentUser = response.user;
        currentUser.id = 'current';
        self.store.createRecord('user', currentUser);
        self.set('currentUser', self.store.find('user', 'current'));
        self.set('role', currentUser.role);
        self.transitionToRoute('dashboard');
      });
    },
    recover_password: function() {
      var self = this;
      ajax('/api/password_reset', {
        type: 'POST',
        data: {user: {email: this.get('email')}}
      }).then(function(response) {
        alert(self.get('email'));
        self.set('email', null);
      });
    },
    toggle_recovery: function() {
      Ember.$('.password-recovery').toggle();
      Ember.$('.login-modal').toggle();
    }
  }
});
