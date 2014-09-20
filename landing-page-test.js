import Ember from 'ember';
import startApp from '../helpers/start-app';

var App;

module('Integration - Landing Page', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('should welcome user', function() {
  visit('/');
  andThen(function() {
    equal(find('h2').text(), 'Welcome to Oxford Circus');
  });
});
