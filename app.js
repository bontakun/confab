/**
 * Module dependencies.
 */
var express = require('express');
var sio = require('socket.io');
var util = require('util');
var irc = require('irc');

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
var clients = {};

socket.sockets.on('connection', function(client) {
  
  client.on('message', function(message) {
    console.log('message: %s', util.inspect(message));
    if (message.connect && message.connect.name) {
      connect(client, client.id, message.connect.name, message.connect.channel);
      
    } else if (!message.connect) {
      if (clients[client.id])
        clients[client.id].proxy.say('#public', message);
    }
  });

  client.on('disconnect', function() {
    console.log('disconnecting');
    disconnect(client.id);
  });
});

function connect(client, sessionId, nickname, channel) {
  clients[sessionId] = { name: nickname };
  var proxy = new irc.Client('irc.gatewayy.net', nickname, {
    port: 6697, secure: true,
    debug: false, showErrors: true,
    channels: [channel]
  });

  proxy.addListener('message', function (from, to, msg) {
    client.json.send({ name: from, message: msg });
  });
  clients[sessionId].proxy = proxy;
}

function disconnect(client, sessionId) {
  if (clients[sessionId]) {
      client.json.send({ name: clients[sessionId].name, message: "disconnected" });
      clients[sessionId].proxy.disconnect("disconnected");
    }
}
