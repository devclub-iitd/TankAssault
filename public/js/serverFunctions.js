
// javascript for tank Movement and shooting
// var canvas already declared

var ctx = canvas.getContext("2d");


var	remotePlayers,
	localPlayer;

//var shootx=true;
//var shoot1=true;

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

function initialize(Tank,number){
	initializeTank(Tank);
	for (var i = 0; i < Tank.bulletPack; i++)
    	initializeBullet(Tank, Tank.bullet[i]);
	Tank.bulletReload = true;
	Tank.bulletShot = Tank.bulletPack;
	if(number == 1){
	socket.emit("renew player", {
			id: Tank.id,
			roomno: Tank.roomno,
			x: Tank.tankCenterX,
			y: Tank.tankCenterY,
			rotorX: Tank.rotorX,
			rotorY: Tank.rotorY,
			angle: Tank.rotorAngle,
			bullet: Tank.bullet,
			upPressed: Tank.upPressed,
			downPressed: Tank.downPressed,
			rightPressed: Tank.rightPressed,
			leftPressed: Tank.leftPressed,
			leftClick: Tank.leftClick,
			reloading: Tank.reloading
		});
}
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function setEventHandlers() {
		// Socket maze
	socket.on("Player", onMazeForm);
	// Keyboard
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	// Socket connection successful
	socket.on("connectToRoom", function(data){
		console.log(data);
	});	

	// Socket connection successful
	socket.on("connect", onSocketConnected);	

	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);

	// New player message received
	socket.on("new player", onNewPlayer);

	// Player move message received
	socket.on("move player", onMovePlayer);

	// Player move message received
	socket.on("shoot player", onShootPlayer);

	// renew Player
	socket.on("renew player", onRenewPlayer);

	// Player removed message received
	socket.on("remove player", onRemovePlayer);	
};

// Maze form
function onMazeForm(Player){
	rows1 = Player.rows;
	columns1 = Player.columns;
	//backgroundColor1 = Player.backgroundColor;
	//wallColor1 = Player.wallColor;
	grid1 = Player.grid;
	mazeHeight1 = Player.mazeHeight;
	}

// Socket connected
function onSocketConnected() {
	// Send local player data to the game server
		socket.emit("new player", {
			x: theTank.tankCenterX,
			y: theTank.tankCenterY,
			rotorX: theTank.rotorX,
			rotorY: theTank.rotorY,
			angle: theTank.rotorAngle,
			bulletArray: theTank.bullet,
			upPressed: theTank.upPressed,
			downPressed: theTank.downPressed,
			rightPressed: theTank.rightPressed,
			leftPressed: theTank.leftPressed,
			leftClick: theTank.leftClick,
			reloading: theTank.reloading
		});
};

// Socket disconnected
function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

// renew Player
function onRenewPlayer(data){
	var renewPlayer = playerById(data.id);

	// Player not found
	if (!renewPlayer) {
		console.log("Player not found: "+data.id);
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
}

// New player
function onNewPlayer(data) {
	console.log("New player connected: "+data.id);
	
	// check if data has its values
	
	// Initialise the new player
	var newPlayer = new Tank();
	initializeTank(newPlayer);
	newPlayer.id = data.id;
	newPlayer.tankCenterX = data.x;
	newPlayer.tankCenterY = data.y;
	newPlayer.rotorX = data.rotorX;
	newPlayer.rotorY = data.rotorY;
	newPlayer.rotorAngle = data.angle;
	newPlayer.bullet = data.bulletArray;
	newPlayer.bulletPack = data.bulletPack;
	newPlayer.bulletShot = data.bulletShot;
	newPlayer.roomno = data.roomno;
	//console.log("bulletPack: " + newPlayer.bulletPack);
	//for (var i = 0; i < newPlayer.bulletPack; i++)
    //	newPlayer.bullet.push(new Bullet());

	for (var i = 0; i < newPlayer.bulletPack; i++)
    	initializeBullet(newPlayer, newPlayer.bullet[i]);
   
   	newPlayer.bulletReload = true;
	newPlayer.bulletShot = newPlayer.bulletPack;
	
	newPlayer.id = data.id;
	remotePlayers.push(newPlayer);
	console.log("pushed into remote players"+newPlayer.id+" type:"+typeof(newPlayer));
};

// Move player
function onMovePlayer(data) {
	var movePlayer = playerById(data.id);

	// Player not found
	if (!movePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};
	
	// Update player position
	movePlayer.tankCenterX = data.x;
	movePlayer.tankCenterY = data.y;
	movePlayer.rotorX = data.rotorX;
	movePlayer.rotorY = data.rotorY;
	movePlayer.rotorAngle = data.angle;
	
};

function onShootPlayer(data){
	var shootPlayer = playerById(data.id);

	// Player not found
	if (!shootPlayer) {
		console.log("Player not found: "+data.id);
		return;
	};
	
	shootPlayer.tankCenterX = data.x;
	shootPlayer.tankCenterY = data.y;
	shootPlayer.rotorX = data.rotorX;
	shootPlayer.rotorY = data.rotorY;
	shootPlayer.rotorAngle = data.angle;
	shootPlayer.bullet = data.bullet;
	shootPlayer.bulletShot = data.bulletShot;
	shootPlayer.bulletPack = data.bulletPack;
	shootPlayer.bulletReload = data.bulletReload;
	shootPlayer.leftClick1 = data.leftClick1;
	shootPlayer.reloading = data.reloading;
	//console.log("in onShootPlayer leftclick: "+shootPlayer.leftClick+" of "+shootPlayer.id);
	
}
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
		// Send local player data to the game server
		socket.emit("move player", {
			upPressed: remotePlayers[0].upPressed,
			downPressed: remotePlayers[0].downPressed,
			rightPressed: remotePlayers[0].rightPressed,
			leftPressed: remotePlayers[0].leftPressed,
			roomno: remotePlayers[0].roomno
		});

		/*socket.emit("shoot player", {
			leftClick: remotePlayers[0].leftClick,
			reloading: remotePlayers[0].reloading,
			bulletPack: remotePlayers[0].bulletPack,
			bulletShot: remotePlayers[0].bulletShot,
			bulletReload: remotePlayers[0].bulletReload,
			bullet: remotePlayers[0].bullet,
			roomno: remotePlayers[0].roomno
		});*/
	// make leftClick false after once emitting true
	//remotePlayers[0].leftClick = false; // But creating problem of bullet disappearing
	//console.log("in update loop emitted shoot player by "+remotePlayers[0].id+" with leftclick "+remotePlayers[0].leftClick);
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

