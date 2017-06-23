// JavaScript Document for main Play
var timxxx;
var canvas,
	socket,
	remotePlayers,
	localPlayer;
var alreadygenerated = 0;
//var mazemake = require(".././Player.js");
function playGame() {
	// useful when having more than one tank
	 
	 moveTank(tank1);
	 //theMaze.draw();
	 drawmaze();
	 shootTank(tank1);
	 update();
	 
	 var i;
	 for (i = 0; i < remotePlayers.length; i++) {
			drawTank2(remotePlayers[i].tankCenterX,remotePlayers[i].tankCenterY,remotePlayers[i].tankRadius,remotePlayers[i].rotorLength,remotePlayers[i].rotorWidth,remotePlayers[i].rotorAngle);
		 	//console.log(i);
		};
}

async function generate() {
	console.log("got into generate()");
	socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});
	
	//makeMaze();
	if(alreadygenerated == 0){
	makeMaze();
//	theMaze = mazemake.drawing();
	//theMaze.draw();
	drawmaze();
	alreadygenerated++;
	}
	tank1 = new Tank();
	console.log("After assigning tank1 : tankCenterX = "+ tank1.tankCenterX);
	tank1.bullet = new Array();
	for (var i = 0; i < tank1.bulletPack; i++)
    	tank1.bullet.push(new Bullet());

	if (onceLoaded ==0) onceLoaded++;
	init();
	
	console.log("Before calling event handler: tankCenterX = "+ tank1.tankCenterX);
	setEventHandlers();
	await sleep(2000);
	console.log("After calling event handler: tankCenterX = "+ tank1.tankCenterX+"rows1 = " + rows1);
	
	console.log("before maze.initialize : tankCenterX = "+ tank1.tankCenterX);
	theMaze.initialize();
	console.log("after maze.initialize : tankCenterX = "+ tank1.tankCenterX);
	if (loaded == 0){
		var timxxx = setInterval(playGame, 10);
	}

	loaded++;
}
function reSetTank() {
	theMaze.initialize();
}
