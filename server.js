
var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var util = require('util');
var players = [];
var Player = require("./js/Player");
app.use(express.static("public"));
app.set("view engine","ejs");

app.get("/",function(req,res){
  res.render("index");
});
app.get("/Player1.ejs",function(req,res){
  res.render("Player1");
});
app.get("/Player2.ejs",function(req,res){
  res.render("Player2");
});
app.get("/OnlinePlay.ejs",function(req,res){
  res.render("OnlinePlay");
});
app.get("/LocalPlay.ejs",function(req,res){
  res.render("LocalPlay");
});

/*io.on('connection', function(socket) {  
    console.log('Client connected...' + socket.id);
});*/

io.on('connection', function(client){
  console.log('Client connected' + client.id);
  util.log("New player has connected: " + client.id);
  
  /*Client.on('disconnect', function(){
    console.log('Client disconnected');
    util.log("Player has disconnected: "+Client.id+"server.js message");
  });*/

  // Maze design
  this.emit("Player", {
    rows: Player.rows,
    columns: Player.columns,
    backgroundColor: Player.backgroundColor,
    wallColor: Player.wallColor,
    grid: Player.grid,
    mazeHeight: Player.mazeHeight
  });

  
  //client disconnected
  client.on("disconnect", onClientDisconnect);

  // new player message
  client.on("new player", onNewPlayer);

  // move player message
  client.on("move player", onMovePlayer);
  
});

// Socket client has disconnected
function onClientDisconnect() {
  util.log("Player has disconnected: "+this.id+"server.js message");

  var removePlayer = playerById(this.id);

  // Player not found
  if (!removePlayer) {
    util.log("Player not found: "+this.id+"server.js message");
    return;
  };

  // Remove player from players array
  players.splice(players.indexOf(removePlayer), 1);

  // Broadcast removed player to connected socket clients
  this.broadcast.emit("remove player", {id: this.id});
};

// New player has joined
function onNewPlayer(data) {
  // Create a new player
  var newPlayer = new Player.Player(); // same as new Tank();
  newPlayer.id = this.id;
  Player.Tank(newPlayer); // Same as initializeTank(aTank)

  // We had to use this new way of initialize because of require and exports method of using functions of other javascript.

  // Broadcast new player to connected socket clients
  this.broadcast.emit("new player", {
    id: newPlayer.id,
    x: newPlayer.tankCenterX,
    y: newPlayer.tankCenterY,
    rotorX: newPlayer.rotorX,
    rotorY: newPlayer.rotorY,
    angle: newPlayer.rotorAngle,
    bulletArray: newPlayer.bullet
  });

  // Send existing players to the new player
  var i, existingPlayer;
  for (i = 0; i < players.length; i++) {
    existingPlayer = players[i];
    this.emit("new player", {
      id: existingPlayer.id,
      x: existingPlayer.tankCenterX,
      y: existingPlayer.tankCenterY,
      rotorX: existingPlayer.rotorX,
      rotorY: existingPlayer.rotorY,
      angle: existingPlayer.rotorAngle,
      bulletArray: existingPlayer.bullet
    });
  };
  // Add new player to the players array
  players.push(newPlayer);
};

// Player has moved
function onMovePlayer(data) {
  // Find player in array
  var movePlayer = playerById(this.id);

  // Player not found
  if (!movePlayer) {
    util.log("Player not found: "+this.id+"server.js message");
    return;
  };

  // Update player position
  movePlayer.tankCenterX = data.x;
  movePlayer.tankCenterY = data.y;
  movePlayer.rotorX = data.rotorX;
  movePlayer.rotorY = data.rotorY;
  movePlayer.rotorAngle = data.angle;
  movePlayer.bullet = data.bulletArray;

  // Broadcast updated position to connected socket clients
  this.broadcast.emit("move player", {
    id: movePlayer.id,
    x: movePlayer.tankCenterX,
    y: movePlayer.tankCenterY,
    rotorX: movePlayer.rotorX,
    rotorY: movePlayer.rotorY,
    angle: movePlayer.rotorAngle,
    bulletArray: movePlayer.bullet
  });
};


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
  var i;
  for (i = 0; i < players.length; i++) {
    if (players[i].id == id)
      return players[i];
  }

  return false;
};


server.listen(port,function(){
  console.log("listening");
});