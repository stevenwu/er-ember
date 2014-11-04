import Ember from 'ember';

export default Ember.Controller.extend({
  currentUser: function() {
    return this.session.get('user');
  }.property()
});
