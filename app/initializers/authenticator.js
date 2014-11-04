import Ember from 'ember';

export function initialize(/* container, application */) {
  // application.inject('route', 'foo', 'service:foo');
}

export default {
  name: 'session',
  after: 'store',

  initialize: function(container, application) {
    var store = container.lookup('store:main'),
        userId = sessionStorage.getItem('userId'),
        authToken = sessionStorage.getItem('auth_token');

    var session = Ember.Object.extend({
      init: function() {
        this.set('authToken', authToken);
        this.set('userId', userId);

        if (userId) {
          this.set('user', store.find('user', userId));
        }
      },
      // authToken: null,
      // userId: null,
      // user: null,

      authTokenChanged: function() {
        sessionStorage.setItem('auth_token', this.get('authToken'));
      }.observes('authToken'),

      userIdChanged: function() {
        sessionStorage.setItem('userId', this.get('userId'));
      }.observes('userId')
    });

    container.register('session:main', session, { singleton: true});
    application.inject('route', 'session', 'session:main');
    application.inject('controller', 'session', 'session:main');
  }
};
