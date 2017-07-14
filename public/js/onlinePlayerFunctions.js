/**************************************************
** Defines the tank object and its methods
**************************************************/
// the tanks
var theTank = null;

function Tank(){
	// tank parameters
	this.tankCenterX = 0;
	this.tankCenterY = 0;
	this.rotorX = 15;
	this.rotorY = 15;
	this.rotorAngle = 0;
	this.tankRadius = (100/rows1);
	this.rotorLength = this.tankRadius * 20 / 15;
	this.rotorWidth = this.tankRadius * 7 / 15;
	this.dDist = this.tankRadius / 15;
	this.dAng = 1;
	// tank  controls
	this.rightPressed = false;
	this.leftPressed = false;
	this.upPressed = false;
	this.downPressed = false;
	this.leftClick = false;
	this.reloading = false;
	this.bulletReload = false;
	this.bulletPack = 6;
	this.bulletShot = this.bulletPack;
	this.bullet = [];
	this.bullTank = 100;
}

function initializeTank(aTank) {
	// tank parameters
	var randrow = Math.floor(Math.random() * rows1);
	var randcolumn = Math.floor(Math.random() * columns1);
	var gridsize = mazeHeight1/rows1;
	aTank.tankCenterX = (randcolumn * gridsize) + gridsize / 30;
	aTank.tankCenterY = (randrow * gridsize) + gridsize / 30;
	aTank.rotorX = aTank.tankCenterX + 15;
	aTank.rotorY = aTank.tankCenterY + 15;
	aTank.rotorAngle = 0;
	aTank.tankRadius = gridsize/ 4;
	aTank.rotorLength = aTank.tankRadius * 20 / 15;
	aTank.rotorWidth = aTank.tankRadius * 7 / 15;
	aTank.dDist = aTank.tankRadius / 11.5;
	aTank.dAng = 1;
	// tank  controls
	aTank.rightPressed = false;
	aTank.leftPressed = false;
	aTank.upPressed = false;
	aTank.downPressed = false;
}


function Bullet() {
	this.bulletX = 0;
	this.bulletY = 0;
	this.bulletAngle;
	this.bulletRadius;
	this.dbulletX;
	this.dbulletY;
	this.shoot = false;
	this.collisions = 0;
	this.shootBegin = false;
}

function initializeBullet(aTank, aBullet){
	aBullet.bulletX = aTank.tankCenterX;
	aBullet.bulletY = aTank.tankCenterY;
	aBullet.bulletAngle = aTank.rotorAngle;
	aBullet.bulletRadius = aTank.rotorWidth * 3 / 7;
	aBullet.dbulletX = -2 * aBullet.bulletRadius / 3;
	aBullet.dbulletY = 2 * aBullet.bulletRadius / 3;
	aBullet.shoot = false;
	aBullet.collisions = 0;
}


function keyDownHandler(e) {
	switch (e.keyCode) {
		case 38:
			remotePlayers[0].upPressed = true;
			break;
		case 40:
			remotePlayers[0].downPressed = true;
			break;
		case 39:
			remotePlayers[0].rightPressed = true;
			break;
		case 37:
			remotePlayers[0].leftPressed = true;
			break;
		default:
			// none of these keys
			break;
	}
	if(e.keyCode == 70){
			remotePlayers[0].leftClick = true;
}
	if(e.keyCode == 82){
		theTank.reloading = true;
		setTimeout(Reload,3000);
		document.getElementById('audioreload').loop=false;
 		document.getElementById('audioreload').play();

}
}

function keyUpHandler(e) {
	switch (e.keyCode) {
		case 38:
			remotePlayers[0].upPressed = false;
			break;
		case 40:
			remotePlayers[0].downPressed = false;
			break;
		case 39:
			remotePlayers[0].rightPressed = false;
			break;
		case 37:
			remotePlayers[0].leftPressed = false;
			break;
		default:
			// none of these keys
			break;
	}
	if(e.keyCode == 70){
			remotePlayers[0].leftClick = false;
}
}

