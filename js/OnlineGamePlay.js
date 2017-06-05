// JavaScript Document for main Play

maze.prototype.playGame = function() {
	// useful when having more than one tank
	 theMaze.moveTank(tank1);
	 theMaze.draw();
	 theMaze.shootTank(tank1);
}

function generate() {
	makeMaze();
	theMaze.draw();
	tank1 = new Tank();
	tank1.bullet = new Array();
	for (var i = 0; i < tank1.bulletPack; i++)
    	tank1.bullet.push(new Bullet());
	
	if (onceLoaded ==0) onceLoaded++;
	theMaze.initialize();
	if (loaded == 0){
		setInterval(theMaze.playGame, 10);
	}
	
	loaded++;
}
function reSetTank() {
	theMaze.initialize();
}
