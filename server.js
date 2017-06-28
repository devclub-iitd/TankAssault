/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var util = require("util"),					// Utility resources (logging, object inspection, etc)
	io = require("socket.io"),				// Socket.IO
	Player = require("./Player");	// Player class
//	theMaze = require("./Maze").maze();
var theMaze = null;
/**************************************************
** GAME VARIABLES
**************************************************/
var socket,		// Socket controller
	players;	// Array of connected players


/**************************************************
** GAME INITIALISATION
**************************************************/

function init() {
	// Create an empty array to store players
	players = [];

	// Set up Socket.IO to listen on port 5000
	socket = io.listen(process.env.PORT || 5000);

	// Configure Socket.IO
	socket.configure(function() {
		// Only use WebSockets
		socket.set("transports", ["websocket"]);

		// Restrict log output
		socket.set("log level", 2);
	});
	// Start listening for events
	setEventHandlers();
}

/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Socket.IO
	socket.sockets.on("connection", onSocketConnection);
};

// New socket connection
function onSocketConnection(client) {
	// Listen for client connection
	util.log("New player has connected: " + client.id);

	
	// Listen for maze design
	this.emit("Player", {
		rows: Player.rows,
		columns: Player.columns,
		backgroundColor: Player.backgroundColor,
		wallColor: Player.wallColor,
		grid: Player.grid,
		mazeHeight: Player.mazeHeight
	});
	
	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);

	// Listen for new player message
	client.on("new player", onNewPlayer);

	// Listen for move player message
	client.on("move player", onMovePlayer);
};

/**************************************************
** EVENT HANDLERS FUNCTIONS
**************************************************/

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


/**************************************************
** RUN THE GAME
**************************************************/
init();
