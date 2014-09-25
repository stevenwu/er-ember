import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    return this.csrf.fetchToken();
  },
  actions: {
    validSignIn: function() {
      this.transitionTo('dashboard');
    },
    invalidSignIn: function() {
      console.log('Unauthorized !!!!!');
    }
  }
});
