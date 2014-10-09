import Ember from 'ember';
import startApp from '../helpers/start-app';

var App, server;

module('Integration - Navigation', {
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
    equal(find('h1').text(), 'Attention grabbing headline about purpose of the page and product');
  });
});

test('should navigate to about page', function() {
  visit('/');
  click('a:contains("About")');
  andThen(function() {
    equal(find('h3').text(), 'About Oxford Circus');
  });
});

test('allow navigation back to root from another page', function() {
  visit('/about');
  click('a:contains("Stamford")');
  andThen(function() {
    notEqual(find('h3').text(), 'About Oxford Circus');
  });
});
