import Ember from 'ember';
import startApp from '../helpers/start-app';

var App, server;
var user = {
  reset_password_token: 'fbd57d5aa48183850919f3d9134a4d95139a25aa33325b866d33451ba8df7367',
  password: 'new_password'
};

function parsePostData(query) {
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

function httpResponse(code, headers, body) {
  return [
    code,
    {'Content-Type': headers},
    JSON.stringify(body)
  ];
}

module('Integration - Password Reset', {
  setup: function() {
    var auth_token = {"authenticity_token":"CLp4LfAF5XnJbCFPVEtzPpG7cga1u0NPgivqwmLXIgk="};
    App = startApp();
    server = new Pretender(function() {
      this.get('api/csrf', function(request) {
        return [200, {'Content-Type': 'application/json'}, JSON.stringify(auth_token)];
      });

      this.put('/api/users/update_password', function(request) {
        var data = parsePostData(request.requestBody);
        if (data.reset_password_token === user.reset_password_token) {
          return httpResponse(200, 'application/json', {});
        } else {
          return httpResponse(400, 'application/json', {});
        }
      });
    });
  },
  teardown: function() {
    Ember.run(App, 'destroy');
    server.shutdown();
  }
});

test ('should be able to reset password', function() {
  visit('/password_reset?token=' + user.reset_password_token);
  fillIn('input.password', user.password);
  fillIn('input.password-confirmation', user.password);
  click('button.submit');

  andThen(function() {
    equal(find('.alert').text(), 'Successfully changed password');
  });
});


