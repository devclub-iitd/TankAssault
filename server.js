
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


io.on('connection', function(client){
  console.log('Client connected' + client.id);
  util.log("New player has connected: " + client.id);
  
  // Maze design
  this.emit("Player", {
    rows: Player.rows,
    columns: Player.columns,
    //backgroundColor: Player.backgroundColor,
    //wallColor: Player.wallColor,
    grid: Player.grid,
    mazeHeight: Player.mazeHeight
  });

  
  //client disconnected
  client.on("disconnect", onClientDisconnect);

  // new player message
  client.on("new player", onNewPlayer);

  // move player message
  client.on("move player", onMovePlayer);

  // shoot message
  client.on("shoot Player", onShootPlayer);
  
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
  newPlayer.tankCenterX = data.x;
  newPlayer.tankCenterY = data.y;
  newPlayer.rotorX = data.rotorX;
  newPlayer.rotorY = data.rotorY;
  newPlayer.rotorAngle = data.angle;
  newPlayer.bullet = data.bulletArray;
  newPlayer.upPressed = data.upPressed;
  newPlayer.downPressed = data.downPressed;
  newPlayer.leftPressed = data.leftPressed;
  newPlayer.rightPressed = data.rightPressed;
  newPlayer.leftClick = data.leftClick;
  newPlayer.reloading = data.reloading;
  Player.Tank(newPlayer); // Same as initializeTank(aTank)

  // We had to use this new way of initialize because of require and exports method of using functions of other javascript.

  // Broadcast new player to connected socket clients
  io.sockets.emit("new player", {
    id: newPlayer.id,
    x: newPlayer.tankCenterX,
    y: newPlayer.tankCenterY,
    rotorX: newPlayer.rotorX,
    rotorY: newPlayer.rotorY,
    angle: newPlayer.rotorAngle,
    bulletArray: newPlayer.bullet,
    bulletShot: newPlayer.bulletShot,
    bulletPack: newPlayer.bulletPack
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
      bulletArray: existingPlayer.bullet,
      bulletShot: newPlayer.bulletShot,
      bulletPack: newPlayer.bulletPack
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
  movePlayer.upPressed = data.upPressed;
  movePlayer.downPressed = data.downPressed;
  movePlayer.rightPressed = data.rightPressed;
  movePlayer.leftPressed = data.leftPressed;
  moveTank(movePlayer)
};

function onShootPlayer(data){
  // Find player in array
  var shootPlayer = playerById(this.id);

  // Player not found
  if (!shootPlayer) {
    util.log("Player not found: "+this.id+"server.js message");
    return;
  };

  shootPlayer.leftClick = data.leftClick;
  shootPlayer.reloading = data.reloading;
  shootPlayer.bulletShot = data.bulletShot;
  shootPlayer.bulletPack = data.bulletPack;
  shootPlayer.bulletReload = data.bulletReload;
  shootPlayer.bullet = data.bullet;

  io.sockets.emit("shoot player", {
    id: shootPlayer.id,
    x: shootPlayer.tankCenterX,
    y: shootPlayer.tankCenterY,
    rotorX: shootPlayer.rotorX,
    rotorY: shootPlayer.rotorY,
    angle: shootPlayer.rotorAngle,
    bullet: shootPlayer.bullet,
    bulletPack: shootPlayer.bulletPack,
    bulletShot: shootPlayer.bulletShot,
    bulletReload: shootPlayer.bulletReload,
    leftClick: shootPlayer.leftClick,
    reloading: shootPlayer.reloading
  });
}
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

/////////////////////////////////////////////
////////     Movements define       /////////
/////////////////////////////////////////////

function moveTank(aTank) {
  var gridsize = Player.mazeHeight/Player.rows;
  var i = Math.floor(aTank.tankCenterX / gridsize);
  var j = Math.floor(aTank.tankCenterY / gridsize);
  var currentPlayerGrid = Player.grid[0][0];
  if(!isNaN(i) && !isNaN(j)) currentPlayerGrid = Player.grid[i][j];
    
  wallLeft = i*gridsize;
  wallRight = (i+1)*gridsize;
  wallTop = j*gridsize;
  wallBottom = (j+1)*gridsize;

  // fine adjustments
  if (currentPlayerGrid.rightWall && (aTank.tankCenterX + aTank.rotorLength > wallRight)) {
    // do something
    aTank.rotorX -= ((aTank.tankCenterX + aTank.rotorLength) - wallRight);
  }
  else if (currentPlayerGrid.leftWall && (aTank.tankCenterX - aTank.rotorLength < wallLeft)) {
    // do something
    aTank.rotorX += (wallLeft - (aTank.tankCenterX - aTank.rotorLength));
  }

  if (currentPlayerGrid.bottomWall && (aTank.tankCenterY + aTank.rotorLength > wallBottom)) {
    // do something
    aTank.rotorY -= ((aTank.tankCenterY + aTank.rotorLength) - wallBottom);
  }
  else if (currentPlayerGrid.topWall && (aTank.tankCenterY - aTank.rotorLength < wallTop)) {
    // do something
    aTank.rotorY += (wallTop - (aTank.tankCenterY - aTank.rotorLength));
  }

  if (aTank.rightPressed === true){
    aTank.rotorAngle += 3;
    aTank.rotorAngle = aTank.rotorAngle % 360;
      }

  else if (aTank.leftPressed === true) {
    aTank.rotorAngle -= 3;
    if(aTank.rotorAngle < 0){
      aTank.rotorAngle+=360;
      }
    aTank.rotorAngle = aTank.rotorAngle % 360;
  }
  if (aTank.upPressed) {
    if (!currentPlayerGrid.topWall || (currentPlayerGrid.topWall && aTank.tankCenterY  - aTank.rotorLength > wallTop + aTank.dDist)) {
      // Move the tank left
      aTank.rotorY -= Math.sin((aTank.rotorAngle) * Math.PI / 180) * (aTank.dDist);
      aTank.rotorX -= Math.cos((aTank.rotorAngle) * Math.PI / 180) * (aTank.dDist);
    }
    else if (aTank.tankCenterY - aTank.rotorLength > wallTop) {
      aTank.rotorY += ((aTank.tankCenterY - aTank.rotorLength) - wallTop );
    }
    else if (aTank.tankCenterY + aTank.rotorLength < wallBottom) {
      aTank.rotorY += (wallBottom - (aTank.tankCenterY + aTank.rotorLength));
    }
    else {
      // tank boundary on wall
      // do nothing
    }
  }
  else if (aTank.downPressed) {
    if (!currentPlayerGrid.bottomWall || (currentPlayerGrid.bottomWall && aTank.tankCenterY  + aTank.rotorLength < wallBottom - aTank.dDist)) {
      // Move the tank left

      aTank.rotorY += Math.sin((aTank.rotorAngle) * Math.PI / 180) * (aTank.dDist);
      aTank.rotorX += Math.cos((aTank.rotorAngle) * Math.PI / 180) * (aTank.dDist);
    }
    else if (aTank.tankCenterY + aTank.rotorLength < wallBottom) {
      aTank.rotorY -= (wallBottom - (aTank.tankCenterY + aTank.rotorLength));
    }
    else if (aTank.tankCenterY - aTank.rotorLength > wallTop) {
      aTank.rotorY -= ((aTank.tankCenterY - aTank.rotorLength) - wallTop );
    }
    else {
      // tank boundary on wall
      // do nothing
    }
  }

  aTank.tankCenterX = aTank.rotorX + aTank.rotorLength / 2;
  aTank.tankCenterY = aTank.rotorY + aTank.rotorWidth / 2;

  // Broadcast updated position to connected socket clients
  io.sockets.emit("move player", {
    id: aTank.id,
    x: aTank.tankCenterX,
    y: aTank.tankCenterY,
    rotorX: aTank.rotorX,
    rotorY: aTank.rotorY,
    angle: aTank.rotorAngle,
  });
}
