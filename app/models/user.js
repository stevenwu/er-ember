import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr(),
  role: DS.attr(),

  isPremiumUser: function() {
    return this.get('role') === 'premium';
  }.property('role')
});
