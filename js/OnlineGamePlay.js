// JavaScript Document for main Play
var timxxx;

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
		var timxxx = setInterval(theMaze.playGame, 10);
	}

	loaded++;
}
function reSetTank() {
	theMaze.initialize();
}


/*function explode(aTank) {
    //        aTank.explodeRestore();
            setTimeout(function () {
                aTank.explode({
                    maxWidth: 15,
                    minWidth: 5,
                    radius: 231,
                    release: false,
                    recycle: false,
                    explodeTime: 320,
                    canvas: true,
                    round: false,
                    maxAngle: 360,
                    gravity: 10,
                    groundDistance: 150,
                });
            }, 300)
        }*/
function destroyTank(aTank){
	/*ax=aTank.tankCenterX;
	ay=aTank.tankCenterY;
	context.beginPath();
	context.arc(ax,ay,boom_r,0,2*Math.PI);
	context.closePath;
	context.fill();
	if(boom_r<50){
	boom_r=boom_r+20;
	//timx+=1
	}
	else{
	boom_r=10;
	}*/
	console.log("Called");
//	create(aTank);
//	draw(aTank);
		//	a = 0;
	animate(aTank);
	/*  setTimeout(function (){
		animate(aTank);
            }, 300);*/

}
