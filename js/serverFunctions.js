
// javascript for tank Movement and shooting
// var canvas already declared

var ctx = canvas.getContext("2d");

var	socket,
	remotePlayers,
	localPlayer;

var shootx=true;
var shoot1=true;

var b = 0;

// maze parameters
// border parameters
var borX;
var borY;
// wall parameters
var wallLeft = 0;
var wallRight = 0;
var wallTop = 0;
var wallBottom = 0;
//var theMaze = null;

function init(){
	
	// Initialise socket connection
	//socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});

	// Initialise remote players array
	remotePlayers = [];
	
	if (onceLoaded > 0) {
		// Start listening for events
		//setEventHandlers();
		onceLoaded = -1;
	}
}

maze.prototype.initialize = function() {
	console.log("Got into maze.initialize angle = " +tank1.rotorAngle);
	initializeTank(tank1);
	console.log("after initialize tank angle = " +tank1.rotorAngle);
	for (var i = 0; i < tank1.bulletPack; i++)
    	initializeBullet(tank1, tank1.bullet[i]);

	tank1.bulletReload = true;
	tank1.bulletShot = tank1.bulletPack;
//	init();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function setEventHandlers() {
		// Socket maze
//	console.log("entered setEventHandlers");
	socket.on("Player", onMazeForm);
//	await sleep(2000);
	//console.log("onMazeForm completed");
	// Keyboard
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	// Socket connection successful
	socket.on("connect", onSocketConnected);	
	
	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);

	// New player message received
	socket.on("new player", onNewPlayer);

	// Player move message received
	socket.on("move player", onMovePlayer);

	// Player removed message received
	socket.on("remove player", onRemovePlayer);	
};

// Maze form
function onMazeForm(Player){
	/*maze.theMaze.draw();
	theMaze = maze.theMaze;	
	console.log("HIHIHI");
	socket.emit("Maze", {theMaze: theMaze});*/
	//console.log("Maze'1' info loaded");
	rows1 = Player.rows;
	//console.log("row1 initialised: row1 = "+rows1);
	columns1 = Player.columns;
	backgroundColor1 = Player.backgroundColor;
	wallColor1 = Player.wallColor;
	grid1 = Player.grid;
	//mazeStyledecision1 = Player.mazeStyledecision;
	//rand1 = Player.rand;
	//genStartColumn1 = Player.genStartColumn;
	//genStartRow1 = Player.genStartRow;
	//choices1 = Player.choices;
	//theMaze = Player.theMaze;
	//theMaze.draw() = Player.draw();
	}

// Socket connected
function onSocketConnected() {
	console.log("Connected to socket server");
	
	// Send local player data to the game server
//	if (!isNaN(tank1.tankCenterX) && !isNaN(tank1.tankCenterY))
		socket.emit("new player", {x: tank1.tankCenterX, y: tank1.tankCenterY, rotorX: tank1.rotorX, rotorY: tank1.rotorY, angle: tank1.rotorAngle, bulletArray: tank1.bullet});
	console.log("new player emmited " + tank1.rotorAngle);
};

// Socket disconnected
function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

// New player
function onNewPlayer(data) {
	console.log("New player connected: "+data.id);
	
	// check if data has its values
/*	if (!(typeof data.rows != 'undefined' && undefined != data.rows)) return;
	console.log("New Maze row: "+data.rows);*/
	
	// Initialise the new player
	var newPlayer = new Tank(data.x,data.y,data.rotorX, data.rotorY, data.angle, data.bulletArray);
	console.log("in new player bullet@"+typeof(data.bulletArray));
	initializeTank(newPlayer);
	console.log("in new player initialised bullet@"+typeof(newPlayer.bullet));
	newPlayer.id = data.id;
	remotePlayers.push(newPlayer);
	console.log("pushed & newPlayerAngle="+typeof(newPlayer.bullet));
};

// Move player
function onMovePlayer(data) {
	var movePlayer = playerById(data.id);

	// Player not found
	if (!movePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};
	
	//console.log("In move player angle@"+data.angle+"tank@"+data.x);
	// Update player position
	movePlayer.tankCenterX = data.x;
	movePlayer.tankCenterY = data.y;
	movePlayer.rotorX = data.rotorX;
	movePlayer.rotorY = data.rotorY;
	movePlayer.rotorAngle = data.angle;
	movePlayer.bullet = data.bulletArray;
	console.log("In move player bullet@"+typeof(movePlayer.bullet) + " " + typeof(data.bulletArray));
};

// Remove player
function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);

	// Player not found
	if (!removePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Remove player from array
	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

/**************************************************
** GAME UPDATE
**************************************************/
function update() {
	// Update local player and check for change
//	if (tank1.update(keys)) {
		// Send local player data to the game server
		socket.emit("move player", {x: tank1.tankCenterX, y: tank1.tankCenterY, rotorX: tank1.rotorX, rotorY: tank1.rotorY, angle: tank1.rotorAngle, bulletArray: tank1.bullet});
//	console.log("in update bullet@" + typeof(tank1.bullet));
	// for debugging
//	console.log("move emitted" + tank1.tankCenterX);
//	};
}


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		if (remotePlayers[i].id == id)
			return remotePlayers[i];
	};
	
	return false;
};

