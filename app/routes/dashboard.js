import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
    // controller.set('current_user', this.controllerFor('application').get('current_user'));
    // controller.set('current_user', this.store.find('currentUser').get('firstObject'));
  }
});
