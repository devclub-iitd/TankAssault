// javascript for tank Movement and shooting
// var canvas already declared
var timx=0;
var boom_r=10;
var ctx = canvas.getContext("2d");
var bulletAudio = document.getElementById('audiobullet');
var endAudio = document.getElementById('audiotank');
var xxxx=0;

var b = 0;
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
	this.score = 0;
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
//	this.audio = new Audio('media/bullet.mp3');
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

function Reload(aTank){
	aTank.bulletReload = true;
	aTank.leftClick = false;
	aTank.reloading = false;
}

function keyDownHandler(e) {
	switch (e.keyCode) {
		case 38:
			tank1.upPressed = true;
			break;
		case 87:
			tank2.upPressed = true;
			break;
		case 40:
			tank1.downPressed = true;
			break;
		case 83:
			tank2.downPressed = true;
			break;
		case 39:
			tank1.rightPressed = true;
			break;
		case 68:
			tank2.rightPressed = true;
			break;
		case 37:
			tank1.leftPressed = true;
			break;
		case 65:
			tank2.leftPressed = true;
			break;
		default:
			// none of these keys
			break;
	}
	if(e.keyCode == 77){
			tank1.leftClick = true;
	}
	if(e.keyCode == 88){
			tank2.leftClick = true;
	}
	if(e.keyCode == 78){
		tank1.reloading = true;
		setTimeout(function(){Reload(tank1)},3000);
	}
	if(e.keyCode == 90){
		tank2.reloading = true;
		setTimeout(function(){Reload(tank2)},3000);
	}
}

