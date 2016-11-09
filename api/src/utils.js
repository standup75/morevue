crypto = require("crypto");

module.exports = {
	hash: (function() {
		var iterations, len;
		len = 128;
		iterations = 12000;
		return function(pwd, salt, fn) {
			if (3 === arguments.length) {
				return crypto.pbkdf2(pwd, salt, iterations, len, 'sha1', fn);
			} else {
				fn = salt;
				return crypto.randomBytes(len, function(err, salt) {
					if (err) {
						return fn(err);
					}
					salt = salt.toString("base64");
					return crypto.pbkdf2(pwd, salt, iterations, len, 'sha1', function(err, hash) {
						if (err) {
							return fn(err);
						}
						return fn(null, salt, hash);
					});
				});
			}
		};
	})(),
	randomString: function(len) {
		var buf = [];
		var chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
		var charlen = chars.length;
		var i = 0;
		while (i < len) {
			buf.push(chars[getRandomInt(0, charlen - 1)]);
			++i;
		}
		return buf.join("");
	},
	checkUniquenessOf: function(Model, field, value, oldValue, callback) {
		var query;
		if (callback == null) {
			callback = oldValue;
			oldValue = null;
		}
		if (value) {
			if (value === oldValue) {
				return callback();
			} else {
				query = {};
				query[field] = value;
				return Model.count(query, function(err, count) {
					if (count > 0) {
						err = "This " + field + " already exists";
					}
					return callback(err);
				});
			}
		} else {
			return callback("no email specified");
		}
	},
	sendEmail: function(emailDetails, callback) {
		// Need to implement sending email, using sendGrid for example
		console.log(emailDetails);
		callback();
	},
};

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};