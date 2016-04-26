//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var Events = require("./server/Events");
var Player = require("./server/Entities/Player");
var GameState = require("./server/GameState");
var Universe = require("./server/Entities/Universe");
var Client = require("./server/Client");
var Type = require("./server/Type.js");

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));

var App = {
  sockets : [],
  universe : new Universe()
};

App.universe.initialize();

io.on('connection', function (socket) {
  App.sockets.push(socket);
  console.log("Got connection (" + App.sockets.length + " total connected)");
  
  socket.on("disconnect", function() {
    App.sockets.splice(App.sockets.indexOf(this.socket), 1);
    console.log("Client disconnected (" + App.sockets.length + " still connected)");
  });
  
  // Load player
  var player = new Player();
  player.initialize();
  player.location = {
      type : Type.SECTOR,
      id : 1
  };
  
  var client = new Client();
  client.socket = socket;
  client.player = player;
  client.universe = App.universe;
  client.state = GameState.NO_STATE;
  
  // Bind events to handlers
  for (var category in Events ) {
    var eventList = new Events[category](client);
    for (var event in eventList.handlers ) {
      console.log("binding " + category + ", " + event);
      client.socket.on(event, eventList.handlers[event]);
    }
  }
  
  socket.emit("player", player);
  socket.emit("message", "Welcome to Wilderland");
  
  client.setState(GameState.ENTERING_SECTOR, {
    "sector" : App.universe.getSector(player.location.id).buildForClient(client)
  });
  // do some processing, then play
  client.setState(GameState.IN_SPACE, {
    "sector" : App.universe.getSector(player.location.id).buildForClient(client)
  });
});

function broadcast(event, data) {
  Wilderland.sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Wilderland server listening at", addr.address + ":" + addr.port);
});
