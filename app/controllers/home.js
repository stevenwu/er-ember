import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  needs: ['application'],
  auth_token: Ember.computed.alias('controllers.application.auth_token'),
  currentUser: Ember.computed.alias('controllers.application.currentUser'),

  actions: {
    signUp: function() {
      var self = this;
      ajax('api/users', {
        type: 'POST',
        data: {user: this.getProperties('username', 'email', 'password')}
      }).then(function(response) {
        var currentUser = response.user;
        currentUser.id = 'current';
        self.store.createRecord('user', currentUser);
        self.set('currentUser', self.store.find('user', 'current'));
        self.transitionToRoute('dashboard');
      });
    }
  }
});
