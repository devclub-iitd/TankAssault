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
		};
}

function generate() {
	socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});
	setEventHandlers();
	//makeMaze();
	if(alreadygenerated == 0){
	makeMaze();
//	theMaze = mazemake.drawing();
	//theMaze.draw();
	drawmaze();
	alreadygenerated++;
	}
	tank1 = new Tank();
	tank1.bullet = new Array();
	for (var i = 0; i < tank1.bulletPack; i++)
    	tank1.bullet.push(new Bullet());

	if (onceLoaded ==0) onceLoaded++;
	theMaze.initialize();
	if (loaded == 0){
		var timxxx = setInterval(playGame, 10);
	}

	loaded++;
}
function reSetTank() {
	theMaze.initialize();
}
