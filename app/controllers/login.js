import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  needs: 'application',
  auth_token: Ember.computed.alias('controllers.application.auth_token'),
  current_user: Ember.computed.alias('controllers.application.current_user'),
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
        self.set('role', currentUser.role);
        self.transitionTo('dashboard');
      });
    }
  }
});
