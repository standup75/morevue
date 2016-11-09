var utils = require("../utils");
var base = require("./base");
var mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
	createdAt: Date,
	updatedAt: Date,
	email: {
		type: String,
		required: true,
		unique: true
	},
	salt: String,
	hash: String,
	roles: [String],
	name: String
});

userSchema.statics.signup = function(user, done) {
	return utils.hash(user.password, function(err, salt, hash) {
		if (err) {
			return done(err);
		}
		user.hash = hash;
		user.salt = salt;
		return User.create(user, function(err, user) {
			return done(err, user);
		});
	});
};

userSchema.methods.isValidPassword = function(password, done) {
	return utils.hash(password, this.salt, function(err, hash) {
		if (err) {
			return done(err);
		}
		if (hash.toString() === this.hash) {
			return done(null, this);
		}
		return done(null, false, {
			message: "Incorrect password",
			field: "password"
		});
	}.bind(this));
};

userSchema.pre("save", function(next) {
	if (!this.createdAt) {
		this.createdAt = this.updatedAt = new Date;
	} else {
		this.updatedAt = new Date;
	}
	return next();
});

userSchema.statics.publicFields = [ "email", "roles", "name" ];
userSchema.statics.names = {
  singular: "user",
  plural: "users"
};
const User = base(userSchema);
module.exports = User;