function Reload(){
	remotePlayers[0].bulletReload = true;
	remotePlayers[0].leftClick = false;
	remotePlayers[0].reloading = false;
}
/*function drawTank(aTank, color1, color2, color3, color4){
		var grd=ctx.createRadialGradient(aTank.tankCenterX, aTank.tankCenterY, aTank.tankRadius / 6, aTank.tankCenterX, aTank.tankCenterY, aTank.tankRadius);
		grd.addColorStop(0, color1);
		grd.addColorStop(0.4, color2);
		grd.addColorStop(1, color3);

		ctx.beginPath();
		ctx.fillStyle = grd;
		ctx.arc(aTank.tankCenterX, aTank.tankCenterY, aTank.tankRadius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	
        // first save the untranslated/unrotated context
        ctx.save();
	    ctx.beginPath();
        // move the rotation point to the center of the rect
        ctx.translate( aTank.tankCenterX, aTank.tankCenterY );
        // rotate the rect
        ctx.rotate(aTank.rotorAngle * Math.PI / 180);
	    // draw the rect on the transformed context
        // Note: after transforming [0,0] is visually [x,y]
        //       so the rect needs to be offset accordingly when drawn

	    ctx.fillStyle = color4;
		ctx.fillRect( -aTank.rotorLength / 2 - 10, -aTank.rotorWidth / 2, aTank.rotorLength, aTank.rotorWidth);
        // restore the context to its untranslated/unrotated state
        ctx.restore();
}*/
function drawTank(aTank, tankImage){
		/*var grd=ctx.createRadialGradient(aTank.tankCenterX, aTank.tankCenterY, aTank.tankRadius / 6, aTank.tankCenterX, aTank.tankCenterY, aTank.tankRadius);
		grd.addColorStop(0, color1);
		grd.addColorStop(0.4, color2);
		grd.addColorStop(1, color3);*/

		var height = aTank.tankRadius * 2,
			width = height;
		/*ctx.beginPath();
		ctx.fillStyle = grd;
		ctx.arc(aTank.tankCenterX, aTank.tankCenterY, aTank.tankRadius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();*/
	
        // first save the untranslated/unrotated context
        ctx.save();
	    ctx.beginPath();
        // move the rotation point to the center of the rect
        ctx.translate(aTank.tankCenterX, aTank.tankCenterY);
        // rotate the rect
        ctx.rotate((aTank.rotorAngle - 90) * Math.PI / 180);
		//console.log(aTank.rotorAngle);
	    // draw the rect on the transformed context
        // Note: after transforming [0,0] is visually [x,y]
        //       so the rect needs to be offset accordingly when drawn

	    /*ctx.fillStyle = color4;
		ctx.fillRect( -aTank.rotorLength / 2 - 10, -aTank.rotorWidth / 2, aTank.rotorLength, aTank.rotorWidth);*/
	
        context.drawImage(tankImage,  -width / 2, -height / 2,  width, height);
        // restore the context to its untranslated/unrotated state
        ctx.restore();
}

function shootTank(aTank, tankImage) {
	// Some Shooting....
	if (aTank.bulletReload){
		// reset each bullet and fill bulletPack
		aTank.bulletShot = aTank.bulletPack;
	}
 	if (aTank.bulletShot > 0 && aTank.leftClick){
			shootBullet(aTank.bullet[aTank.bulletShot - 1], aTank);
			bulletAudio.pause();
			bulletAudio.currentTime = 0;
			bulletAudio.play()
			aTank.leftClick = false;
			aTank.bulletShot -= 1;
}

	// shoot the bullets ready for shoot

 	for (var i = aTank.bulletPack - 1; i >=0 ; i--){
		aTank.bullTank = Math.sqrt(Math.pow((aTank.bullet[i].bulletX-aTank.tankCenterX),2) + Math.pow((aTank.bullet[i].bulletY-aTank.tankCenterY),2));
			if((aTank.bullTank <= aTank.tankRadius) && (aTank.bullet[i].shoot == true) && (xxxx==0)){

				endAudio.currentTime = 0;
				endAudio.play();
				date1= new Date().getTime();
				var xboom = 0
				var ct = document.getElementById('maze').getContext("2d");
				xxxx=1
				// Creating circles for animation
				for (var i = 0; i < 500; i++) {
					circles.push(new create(aTank));
				}

				b = 0;
				shootx=false;
				shoot1=false;
				destroyTank(aTank);
				
				setTimeout(function(){
				initialize();
					xxxx=0;
					shoot1=true;
					shootx=true;
				},1000);
		}
		if (aTank.bullet[i].shoot) {
			Shoot(aTank.bullet[i], aTank);
		}
		if(aTank.bullTank >= aTank.tankRadius){
			if (shoot1==true){
				drawTank(aTank, tankImage);
			}
		}
	}


 	aTank.bulletReload = false;
 	aTank.leftClick = false;
}



