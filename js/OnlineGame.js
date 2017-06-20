// javascript for tank Movement and shooting
// var canvas already declared
var timx=0;
var boom_r=10;
var ctx = canvas.getContext("2d");
var bulletAudio = document.getElementById('audiobullet');
var endAudio = document.getElementById('audiotank');
var xxxx=0;

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

maze.prototype.initialize = function() {

	initializeTank(tank1);
	for (var i = 0; i < tank1.bulletPack; i++)
    	initializeBullet(tank1, tank1.bullet[i]);

	tank1.bulletReload = true;
	tank1.bulletShot = tank1.bulletPack;
	init();
}

function setEventHandlers() {
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


// Socket connected
function onSocketConnected() {
	console.log("Connected to socket server");

	// Send local player data to the game server
	socket.emit("new player", {x: tank1.tankCenterX, y: tank1.tankCenterY});
};

// Socket disconnected
function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

// New player
function onNewPlayer(data) {
	console.log("New player connected: "+data.id);

	// Initialise the new player
	var newPlayer = new Tank();
	initializeTank(newPlayer);
	newPlayer.id = data.id;

	// Add new player to the remote players array
	remotePlayers.push(newPlayer);
};

// Move player
function onMovePlayer(data) {
	var movePlayer = playerById(data.id);

	// for debugging
	console.log("Move!!! "+movePlayer.tankCenterX);
	
	// Player not found
	if (!movePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Update player position
	movePlayer.tankCenterX = data.x;
	movePlayer.tankenterY = data.y;
	
	// Broadcast updated position to connected socket clients
	this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
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
		socket.emit("move player", {x: tank1.tankCenterX, y: tank1.tankCenterY});
	// for debugging
	console.log("move emitted" + tank1.tankCenterX);
//	};
};


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
/*************************************************
** Animation functions
*************************************************/
function doAdelay(){
 setTimeout(function(){return true;},3000);
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
		  window.webkitRequestAnimationFrame ||
		  window.mozRequestAnimationFrame    ||
		  window.oRequestAnimationFrame      ||
		  window.msRequestAnimationFrame     ||
		  function( callback ){
			window.setTimeout(callback, 1000 / 60);
		  };
})();


circles = [];

function create(aTank) {

	//Place the circles at the center
	//console.log(aTank.tankCenterX);
	this.x = aTank.tankCenterX;
	this.y = aTank.tankCenterY;


	//Random radius between 2 and 6
	this.radius = 2 + Math.random()*3;

	//Random velocities
	this.vx = -5 + Math.random()*10;
	this.vy = -5 + Math.random()*10;

	//Random colors
	this.r = Math.round(Math.random())*255;
	this.g = Math.round(Math.random())*255;
	this.b = Math.round(Math.random())*255;

}

function draw(aTank) {

	//Fill canvas with black color
    ctx.globalCompositeOperation = "source-over";
    //ctx.fillStyle = "rgba(0,0,0,0.15)";
   // ctx.fillRect(0, 0, 30, 30);

	//Fill the canvas with circles
	for(var j = 0; j < circles.length; j++){
		var c = circles[j];

		//Create the circles
		ctx.beginPath();
		ctx.arc(c.x, c.y, c.radius, 0, Math.PI*2, true);
        ctx.fillStyle = "rgba("+c.r+", "+c.g+", "+c.b+", 1)";
		ctx.fill();

		c.x += c.vx;
		c.y += c.vy;
		if(c.radius > 0.02){
		c.radius -= .02;
		}
		if(c.radius > 3)
			circles[j] = new create(aTank);
	}
}

function animate(aTank) {
	console.log("AA gya");
	b++;
	if(b<300){
	requestAnimFrame(animate);
	draw(aTank);
	}
}
