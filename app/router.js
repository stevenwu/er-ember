import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('about');
  this.route('login');
  this.route('dashboard');
  this.resource('users', function() {
    this.route('show', { path: '/:user_id' });
  });
  this.route('users/show');
  this.route('dashboard');
});

export default Router;
