import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  auth_token: null,

  actions: {
    signOut: function() {
      var self = this;
      ajax('api/sign_out', {
        type: 'DELETE',
        data: this.getProperties('auth_token')
      }).then(function(response) {
        if (response.status === 'ok') {
          self.set('auth_token', null);
          self.transitionToRoute('/');
        } else {
          console.log('Unexpected Response Status');
        }
      });
    }
  }
});