function drawBullet(aBullet){
	context.beginPath();
	context.fillStyle = "black";
	context.arc(aBullet.bulletX, aBullet.bulletY, aBullet.bulletRadius, 0, 2 * Math.PI);
	context.fill();
	context.closePath();
	leftClick = false;
}

function shootBullet(aBullet, aTank) {
	aBullet.bulletX = aTank.tankCenterX - aTank.rotorLength * (Math.cos(aTank.rotorAngle * Math.PI / 180));
	aBullet.bulletY = aTank.tankCenterY - aTank.rotorLength * (Math.sin(aTank.rotorAngle * Math.PI / 180));
	aBullet.bulletAngle = aTank.rotorAngle;
	aBullet.collisions = 0;
	aBullet.shoot = true;
	aBullet.shootBegin = true;
	Shoot(aBullet, aTank);
}
function Shoot(aBullet, aTank){
	var gridsize = mazeHeight1/rows1;
	var i = Math.floor(aBullet.bulletX / gridsize)
	var j = Math.floor(aBullet.bulletY / gridsize)
	if (aBullet.shootBegin === true){
		if (i < 0 || i >= columns1 || j < 0 || j >= rows1) {
			aBullet.shoot = false;
			return;
		}
		aBullet.shootBegin = false;
	}

	var currentBulletGrid = grid1[i][j];
 	wallLeft = i*gridsize;
 	wallRight = (i+1)*gridsize;
 	wallTop = j*gridsize;
 	wallBottom = (j+1)*gridsize;

 	// fine adjustments for bullet
 	if (currentBulletGrid.rightWall && (aBullet.bulletX + aBullet.bulletRadius > wallRight)) {
		if(aBullet.bulletAngle <= 180){
			aBullet.bulletAngle -= (2*aBullet.bulletAngle - 180);
		}
		else{
			aBullet.bulletAngle += (540 - 2*aBullet.bulletAngle);
		}
		aBullet.bulletAngle = aBullet.bulletAngle % 360;
		aBullet.collisions++;
	}
 	else if (currentBulletGrid.leftWall && (aBullet.bulletX - aBullet.bulletRadius < wallLeft)) {

		if(aBullet.bulletAngle <= 180){
			aBullet.bulletAngle += (180 - 2*aBullet.bulletAngle);
		}
		else{
			aBullet.bulletAngle += (540 - 2*aBullet.bulletAngle);
		}
		aBullet.bulletAngle = aBullet.bulletAngle % 360;
		aBullet.collisions++;
	}
	else if (currentBulletGrid.bottomWall && (aBullet.bulletY + aBullet.bulletRadius > wallBottom)) {
		if(aBullet.bulletAngle <= 270){
			aBullet.bulletAngle -= (2*aBullet.bulletAngle - 360);
		}
		else{
			aBullet.bulletAngle += (720 - 2*aBullet.bulletAngle);
		}
		aBullet.bulletAngle = aBullet.bulletAngle % 360;
		aBullet.collisions++;
	}
 	else if (currentBulletGrid.topWall && (aBullet.bulletY - aBullet.bulletRadius < wallTop)) {
		if(aBullet.bulletAngle <= 90){
			aBullet.bulletAngle -= (2*aBullet.bulletAngle);
			aBullet.bulletAngle += 360;
		}
		else{
			aBullet.bulletAngle += (360 - 2*aBullet.bulletAngle);
		}
		aBullet.bulletAngle = aBullet.bulletAngle % 360;
		aBullet.collisions++;
	}

	if (shootx==true){
		aBullet.bulletX -=  aBullet.dbulletX * (Math.cos((180 - aBullet.bulletAngle) * Math.PI / 180));
		aBullet.bulletY -=  aBullet.dbulletY * (Math.sin((180 - aBullet.bulletAngle) * Math.PI / 180));
		drawBullet(aBullet);
	}
		if(aBullet.collisions > 12){
			aBullet.shoot = false;
			aBullet.collisions = 0;
		}
}


function destroyTank(aTank){
	animate(aTank);
}
