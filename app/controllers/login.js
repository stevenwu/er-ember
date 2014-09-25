import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  needs: 'application',
  auth_token: Ember.computed.alias('controllers.application.auth_token'),
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
        self.controllerFor('application').set('auth_token', response.auth_token);
        self.transitionTo('dashboard');
      });
    }
  }
});
