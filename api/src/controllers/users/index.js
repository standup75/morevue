const User = require("../../models/user");
const session = require("../../session");
const utils = require("../../utils");

module.exports = {
	index: function(req, res) {
		var find, like, sort;
		const limit = Math.min(1000, req.query.limit || 10);
		const offset = req.query.offset || 0;
		if (req.query.like) {
			like = new RegExp("^" + req.query.like, "i");
			find = {
				$or: [
					{
						email: like
					}, {
						name: like
					}
				]
			};
			sort = {
				email: 1
			};
		} else {
			find = {};
			if (req.query.find) {
				_.assign(find, JSON.parse(req.query.find.replace("__", "$")));
			}
			if (req.query.sort) {
				sort = JSON.parse(req.query.sort.replace("__", "$"));
			}
			sort || (sort = {
				createdAt: -1
			});
		}
		return User.find(find).sort(sort).limit(limit).skip(offset).exec(function(err, users) {
			if (err) {
				return res.send(500);
			} else {
				return res.send(200, {users: users});
			}
		});
	},
	create: function(req, res) {
		var signup = function(err, count) {
			if (count === 0) {
				return User.signup({email: req.params.email, password: req.params.password}, function(err, user) {
					if (err) {
						return res.send(500, {
							error: "Sorry, could not sign up",
							details: err || ""
						});
					}
					return req.login(user, function(err) {
						if (err && Object.keys(err).length) {
							return res.send(500, {
								error: "Could not log in with the new user",
								details: err || ""
							});
						}
						return res.send(201, user);
					});
				});
			} else {
				return res.send(400, {
					error: "A user with this email address already exists",
					field: "email",
					details: err || ""
				});
			}
		};
		if (typeof req.params.email === "string" && typeof req.params.password === "string") {
			User.count({
				email: req.params.email
			}, signup);
		} else {
			res.send(500, {
				error: "Wrong parameters"
			});
		}
	},
	show: function(req, res) {
		return getUserByEmail(req.params.user, res, function(user) {
			res.send(200, {users: users});
		});
	},
	update: function(req, res) {
		const user = req.user;
		if (!(req.params.password && req.params.newPassword)) {
			return res.send(401, {
				error: "current password or new password not found",
			});
		}
		return user.isValidPassword(req.params.password, function(err, user, info) {
			if (err) {
				return res.send(500, {error: "Something went wrong when checking the password", details: err});
			} else if (user) {
				return utils.hash(req.params.newPassword, function(err, salt, hash) {
					user.hash = hash;
					user.salt = salt;
					return user.save(function(err) {
						if (err) {
							return res.send(401, {
								error: "Could not update the password",
								details: err
							});
						} else {
							return res.send(201);
						}
					});
				});
			} else {
				return res.send(401, {
					error: "Wrong password"
				});
			}
		});
	},
	destroy: function(req, res) {
		session.isAdmin(req, res, function() {
			return User.findOne({
				email: req.params.user
			}, function(err, user) {
				if (err) {
					return res.send(401, {
						details: err || ""
					});
				} else if (!user) {
					return res.send(200);
				} else {
					user.remove();
					return res.send(201);
				}
			});
		});
	},
	count: function(req, res) {
		return User.count().exec(function(err, count) {
			if (err) {
				return res.send(500);
			} else {
				return res.send(200, {
					value: count
				});
			}
		});
	},
	current: function(req, res) {
		const user = req.user;
		const response = user ? user : {
			message: "not logged in"
		};
		return res.send(200, response);
	},
	forgot: function(req, res) {
		var userEmail;
		userEmail = req.params.email;
		if (!userEmail) {
			return res.send(401, {
				error: "No email address found"
			});
		}
		return getUserByEmail(userEmail, res, function(user) {
			var newPwd;
			newPwd = utils.randomString(5);
			return utils.hash(newPwd, function(err, salt, hash) {
				user.hash = hash;
				user.salt = salt;
				user.needPasswordUpdate = true;
				return user.save(function(err) {
					if (err) {
						return res.send(500, {
							error: "Could not update the password"
						});
					} else {
						return utils.sendEmail({
							to: user.email,
							from: "\"Morevue\"<admin@morevue.com>",
							subject: "Your new password",
							text: "You can now log in with " + newPwd
						}, function(err, json) {
							if (err) {
								console.log("password for " + user.email + " is now " + newPwd);
								return res.send(500, {
									details: err || ""
								});
							} else {
								return res.send(201);
							}
						});
					}
				});
			});
		});
	}
};

function getUserById(id, res, callback) {
	if (req.user && req.user.id === id) {
		return callback(user)
	}
	return getUser({
		_id: id
	}, res, callback);
};

function getUserByEmail(user, res, callback) {
	return getUser({
		email: user
	}, res, callback);
};

function getUser(query, res, callback) {
	return User.findOne(query, function(err, user) {
		if (err) {
			return res.send(500, {
				error: "Something wrong happened while retrieving user '" + user + "'",
				details: err || ""
			});
		} else {
			if (user) {
				return callback(user);
			} else {
				return res.send(404);
			}
		}
	});
};
