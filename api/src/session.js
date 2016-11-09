const User = require("./models/user");

module.exports = {
  isAdmin(req, res, next) {
    return isRole("admin", req, res, next);
  },
  isCurrent(req, res, next) {
    if (req.user && req.user.id === req.params.user) {
      return next();
    } else {
      return res.send(401);
    }
  },
  isCurrentOrAdmin(req, res, next) {
    const fakeRes = {
      send: () => this.isAdmin(req, res, next),
    }
    return isCurrent(req, fakeRes, next);
  },
  isLoggedIn(req, res, next) {
    if (req.user) {
      return next();
    } else {
      return res.send(401);
    }
  }
};

function isRole(role, req, res, next) {
  const user = req.user;
  if (user) {
    return User.findOne({
      email: user.email
    }, function(err, user) {
      if (user.roles && user.roles.indexOf(role) > -1) {
        return next(err, user);
      } else {
        return res.send(401);
      }
    });
  } else {
    return res.send(401);
  }
};
