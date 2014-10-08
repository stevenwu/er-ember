import Ember from 'ember';

export default Ember.Controller.extend({
  currentUser: function() {
    return this.store.find('user', 'current');
  }.property()
});
