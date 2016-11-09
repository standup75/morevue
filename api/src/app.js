var restify = require('restify');
var mongoose = require('mongoose');
var config = require('./config/variables');
var passport = require('passport');
var CookieParser = require('restify-cookies');
var sessions = require('client-sessions');

function initApp() {
  var server = restify.createServer({
    name: 'Morevue'
  });
  server.use(restify.acceptParser(server.acceptable));
  server.use(restify.bodyParser());
  server.use(restify.queryParser());
  server.use(CookieParser.parse);
  server.use(sessions({
    cookieName: 'morevue_session',
    requestKey: 'session', // do not change otherwise won't work with passport
    secret: config.session.secret,
    duration: 365 * 24 * 60 * 60 * 1000
  }));
  server.use(passport.initialize());
  server.use(passport.session());
  server.use(restify.CORS({
    origins: ['http://localhost:8080', 'http://journal2.standupweb.net'],
    credentials: true,
  }));
  server.use(logRequest);
  require('./config/passport')(passport);
  require('./config/routes')(server);
  server.on('uncaughtException', function (req, res, route, err) {
    console.error(err.stack);
    process.exit(1);
  });

  server.pre(restify.pre.userAgentConnection());
  server.listen(3000, function() {
    console.log('%s listening at %s', server.name, server.url);
  });
}

mongoose.connect(config.db, function(err) {
  if (err) {
    throw err;
  }
  return initApp();
});

mongoose.connection.on("connected", function() {
  return console.log("Mongoose default connection open to " + config.db);
});

mongoose.connection.on("error", function(err) {
  return console.log("Mongoose default connection error: " + err);
});

mongoose.connection.on("disconnected", function() {
  return console.log("Mongoose default connection disconnected");
});

process.on("SIGINT", function() {
  return mongoose.connection.close(function() {
    console.log("Mongoose default connection disconnected through app termination");
    return process.exit(0);
  });
});

function logRequest(req, res, next) {
  if (config.env === "dev") {
    console.log(req.method + ": " + req.headers.host + req.url);
    if (req.params) {
      console.log("params: " + JSON.stringify(req.params));
    }
    if (req.query) {
      console.log("query: " + JSON.stringify(req.query));
    }
  }
  next();
}