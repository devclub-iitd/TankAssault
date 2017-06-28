
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
	console.log("Got into maze.initialize angle = " +theTank.rotorAngle);
	initializeTank(theTank);
	console.log("after initialize tank angle = " +theTank.rotorAngle);
	for (var i = 0; i < theTank.bulletPack; i++)
    	initializeBullet(theTank, theTank.bullet[i]);

	theTank.bulletReload = true;
	theTank.bulletShot = theTank.bulletPack;
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
	theMaze = maze.theMaze;	*/
	console.log("HIHIHI");
	/*socket.emit("Maze", {theMaze: theMaze});*/
	//console.log("Maze'1' info loaded");
	rows1 = Player.rows;
	//console.log("row1 initialised: row1 = "+rows1);
	columns1 = Player.columns;
	backgroundColor1 = Player.backgroundColor;
	wallColor1 = Player.wallColor;
	grid1 = Player.grid;
	mazeHeight1 = Player.mazeHeight;
	console.log("row1 is initialised to "+rows1);
	console.log("mazeHeight1 is initialised to "+mazeHeight1);
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
//	if (!isNaN(theTank.tankCenterX) && !isNaN(theTank.tankCenterY))
		socket.emit("new player", {
			x: theTank.tankCenterX,
			y: theTank.tankCenterY,
			rotorX: theTank.rotorX,
			rotorY: theTank.rotorY,
			angle: theTank.rotorAngle,
			bulletArray: theTank.bullet
		});
	console.log("new player emmited " + theTank.rotorAngle);
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
	var newPlayer = new Tank(data.x, data.y, data.rotorX, data.rotorY, data.angle, data.bulletArray);
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
//	if (theTank.update(keys)) {
		// Send local player data to the game server
		socket.emit("move player", {
			x: theTank.tankCenterX,
			y: theTank.tankCenterY,
			rotorX: theTank.rotorX,
			rotorY: theTank.rotorY,
			angle: theTank.rotorAngle,
			bulletArray: theTank.bullet
		});
//	console.log("in update bullet@" + typeof(theTank.bullet));
	// for debugging
//	console.log("move emitted" + theTank.tankCenterX);
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

