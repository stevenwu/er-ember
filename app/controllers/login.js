import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
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
        self.transitionTo('dashboard');
      });
    }
  }
});
