var LocalStrategy, User;

User = require("../models/user");

LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
  }, function(email, password, done) {
    User.findOne({
      email: email
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: "Unknown email.",
          field: "email"
        });
      }
      user.isValidPassword(password, done);
    });
  }));
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};