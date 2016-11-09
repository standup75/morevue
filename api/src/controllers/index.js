var passport = require('passport');

exports.index = function(req, res) {
	return res.send(200, {
		message: "Welcome to the Morevue API"
	});
};

exports.login = function(req, res, next) {
	passport.authenticate("local", function(err, user, info) {
		if (err || !user) {
			return res.send(401, {
				error: err || (info != null ? info.message : void 0) || "",
				field: info != null ? info.field : void 0
			});
		}
		req.login(user, function(err) {
			if (err && Object.keys(err).length) {
				return res.send(500, {
					error: "Could not log you in",
					details: err || ""
				});
			}
			res.send(201, user);
		});
	})(req, res, next);
};

exports.logout = function(req, res) {
	req.logout();
	res.send(200);
};
