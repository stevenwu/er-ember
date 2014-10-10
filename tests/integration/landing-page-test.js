import Ember from 'ember';
import startApp from '../helpers/start-app';

var App, server;

function httpResponse(code, headers, body) {
  return [
    code,
    {'Content-Type': headers},
    JSON.stringify(body)
  ];
}

function parsePostData(query) {
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

var user = {
  id: 1,
  username: 'jimi',
  email: 'jimi@example.com',
  password: 'secret',
  role: 'user'
};

module('Integration - Navigation', {
  setup: function() {
    App = startApp();
    var auth_token = {"authenticity_token":"CLp4LfAF5XnJbCFPVEtzPpG7cga1u0NPgivqwmLXIgk="};
    server = new Pretender(function() {
      this.get('api/csrf', function(request) {
        return httpResponse(200, 'application/json', auth_token);
      });
      this.post('api/users', function(request) {
        var data = parsePostData(request.requestBody);
        return httpResponse(201, 'application/json', {user: {id: user.id, email: user.email, role: user.role}});
      });
    });
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
    notEqual(find('h3').text(), 'Attention grabbing headline about prupose of the page and product');
  });
});

test('should be able to sign up', function() {
  visit('/');
  fillIn('input.username', user.username);
  fillIn('input.email', user.email);
  fillIn('input.password', user.password);

  click('button.submit');

  andThen(function() {
    equal(currentURL(), '/dashboard');
  });
});
