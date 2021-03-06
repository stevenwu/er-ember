import Ember from 'ember';
import startApp from '../helpers/start-app';

var App, server;
var user = {
  id: 1,
  email: 'jimi@example.com',
  password: 'secret'
};

function parsePostData(query) {
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

module('Integration - Authorization', {
  setup: function() {
    var auth_token = {"authenticity_token":"CLp4LfAF5XnJbCFPVEtzPpG7cga1u0NPgivqwmLXIgk="};
    App = startApp();
    server = new Pretender(function() {
      this.get('api/csrf', function(request) {
        return [200, {'Content-Type': 'application/json'}, JSON.stringify(auth_token)];
      });

      this.post('/api/sign_in', function(request) {
        var data = parsePostData(request.requestBody);
        if (data.password === user.password) {
        return [201, {'Content-Type': 'application/json'}, JSON.stringify({id: 1, auth_token: "Gikvpb7_5vy-d8P3G16x", user: { id: 1, email: 'jimi@example.com', role: 'premium' }})];
        } else {
          return [401, {'Content-Type': 'application/json'}, JSON.stringify({})];
        }
      });

      this.delete('/api/sign_out', function(request) {
        return [200, {'Content-Type': 'application/json'}, JSON.stringify({id: 1, status: 'ok'})];
      });
    });
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

test('should be able to login', function() {
  visit('/');
  click('a:contains("Log In")');
  fillIn('input.email', user.email);
  fillIn('input.password', user.password);
  click('button.submit');

  andThen(function() {
    equal(find('h3').text(), 'Dashboard');
  });
});

test('should sign out', function() {
  visit('/login');
  fillIn('input.email', user.email);
  fillIn('input.password', user.password);
  click('button.submit');
  click('a.sign-out-link');

  andThen(function() {
    equal(currentURL(), '/');
  });
});