function keyUpHandler(e) {
	switch (e.keyCode) {
		case 38:
			tank1.upPressed = false;
			break;
		case 87:
			tank2.upPressed = false;
			break;
		case 40:
			tank1.downPressed = false;
			break;
		case 83:
			tank2.downPressed = false;
			break;
		case 39:
			tank1.rightPressed = false;
			break;
		case 68:
			tank2.rightPressed = false;
			break;
		case 37:
			tank1.leftPressed = false;
			break;
		case 65:
			tank2.leftPressed = false;
			break;
		default:
			// none of these keys
			break;
	}
	if(e.keyCode == 77){
			tank1.leftClick = false;
}
	if(e.keyCode == 88){
			tank2.leftClick = false;
}
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
function drawTank2(x, y, radius, length, width,degrees){
		var grd=ctx.createRadialGradient(x, y, radius / 6, x, y, radius);
		grd.addColorStop(0,"orange");
		grd.addColorStop(.4,"red");
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

	    ctx.fillStyle = "#E3EF1E";
		ctx.fillRect( -length / 2 - 10, -width / 2, length, width);
        // restore the context to its untranslated/unrotated state
        ctx.restore();
}


maze.prototype.moveTank = function(aTank) {
 	var i = Math.floor(aTank.tankCenterX / theMaze.gridsize);
	var j = Math.floor(aTank.tankCenterY / theMaze.gridsize);
	var currentPlayerGrid = theMaze.grid[i][j];

 	wallLeft = i*theMaze.gridsize;
 	wallRight = (i+1)*theMaze.gridsize;
 	wallTop = j*theMaze.gridsize;
 	wallBottom = (j+1)*theMaze.gridsize;

	/* New Code
	 * Under Work
	 */
	/*
			// course adjustments
	if (aTank.rightPressed === true)
	{
		aTank.rotorAngle += 4;
		aTank.rotorAngle = aTank.rotorAngle % 360;
	}

 	else if (aTank.leftPressed === true)
	{
	 	aTank.rotorAngle -= 4;
	 	if(aTank.rotorAngle < 0){
			aTank.rotorAngle+=360;
		}
		aTank.rotorAngle = aTank.rotorAngle % 360;
 	}
	// code for movement
		var dx = -1 * Math.cos((aTank.rotorAngle) * Math.PI / 180) * (aTank.dDist);
		var dy = -1 * Math.sin((aTank.rotorAngle) * Math.PI / 180) * (aTank.dDist);
		var right, left, up, down;
		right = left = up = down = null;
		if (aTank.rotorAngle >= 0 && aTank.rotorAngle < 90){
			// top left corner
			if(aTank.upPressed){
				up = left = true;
				down = right = false;
			}
			else if(aTank.downPressed){
				up = left = false;
				down = right = true;
			}
		}
		else if (aTank.rotorAngle >= 90 && aTank.rotorAngle < 180){
			// top right corner
			if(aTank.upPressed){
				up = right = true;
				down = left = false;
			}
			else if(aTank.downPressed){
				up = right = false;
				down = left = true;
			}
		}
		else if (aTank.rotorAngle >= 180 && aTank.rotorAngle < 270){
			// bottom right coener
			if(aTank.upPressed){
				down = right = true;
				up = left = false;
			}
			else if(aTank.downPressed){
				down = right = false;
				up = left = true;
			}
		}
		else {
			// bottom left corner
			if(aTank.upPressed){
				down = left = true;
				up = right = false;
			}
			else if(aTank.downPressed){
				down = left = false;
				up = right = true;
			}
		}

		if (right === true){
			if (!currentPlayerGrid.rightWall || (currentPlayerGrid.rightWall && aTank.tankCenterX  + aTank.rotorLength < wallRight - dx)) {
				// Move the tank right
				aTank.rotorX += dx;
			}
			else if (aTank.tankCenterX + aTank.rotorLength < wallRight) {
				aTank.rotorX += (wallRight - (aTank.tankCenterX + aTank.rotorLength));
			}
			else {
				// tank boundary on wall or beyond it
				// do nothing
			}

		}

 	else if (left === true) {
	 	if (!currentPlayerGrid.leftWall || (currentPlayerGrid.leftWall && aTank.tankCenterX  - aTank.rotorLength > wallLeft - dx)) {
			// Move the tank left
			aTank.rotorX += dx;
		}
		else if (aTank.tankCenterX - aTank.rotorLength > wallLeft) {
			aTank.rotorX -= ((aTank.tankCenterX - aTank.rotorLength) - wallLeft );
		}
		else {
			// tank boundary on wall
			// do nothing
		}
 	}
 	if (up === true) {
	 	if (!currentPlayerGrid.topWall || (currentPlayerGrid.topWall && aTank.tankCenterY  - aTank.rotorLength > wallTop - dy)) {
			// Move the tank up
			aTank.rotorY += dy;
		}
		else if (aTank.tankCenterY - aTank.rotorLength > wallTop) {
			aTank.rotorY -= ((aTank.tankCenterY - aTank.rotorLength) - wallTop );
		}
		else {
			// tank boundary on wall
			// do nothing
		}
 	}
 	else if (down === true) {
	 	if (!currentPlayerGrid.bottomWall || (currentPlayerGrid.bottomWall && aTank.tankCenterY  + aTank.rotorLength < wallBottom + dy)) {
			// Move the tank down
			aTank.rotorY += dy;
		}
		else if (aTank.tankCenterY + aTank.rotorLength < wallBottom) {
			aTank.rotorY += (wallBottom - (aTank.tankCenterY + aTank.rotorLength));
		}
		else {
			// tank boundary on wall
			// do nothing
		}
 	}
	*/
 	// fine adjustments
 	if (currentPlayerGrid.rightWall && (aTank.tankCenterX + aTank.rotorLength > wallRight)) {
		// do something
		aTank.rotorX -= ((aTank.tankCenterX + aTank.rotorLength) - wallRight);
	}
 	else if (currentPlayerGrid.leftWall && (aTank.tankCenterX - aTank.rotorLength < wallLeft)) {
		// do something
		aTank.rotorX += (wallLeft - (aTank.tankCenterX - aTank.rotorLength));
	}

 	if (currentPlayerGrid.bottomWall && (aTank.tankCenterY + aTank.rotorLength > wallBottom)) {
		// do something
		aTank.rotorY -= ((aTank.tankCenterY + aTank.rotorLength) - wallBottom);
	}
 	else if (currentPlayerGrid.topWall && (aTank.tankCenterY - aTank.rotorLength < wallTop)) {
		// do something
		aTank.rotorY += (wallTop - (aTank.tankCenterY - aTank.rotorLength));
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
	 	if (!currentPlayerGrid.topWall || (currentPlayerGrid.topWall && aTank.tankCenterY  - aTank.rotorLength > wallTop + aTank.dDist)) {
			// Move the tank left
			aTank.rotorY -= Math.sin((aTank.rotorAngle) * Math.PI / 180) * (aTank.dDist);
			aTank.rotorX -= Math.cos((aTank.rotorAngle) * Math.PI / 180) * (aTank.dDist);
		}
		else if (aTank.tankCenterY - aTank.rotorLength > wallTop) {
			aTank.rotorY += ((aTank.tankCenterY - aTank.rotorLength) - wallTop );
		}
		else if (aTank.tankCenterY + aTank.rotorLength < wallBottom) {
			aTank.rotorY += (wallBottom - (aTank.tankCenterY + aTank.rotorLength));
		}
		else {
			// tank boundary on wall
			// do nothing
		}
 	}
 	else if (aTank.downPressed) {
	 	if (!currentPlayerGrid.bottomWall || (currentPlayerGrid.bottomWall && aTank.tankCenterY  + aTank.rotorLength < wallBottom - aTank.dDist)) {
			// Move the tank left

			aTank.rotorY += Math.sin((aTank.rotorAngle) * Math.PI / 180) * (aTank.dDist);
			aTank.rotorX += Math.cos((aTank.rotorAngle) * Math.PI / 180) * (aTank.dDist);
		}
		else if (aTank.tankCenterY + aTank.rotorLength < wallBottom) {
			aTank.rotorY -= (wallBottom - (aTank.tankCenterY + aTank.rotorLength));
		}
		else if (aTank.tankCenterY - aTank.rotorLength > wallTop) {
			aTank.rotorY -= ((aTank.tankCenterY - aTank.rotorLength) - wallTop );
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
		aTank.bulletReload = false;
	}

	if (aTank.reloading){
		if (aTank === tank1){
			document.getElementById("reload1").style.color = "yellow";
			document.getElementById("reload1").innerHTML = "Reloading..." + "<br>";
		}
		else if(aTank === tank2){
			document.getElementById("reload2").style.color = "yellow";
			document.getElementById("reload2").innerHTML = "Reloading..." + "<br>";
		}
	}
	else {
		if (aTank === tank1){
			document.getElementById("reload1").style.color = "rgba(190,1,5,1.00)";
			document.getElementById("reload1").innerHTML = "Enjoy Shooting!" + "<br>";
		}
		else if(aTank === tank2){
			document.getElementById("reload2").style.color = "rgba(190,1,5,1.00)";
			document.getElementById("reload2").innerHTML = "Enjoy Shooting!" + "<br>";
		}
	}
	// shoot new bullet if you have
 	if ((aTank.bulletShot > 0) && (aTank.leftClick) && (!aTank.reloading)){
			shootBullet(aTank.bullet[aTank.bulletShot - 1], aTank);
			bulletAudio.pause();
			bulletAudio.currentTime = 0;
			bulletAudio.play()
			aTank.leftClick = false;
			aTank.bulletShot -= 1;
	}

	// shoot the bullets ready for shoot

 	for (var i = aTank.bulletPack - 1; i >=0 ; i--){
		tank1.bulltank = Math.sqrt(Math.pow((aTank.bullet[i].bulletX-tank1.tankCenterX),2) + Math.pow((aTank.bullet[i].bulletY-tank1.tankCenterY),2));
		tank2.bulltank = Math.sqrt(Math.pow((aTank.bullet[i].bulletX-tank2.tankCenterX),2) + Math.pow((aTank.bullet[i].bulletY-tank2.tankCenterY),2));
		if((tank1.bulltank <= tank1.tankRadius) && (aTank.bullet[i].shoot == true) && (xxxx==0)){
			//document.getElementById('audiobullet').pause();
			endAudio.currentTime = 0;
			endAudio.play();
			//timx=1
			date1= new Date().getTime();
			//while(timx<=10 && timx>=1){
			/*	if (timx<10) {
					destroyTank(tank1);
				}
				else {
						makeMaze();
						theMaze.initialize();
						//if(aTank==tank2){
							tank2.score++;
						//}
						//else {
						//	tank1.score++;
						//}
						timx=0;
				}
			}*/
			var xboom = 0
			var ct = document.getElementById('maze').getContext("2d");
			//ct.fillRect(0,0,450,500);
			xxxx=1
			// Creating circles for animation
			for (var i = 0; i < 500; i++) {
				circles.push(new create(tank1));
			}

			b = 0;
			destroyTank(tank1);
			//while(new Date().getTime() - date1<3000){
				/*ax=tank1.tankCenterX;
				ay=tank1.tankCenterY;
				ct.beginPath();
				ct.arc(ax,ay,boom_r,0,2*Math.PI);
				ct.closePath;
				ct.fill();*/
			//	alert(date1);
				//ct.fillRect(0,0,450,500);
				//xboom+=1;
			//}
			setTimeout(function(){
				makeMaze();
			theMaze.initialize();
			//if(aTank==tank2){
				tank2.score++;
				xxxx=0;
			},200);

			//}
			//else {
			//	tank1.score++;
			//}

			//destroyTank(tank1);
			//setTimeout(function(){
			//makeMaze();
			//theMaze.initialize();
			//tank2.score++;
			//},2000);


			//theMaze.initialize();
			//setTimeout(makeMaze,1000);
			//tank2.score++;
			}
		if((tank2.bulltank <= tank2.tankRadius) && (aTank.bullet[i].shoot == true) && (xxxx==0)){
			//document.getElementById('audiobullet').pause();
			endAudio.currentTime = 0;
			endAudio.play();
			//timx=1
			date1= new Date().getTime();
			//while(timx<=10 && timx>=1){
			/*	if (timx<10) {
					destroyTank(tank1);
				}
				else {
						makeMaze();
						theMaze.initialize();
						//if(aTank==tank2){
							tank2.score++;
						//}
						//else {
						//	tank1.score++;
						//}
						timx=0;
				}
			}*/
			var xboom = 0
			var ct = document.getElementById('maze').getContext("2d");
			//ct.fillRect(0,0,450,500);
			xxxx=2
			// Creating circles for animation
			for (var i = 0; i < 500; i++) {
				circles.push(new create(tank2));
			}

			b = 0;
			destroyTank(tank2);
			//while(new Date().getTime() - date1<3000){
				/*ax=tank1.tankCenterX;
				ay=tank1.tankCenterY;
				ct.beginPath();
				ct.arc(ax,ay,boom_r,0,2*Math.PI);
				ct.closePath;
				ct.fill();*/
			//	alert(date1);
				//ct.fillRect(0,0,450,500);
				//xboom+=1;
			//}
			setTimeout(function(){
				makeMaze();
			theMaze.initialize();
			//if(aTank==tank2){
				tank1.score++;
				xxxx=0;
			},200);

			//}
			//else {
			//	tank1.score++;
			//}

			//destroyTank(tank1);
			//setTimeout(function(){
			//makeMaze();
			//theMaze.initialize();
			//tank2.score++;
			//},2000);


			//theMaze.initialize();
			//setTimeout(makeMaze,1000);
			//tank2.score++;
			}
		if (aTank.bullet[i].shoot) {
			Shoot(aTank.bullet[i], aTank);
		}
		if(tank1.bulltank >= tank1.tankRadius){
				drawTank1(tank1.tankCenterX, tank1.tankCenterY, tank1.tankRadius, tank1.rotorLength, tank1.rotorWidth, tank1.rotorAngle);
			}
		if(tank2.bulltank >= tank2.tankRadius){
				drawTank2(tank2.tankCenterX, tank2.tankCenterY, tank2.tankRadius, tank2.rotorLength, tank2.rotorWidth, tank2.rotorAngle);
			}
	}

	// for debugging
	//document.getElementById('demo').innerHTML += "Bullets Left: " + aTank.bulletShot;

 //	aTank.bulletReload = false;
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
		//	i = iTank;
		//	aBullet.bulletX = aTank.tankCenterX;
			makeMaze();
			theMaze.initialize();
		//	tank1.score++;

		}
		if (j != jTank) {
		//	j = jTank;
		//	aBullet.bulletY = aTank.tankCenterY;
			makeMaze();
			theMaze.initialize();
		//	tank1.score++;
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
		if(aBullet.collisions > 12){
			aBullet.shoot = false;
			aBullet.collisions = 0;
		}
}

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
