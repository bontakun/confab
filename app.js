
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
      node_server_url: 'http://confab.jipsta.com'
    }
  });
});

app.listen(35711);
console.log("Express server listening on port %d", app.address().port);

var socket = sio.listen(app);
var buffer = [];
var clients = {};

socket.on('connection', function(client) {
  
  if (buffer.length > 0) {
    client.send({buffer: buffer});
  }

  client.on('message', function(message) {
    if (message.connect) {
      clients[client.sessionId] = message.connect.name;
      message = "connected"
    }

    var msg = {
      name: clients[client.sessionId],
      message: message
    };

    buffer.push(msg);
    if (buffer.length > 15) buffer.shift();
    client.broadcast(msg);
  });

  client.on('disconnect', function() {
    if (clients[client.sessionId]) {
      client.broadcast({
        name: clients[client.sessionId],
        message: "disconnected"
      });
    }
  });
});
