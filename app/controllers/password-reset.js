import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Controller.extend({
  queryParams: ['token'],
  hidden: true,
  alertDanger: false,
  alertSuccess: false,
  alertMessage: function() {
    if (this.get('alertSuccess')) {
      return 'Successfully changed password';
    } else {
      return "Your passwords don't match";
    }
  }.property('alertDanger', 'alertSuccess'),
  token: null,
  password: null,
  passwordConfirmation: null,
  actions: {
    change_password: function() {
      var self = this;
      if (self.get('password') !== self.get('passwordConfirmation')) {
        self.set('hidden', false);
        self.set('alertDanger', true);
        return;
      }

      ajax('/api/users/update_password', {
        type: 'PUT',
        data: {user: {reset_password_token: self.get('token'),
                      password: self.get('password'),
                      password_confirmation: self.get('passwordConfirmation')}}
      }).then(function(response) {
        self.set('hidden', false);
        self.set('password', null);
        self.set('passwordConfirmation', null);
        self.set('alertDanger', false);
        self.set('alertSuccess', true);
      });
    }
  }
});
