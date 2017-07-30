// JavaScript Document for main Play
/**************************************************
** Controller functions for the game
**************************************************/

var iterationTime = 10; // in milis


  
function playGame() {
	// function which controls the game 
	// called repeatedly after each 'iterationTime' milisecond
	 // removing the upressed error:
	// if remotePlayers[0] not initialised
	drawmaze();

	if (remotePlayers.length > 0){		 
	update(false);	 
		var i;
		var tankImage;
		for (i = 0; i < remotePlayers.length; i++) {
			 //console.log(i);
			 		if (i == 0) tankImage = tank1image;
			 		else if (i % 3 == 1) tankImage = tank2image;
					else if (i % 3 == 2) tankImage = tank3image;
					else tankImage = tank4image;
					if (i == 0) shootTank(remotePlayers[i], tankImage, true);
					else shootTank(remotePlayers[i], tankImage);
			};
		myScore.text="SCORE: " + myscore;
    	myScore.update();
		changeHealth();
	}
}

async function generate() {
//	theTank = new Tank();
//	for (var i = 0; i < theTank.bulletPack; i++)
  //  	theTank.bullet.push(new Bullet());

	if (onceLoaded == 0) onceLoaded++;
	init();
	
	$('#maze').hide();
	$('#loading').show();
	$('#myBar').hide();
	setEventHandlers();

	// caution: this time depends on network speed
	//          when moving to actual online server test and increase this time to avoid previous
	//          'double start' errors
	await sleep(universalSleepTime_dependsOnNetwork);
	while(remotePlayers.length == 0) await sleep(100);
	//theTank = remotePlayers[0];
	//initialize(theTank,0);
	//await sleep(5000);
	$('#maze').show();
	$('#loading').hide();
	$('#myBar').show();
	room = remotePlayers[0].roomno;
	//console.log(remotePlayers[0].upPressed + " " + remotePlayers[0].downPressed + " " + remotePlayers[0].rightPressed + " " + remotePlayers[0].leftPressed);
	update(true);
	if (loaded == 0){
		setInterval(playGame, iterationTime);
	}

	loaded++;
}
function reSetTank() {
	initialize(remotePlayers[0],0);
}
