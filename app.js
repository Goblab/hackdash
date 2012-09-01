
/**
 * Module dependencies.
 */

var express = require('express')
  , passport = require('passport')
  , keys = require('./keys.json')
  , http = require('http');

/*
 * DB
 */

var redis = require('redis')
  , RedisStore = require('connect-redis')(express)
  , client = exports.client = redis.createClient();

setTimeout(function(){
	client.save();
}, 5 * 60 * 1000);

/*
 * Auth
 */

require('./auth');

/*
 * Application config
 */

var app = exports.app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(keys.session));
  app.use(express.session({secret: keys.session, store: new RedisStore }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./routes');

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});

process.on('uncaughtException', function(err){
  console.log(err);
});
