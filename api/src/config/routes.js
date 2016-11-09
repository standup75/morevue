var mainController = require('../controllers');
var userController = require('../controllers/users');
var messageController = require('../controllers/messages');
var session = require('../session');

module.exports = function(server) {
	server.get('/', mainController.index);
	server.post('/login', mainController.login);
	server.post('/logout', mainController.logout);
	server.post('/users', userController.create);
	server.get('/users', userController.index);
	server.put('/users', [session.isLoggedIn, userController.update]);
	server.get('/users/count', userController.count);
	server.get('/users/current', userController.current);
	server.post('/users/forgot', userController.forgot);
	server.get('/users/:id', userController.show);
	server.del('/users/:id', [session.isCurrentOrAdmin, userController.destroy]);
};
