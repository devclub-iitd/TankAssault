
var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var util = require('util');
//var players = [];
var Player = require("./js/Player");
//Player.maze();
var rooms = [];
//Player.maze();
rooms[0] = [];
rooms[0].push(Player.rows);
rooms[0].push(Player.columns);
rooms[0].push(Player.grid);
rooms[0].push(Player.mazeHeight);
var roomno = 1;
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
  
 // Increase roomno if 4 clients are present in a room
  if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 3)
    {
	  //Player = require("./js/Player");
      Player.expo();
      roomno++;
	  // define some maximum no of rooms
	  //if (roomno > 100000007) roomno = 0;
      rooms[roomno-1] = [];
      rooms[roomno-1].push(Player.rows);
      rooms[roomno-1].push(Player.columns);
      rooms[roomno-1].push(Player.grid);
      rooms[roomno-1].push(Player.mazeHeight);
	  console.log("a new room has been created with row = "+Player.rows);
    }
    console.log("rooms array: " + rooms[roomno-1][0] + " " + rooms[roomno-1][1] + " " +rooms[roomno-1][3]);
  client.join("room-"+roomno);

  // Send this event to everyone in room.
  io.sockets.in("room-"+roomno).emit("connectToRoom",'You are in room: ' + roomno + ' and your id is ' + client.id);

  // Maze design
  this.in("room-"+roomno).emit("Player", {
    rows: Player.rows,
    columns: Player.columns,
    //backgroundColor: Player.backgroundColor,
    //wallColor: Player.wallColor,
    grid: Player.grid,
    mazeHeight: Player.mazeHeight
  });

  client.on("renew player", onRenewPlayer);

  //client disconnected
  client.on("disconnect", onClientDisconnect);

  // new player message
  client.on("new player", onNewPlayer);

  // move player message
  client.on("move player", onMovePlayer);

  // shoot message
  client.on("shoot player", onShootPlayer);
  
});

// Socket client has disconnected
function onClientDisconnect() {
  util.log("Player has disconnected: "+this.id+" (server.js message)");
var r;
for(var i = 0;i<roomno;i++){
  var removePlayer = playerById(this.id,i+1);
  if(removePlayer){
    r = i+1;
    break;
  }
}
  // Player not found
  if (!removePlayer) {
    util.log("Player not found: "+this.id+" (server.js message)");
    return;
  };

  // Remove player from players array
  rooms[r-1].splice(rooms[r-1].indexOf(removePlayer), 1);

  // Broadcast removed player to connected socket clients
  this.broadcast.in("room-"+r).emit("remove player", {id: this.id});
};

// New player has joined
function onNewPlayer(data) {
  // Create a new player
	console.log("on server.js onNewPlayer function called.");
  var newPlayer = new Player.Player(); // same as new Tank();
  newPlayer.id = this.id;
  newPlayer.roomno = roomno;
  /*newPlayer.tankCenterX = data.x;
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
  newPlayer.reloading = data.reloading;*/
  Player.Tank(newPlayer); // Same as initializeTank(aTank)
  
  // We had to use this new way of initialize because of require and exports method of using functions of other javascript.

  // Broadcast new player to connected socket clients
  io.sockets.in("room-"+roomno).emit("new player", {
    id: newPlayer.id,
    roomno: newPlayer.roomno,
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
  for (i = 4; i < rooms[roomno-1].length; i++) {
    existingPlayer = rooms[roomno-1][i];
    this.emit("new player", {
      id: existingPlayer.id,
      roomno: existingPlayer.roomno,
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
  rooms[roomno-1].push(newPlayer);
};
// Reinitialised player
function onRenewPlayer(data){
  var renewPlayer = playerById(data.id,data.roomno);

  // Player not found
  if (!renewPlayer) {
    util.log("Player not found: "+data.id+"server.js message");
    return;
  };

      renewPlayer.x = data.tankCenterX;
      renewPlayer.y = data.tankCenterY;
      renewPlayer.rotorX = data.rotorX;
      renewPlayer.rotorY = data.rotorY;
      renewPlayer.angle = data.rotorAngle;
      renewPlayer.bullet = data.bullet;
      renewPlayer.upPressed = data.upPressed;
      renewPlayer.downPressed = data.downPressed;
      renewPlayer.rightPressed = data.rightPressed;
      renewPlayer.leftPressed = data.leftPressed;
      renewPlayer.leftClick = data.leftClic;
      renewPlayer.reloading = data.reloading;

  io.sockets.in("room-"+data.roomno).emit("renew player", {
      id: renewPlayer.id,
      x: renewPlayer.tankCenterX,
      y: renewPlayer.tankCenterY,
      rotorX: renewPlayer.rotorX,
      rotorY: renewPlayer.rotorY,
      angle: renewPlayer.rotorAngle,
      bullet: renewPlayer.bullet,
      upPressed: renewPlayer.upPressed,
      downPressed: renewPlayer.downPressed,
      rightPressed: renewPlayer.rightPressed,
      leftPressed: renewPlayer.leftPressed,
      leftClick: renewPlayer.leftClick,
      reloading: renewPlayer.reloading
    });

}

// Player has moved
function onMovePlayer(data) {
  // Find player in array
  var movePlayer = playerById(this.id,data.roomno);

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
  movePlayer.roomno = data.roomno;
  moveTank(movePlayer,data.roomno);
};

function onShootPlayer(data){
  // Find player in array
  var shootPlayer = playerById(this.id,data.roomno);

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
  shootPlayer.roomno = data.roomno;

  io.sockets.in("room-"+data.roomno).emit("shoot player", {
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
    leftClick1: shootPlayer.leftClick,
    reloading: shootPlayer.reloading
  });
}
/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id,roomno) {
  var i;
  for (i = 4; i < rooms[roomno-1].length; i++) {
    if (rooms[roomno-1][i].id == id)
      return rooms[roomno-1][i];
  }

  return false;
};


server.listen(port,function(){
  console.log("listening");
});

/////////////////////////////////////////////
////////     Movements define       /////////
/////////////////////////////////////////////

function moveTank(aTank,roomn) {
  var gridsize = rooms[roomn-1][3]/rooms[roomn-1][0];
  var i = Math.floor(aTank.tankCenterX / gridsize);
  var j = Math.floor(aTank.tankCenterY / gridsize);
  var gridvar = rooms[roomn-1][2];
  var currentPlayerGrid = gridvar[0][0];
  if(!isNaN(i) && !isNaN(j)) currentPlayerGrid = gridvar[i][j];
    
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
  io.sockets.in("room-"+roomn).emit("move player", {
    id: aTank.id,
    x: aTank.tankCenterX,
    y: aTank.tankCenterY,
    rotorX: aTank.rotorX,
    rotorY: aTank.rotorY,
    angle: aTank.rotorAngle,
  });
}
