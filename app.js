
/**
 * Module dependencies.
 */

var express = require('express');
var sio = require('socket.io');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'mustache');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.register(".mustache", require('stache'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    locals: {
      node_server_url: 'http://localhost:3000'
    }
  });
});

app.listen(3000);
console.log("Express server listening on port %d", app.address().port);

var socket = sio.listen(app);
var buffer = [];

socket.on('connection', function(client) {
  client.send({ buffer: buffer });
  client.broadcast({ announcement: client.sessionId + ' connected' });

  client.on('message', function(message) {
    console.log('message');
    var msg = { message: [client.sessionId, message] };
    buffer.push(msg);
    if (buffer.length > 15) buffer.shift();
    client.broadcast(msg);
  });

  client.on('disconnect', function() {
    client.broadcast({ announcement: client.sessionId + ' disconnected' });
  });
});