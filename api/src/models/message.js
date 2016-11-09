var mongoose = require("mongoose");
var config = require("../config/variables");

var messageSchema = new mongoose.Schema({
  title: String,
  body: String,
  updatedAt: Date,
  createdAt: Date
});

messageSchema.pre("validate", (next) => {
	this.updatedAt = new Date;
	if (!this.createdAt) {
		this.createdAt = new Date;
	}
	next()
});

var Message = mongoose.model("messages", messageSchema);
module.exports = Message;
