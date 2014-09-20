import Ember from 'ember';
import startApp from '../helpers/start-app';

var App, server;

module('Integration - Pretender', {
  setup: function() {
    var users = [
      {id: 1, email: 'jimi@example.com'},
      {id: 2, email: 'miles@example.com'},
      {id: 3, email: 'jane@example.com'}
    ];
    App = startApp();
    server = new Pretender(function() {
      this.get('/api/users', function(request) {
        return [200, {'Content-Type': 'application/json'}, JSON.stringify({users: users})];
      });
    });
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

test('should list all users', function() {
  visit('/users');
  andThen(function() {
    equal(find('a:contains("jimi@example.com")').length, 1);
    equal(find('a:contains("miles@example.com")').length, 1);
    equal(find('a:contains("jane@example.com")').length, 1);
  });
});

test('should navigate to user page', function() {
  visit('/users');
  click('a:contains("jimi@example.com")');
  andThen(function() {
    equal(find('h3').text(), 'jimi@example.com');
  });
});
