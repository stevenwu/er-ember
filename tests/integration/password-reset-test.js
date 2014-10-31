import Ember from 'ember';
import startApp from '../helpers/start-app';

var App, server;
var USER = {
  reset_password_token: 'fbd57d5aa48183850919f3d9134a4d95139a25aa33325b866d33451ba8df7367',
  password: 'new_password',
  raw_token: 'ys5L7Bnmwwh-s7zd9igL'
};

function parsePostData(query) {
  var result = {};
  var decoded = decodeURIComponent(query);
  decoded.split('&').forEach(function(part) {
    var item = part.split('=');
    result[item[0]] = item[1];
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

function isValidResetToken(rawToken, user) {
  if (rawToken === user.raw_token) {
    return true;
  } else {
    return false;
  }
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

        if (isValidResetToken(data["user[reset_password_token]"], USER)) {
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
  visit('/password_reset?token=' + USER.raw_token);
  fillIn('input.password', USER.password);
  fillIn('input.password-confirmation', USER.password);
  click('button.submit');

  andThen(function() {
    equal(find('.alert').text(), 'Successfully changed password');
  });
});


