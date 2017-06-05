// javascript for tank Movement and shooting
// var canvas already declared
var ctx = canvas.getContext("2d");

function Tank(){	
	// tank parameters
	this.tankCenterX = 0;
	this.tankCenterY = 0;
	this.rotorX = 15;
	this.rotorY = 15;
	this.rotorAngle;
	this.tankRadius = theMaze.gridsize/ 4;
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
	this.bullet = null;
	this.bullTank = 100;
}

function initializeTank(aTank) {
	// tank parameters
	var randrow = Math.floor(Math.random() * theMaze.rows);
	var randcolumn = Math.floor(Math.random() * theMaze.columns);
		
	aTank.tankCenterX = (randcolumn * theMaze.gridsize) + theMaze.gridsize / 30;
	aTank.tankCenterY = (randrow * theMaze.gridsize) + theMaze.gridsize / 30;
	aTank.rotorX = aTank.tankCenterX + 15;
	aTank.rotorY = aTank.tankCenterY + 15;
	aTank.rotorAngle = 0;
	aTank.tankRadius = theMaze.gridsize/ 4;
	aTank.rotorLength = aTank.tankRadius * 20 / 15;
	aTank.rotorWidth = aTank.tankRadius * 7 / 15;
	aTank.dDist = aTank.tankRadius / 15;
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

// maze parameters
// border parameters
var borX;
var borY;
// wall parameters
var wallLeft = 0;
var wallRight = 0;
var wallTop = 0;
var wallBottom = 0;

function keyDownHandler(e) {
	switch (e.keyCode) {
		case 38:
			tank1.upPressed = true;
			break;
		case 40:
			tank1.downPressed = true;
			break;
		case 39:
			tank1.rightPressed = true;
			break;
		case 37:
			tank1.leftPressed = true;
			break;
		default:
			// none of these keys
			break;
	}
	if(e.keyCode == 70){
			tank1.leftClick = true;
}
	if(e.keyCode == 82){
		tank1.reloading = true;
		setTimeout(Reload,3000);
}
}

function keyUpHandler(e) {
	switch (e.keyCode) {
		case 38:
			tank1.upPressed = false;
			break;
		case 40:
			tank1.downPressed = false;
			break;
		case 39:
			tank1.rightPressed = false;
			break;
		case 37:
			tank1.leftPressed = false;
			break;
		default:
			// none of these keys
			break;
	}
	if(e.keyCode == 77){
			tank1.leftClick = false;
}
}

function Reload(){
	tank1.bulletReload = true;
	tank1.leftClick = false;
	tank1.reloading = false;
}

function drawTank1(x, y, radius, length, width,degrees){
		var grd=ctx.createRadialGradient(x, y, radius / 6, x, y, radius);
		grd.addColorStop(0,"blue");
		grd.addColorStop(.4,"green");
		grd.addColorStop(1, "yellow");

		ctx.beginPath();
		ctx.fillStyle = grd;
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
        // first save the untranslated/unrotated context
        ctx.save();
	    ctx.beginPath();
        // move the rotation point to the center of the rect
        ctx.translate( x, y );
        // rotate the rect
        ctx.rotate(degrees * Math.PI / 180);
	    // draw the rect on the transformed context
        // Note: after transforming [0,0] is visually [x,y]
        //       so the rect needs to be offset accordingly when drawn
        
	    ctx.fillStyle = "yellow";
		ctx.fillRect( -length / 2 - 10, -width / 2, length, width);
        // restore the context to its untranslated/unrotated state
        ctx.restore();
	}

maze.prototype.initialize = function() {
	
	if (onceLoaded > 0) {	
		document.addEventListener("keydown", keyDownHandler, false);
		document.addEventListener("keyup", keyUpHandler, false);			
		onceLoaded = -1;
	}
	initializeTank(tank1);
	for (var i = 0; i < tank1.bulletPack; i++)
    	initializeBullet(tank1, tank1.bullet[i]);
			
	tank1.bulletReload = true;
	tank1.bulletShot = tank1.bulletPack;
}



maze.prototype.moveTank = function(aTank) {
 	var i = Math.floor(aTank.tankCenterX / theMaze.gridsize)
	var j = Math.floor(aTank.tankCenterY / theMaze.gridsize)
	var currentPlayerGrid = theMaze.grid[i][j];
	
 	wallLeft = i*theMaze.gridsize;
 	wallRight = (i+1)*theMaze.gridsize;
 	wallTop = j*theMaze.gridsize;
 	wallBottom = (j+1)*theMaze.gridsize;
 	
 	// fine adjustments
 	if (currentPlayerGrid.rightWall && (aTank.tankCenterX + aTank.tankRadius > wallRight)) {
		// do something
		aTank.rotorX -= ((aTank.tankCenterX + aTank.tankRadius) - wallRight);
	}
 	else if (currentPlayerGrid.leftWall && (aTank.tankCenterX - aTank.tankRadius < wallLeft)) {
		// do something
		aTank.rotorX += (wallLeft - (aTank.tankCenterX - aTank.tankRadius));
	}
 
 	if (currentPlayerGrid.bottomWall && (aTank.tankCenterY + aTank.tankRadius > wallBottom)) {
		// do something
		aTank.rotorY -= ((aTank.tankCenterY + aTank.tankRadius) - wallBottom);
	}
 	else if (currentPlayerGrid.topWall && (aTank.tankCenterY - aTank.tankRadius < wallTop)) {
		// do something
		aTank.rotorY += (wallTop - (aTank.tankCenterY - aTank.tankRadius));
	}
 
	if (aTank.rightPressed === true){
		aTank.rotorAngle += 4;
		aTank.rotorAngle = aTank.rotorAngle % 360;
			}
 
 	else if (aTank.leftPressed === true) {
	 	aTank.rotorAngle -= 4;
	 	if(aTank.rotorAngle < 0){
			aTank.rotorAngle+=360;
			}
		aTank.rotorAngle = aTank.rotorAngle % 360;	 	
 	}
 	if (aTank.upPressed) {
	 	if (!currentPlayerGrid.topWall || (currentPlayerGrid.topWall && aTank.tankCenterY  - aTank.tankRadius > wallTop + aTank.dDist)) {
			// Move the tank left
			aTank.rotorY -= Math.sin((aTank.rotorAngle) * Math.PI / 180) * (aTank.dDist);
			aTank.rotorX -= Math.cos((aTank.rotorAngle) * Math.PI / 180) * (aTank.dDist);
		}
		else if (aTank.tankCenterY - aTank.tankRadius > wallTop) {
			aTank.rotorY += ((aTank.tankCenterY - aTank.tankRadius) - wallTop );
		}
		else if (aTank.tankCenterY + aTank.tankRadius < wallBottom) {
			aTank.rotorY += (wallBottom - (aTank.tankCenterY + aTank.tankRadius));
		}
		else {
			// tank boundary on wall
			// do nothing
		}
 	}
 	else if (aTank.downPressed) {
	 	if (!currentPlayerGrid.bottomWall || (currentPlayerGrid.bottomWall && aTank.tankCenterY  + aTank.tankRadius < wallBottom - aTank.dDist)) {
			// Move the tank left
			
			aTank.rotorY += Math.sin((aTank.rotorAngle) * Math.PI / 180) * (aTank.dDist);
			aTank.rotorX += Math.cos((aTank.rotorAngle) * Math.PI / 180) * (aTank.dDist);
		}
		else if (aTank.tankCenterY + aTank.tankRadius < wallBottom) {
			aTank.rotorY -= (wallBottom - (aTank.tankCenterY + aTank.tankRadius));
		}
		else if (aTank.tankCenterY - aTank.tankRadius > wallTop) {
			aTank.rotorY -= ((aTank.tankCenterY - aTank.tankRadius) - wallTop );
		}
		else {
			// tank boundary on wall
			// do nothing
		}
 	}
 	
 	aTank.tankCenterX = aTank.rotorX + aTank.rotorLength / 2;
	aTank.tankCenterY = aTank.rotorY + aTank.rotorWidth / 2;
}

maze.prototype.shootTank = function(aTank) {
	// Some Shooting....
	if (aTank.bulletReload){
		// reset each bullet and fill bulletPack
		aTank.bulletShot = aTank.bulletPack;
	}
	
	/*if (aTank.reloading){
		document.getElementById('demo').innerHTML = "Reloading..." + "<br>";
	}
	else document.getElementById('demo').innerHTML = "Enjoy Shooting!" + "<br>";
	*/
	// shoot new bullet if you have
 	if (aTank.bulletShot > 0 && aTank.leftClick){
			shootBullet(aTank.bullet[aTank.bulletShot - 1], aTank);
			aTank.leftClick = false;
			aTank.bulletShot -= 1;
	}
	
	// shoot the bullets ready for shoot
 	
 	for (var i = aTank.bulletPack - 1; i >=0 ; i--){
		tank1.bulltank = Math.sqrt(Math.pow((aTank.bullet[i].bulletX-tank1.tankCenterX),2) + Math.pow((aTank.bullet[i].bulletY-tank1.tankCenterY),2));
		if((tank1.bulltank <= tank1.tankRadius) && (aTank.bullet[i].shoot == true)){
			makeMaze();
			theMaze.initialize();
			}
		if (aTank.bullet[i].shoot) {
			Shoot(aTank.bullet[i], aTank);
		}
		if(tank1.bulltank >= tank1.tankRadius){
				drawTank1(tank1.tankCenterX, tank1.tankCenterY, tank1.tankRadius, tank1.rotorLength, tank1.rotorWidth, tank1.rotorAngle);
			}
	}
	
	
	// for debugging
	//document.getElementById('demo').innerHTML += "Bullets Left: " + aTank.bulletShot;
	
 	aTank.bulletReload = false;
 	aTank.leftClick = false;
}



function drawbullet(bulletX,bulletY,bulletRadius){
	context.beginPath();
	context.fillStyle = "black";
	context.arc(bulletX, bulletY, bulletRadius, 0, 2 * Math.PI);
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
	var i = Math.floor(aBullet.bulletX / theMaze.gridsize)
	var j = Math.floor(aBullet.bulletY / theMaze.gridsize)
	if (aBullet.shootBegin === true){
		if (i < 0 || i >= theMaze.columns || j < 0 || j >= theMaze.rows) {
			aBullet.shoot = false;
			return;
		}
		
		/*var iTank = Math.floor(aTank.tankCenterX / theMaze.gridsize)
		var jTank = Math.floor(aTank.tankCenterY / theMaze.gridsize)
		if (i != iTank){
			i = iTank;
			aBullet.bulletX = aTank.tankCenterX;
		}
		if (j != jTank) {
			j = jTank;
			aBullet.bulletY = aTank.tankCenterY;
		}*/
		aBullet.shootBegin = false;
	}
	
	var currentBulletGrid = theMaze.grid[i][j];
 	wallLeft = i*theMaze.gridsize;
 	wallRight = (i+1)*theMaze.gridsize;
 	wallTop = j*theMaze.gridsize;
 	wallBottom = (j+1)*theMaze.gridsize;

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
		
		
		aBullet.bulletX -=  aBullet.dbulletX * (Math.cos((180 - aBullet.bulletAngle) * Math.PI / 180)); 
		aBullet.bulletY -=  aBullet.dbulletY * (Math.sin((180 - aBullet.bulletAngle) * Math.PI / 180));
		drawbullet(aBullet.bulletX,aBullet.bulletY,aBullet.bulletRadius);
		if(aBullet.collisions > 6){
			aBullet.shoot = false;
			aBullet.collisions = 0;
		}	
}
	
