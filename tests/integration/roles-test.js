import Ember from 'ember';
import startApp from '../helpers/start-app';

var App, server;

var users = {
  'user@example.com': {
    id: 1,
    email: 'user@example.com',
    password: 'password',
    role: 'user'
  },
  'premium@example.com': {
    id: 2,
    email: 'premium@example.com',
    password: 'password',
    role: 'premium'
  },
  'admin@example.com': {
    id: 3,
    email: 'admin@example.com',
    password: 'password',
    role: 'admin'
  }
};

function parsePostData(query) {
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

module('Integration - Roles', {
  setup: function() {
    var auth_token = {"authenticity_token":"CLp4LfAF5XnJbCFPVEtzPpG7cga1u0NPgivqwmLXIgk="};
    App = startApp();
    server = new Pretender(function() {
      this.get('api/csrf', function(request) {
        return [200, {'Content-Type': 'application/json'}, JSON.stringify(auth_token)];
      });

      this.post('/api/sign_in', function(request) {
        var data = parsePostData(request.requestBody);
        if (data.password === users[data.email].password) {
          return [201, {'Content-Type': 'application/json'}, JSON.stringify({id: users[data.email].id, auth_token: "Gikvpb7_5vy-d8P3G16x", user: users[data.email] })];
        } else {
          return [401, {'Content-Type': 'application/json'}, JSON.stringify({})];
        }
      });
    });
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

test('regular users should not see premium feature', function() {
  visit('/login');
  fillIn('input.email', 'user@example.com');
  fillIn('input.password', 'password');
  click('button.submit');

  andThen(function() {
    equal(find('h3').text(), 'Dashboard');
    equal(find('div.premium-feature').length, 0);
  });
});

test('premium users should see premium features', function() {
  visit('/login');
  fillIn('input.email', 'premium@example.com');
  fillIn('input.password', 'password');
  click('button.submit');

  andThen(function() {
    equal(find('h3').text(), 'Dashboard');
    equal(find('div.premium-feature').length, 1);
  });
});
