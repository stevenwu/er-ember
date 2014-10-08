import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBinding: ['active'],

  active: function() {
    return this.get('childViews').isAny('active');
  }.property('childViews.@each.active')
});
