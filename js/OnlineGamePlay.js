// JavaScript Document for main Play
/**************************************************
** Controller functions for the game
**************************************************/

var alreadygenerated = 0;
var iterationTime = 10; // in milis


  
function playGame() {
	// function which controls the game 
	// called repeatedly after each 'iterationTime' milisecond
	 
	 moveTank(theTank);
	 //theMaze.draw();
	 drawmaze();
	 shootTank(theTank);
	 update();
	 
	 var i;
	 for (i = 0; i < remotePlayers.length; i++) {
			drawTank(remotePlayers[i], "orange", "red", "yellow", "#E3EF1E");
		// 	console.log(typeof(remotePlayers[i].bullet) + " and length@"+remotePlayers[i].bullet.length);
		 	for(var bulletCount = 0; bulletCount < remotePlayers[i].bullet.length; bulletCount++){
				// draw the bullets
		//		console.log(typeof(remotePlayers[i].bullet[bulletCount]));
				drawBullet(remotePlayers[i].bullet[bulletCount]);
			}
		};
	myScore.text="SCORE: " + 7;
    myScore.update();
	changeHealth();
}

async function generate() {
	//console.log("got into generate()");
	socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});
	
	//makeMaze();
	if(alreadygenerated == 0){
	makeMaze();
//	theMaze = mazemake.drawing();
	//theMaze.draw();
	drawmaze();
	alreadygenerated++;
	}
	theTank = new Tank();
	//console.log("After assigning theTank : tankCenterX = "+ theTank.tankCenterX);
//	theTank.bullet = new Array();
	for (var i = 0; i < theTank.bulletPack; i++)
    	theTank.bullet.push(new Bullet());

	if (onceLoaded == 0) onceLoaded++;
	init();
	
	//console.log("Before calling event handler: tankCenterX = "+ theTank.tankCenterX);
	setEventHandlers();
	// caution: this time depends on network speed
	//          when moving to actual online server test and increase this time to avoid previous
	//          'double start' errors
	await sleep(50);
	//console.log("After calling event handler: tankCenterX = "+ theTank.tankCenterX+"rows1 = " + rows1);
	
	//console.log("before maze.initialize : tankCenterX = "+ theTank.tankCenterX);
	theMaze.initialize();
	console.log("after maze.initialize : tankCenterX = "+ theTank.tankCenterX);
	if (loaded == 0){
		setInterval(playGame, iterationTime);
	}

	loaded++;
}
function reSetTank() {
	theMaze.initialize();
}
