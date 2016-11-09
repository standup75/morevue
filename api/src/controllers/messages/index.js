var Message = require('../../models/message');

module.exports = {
	index: function(req, res){
		Message.find().sort('-date').exec(function (err,data) {
			if (err) {
				return res.send(500, {error: err});
			}
			res.send(data);
		});
	},
	create: function(req, res){
		var message = new Message;
		message.title = req.params.title;
		message.body = req.params.content;
		message.save((err, msg) => res.send(201, {message: msg}));
	}
};