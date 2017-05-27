var	canvas = document.getElementById('maze');
var context = canvas.getContext('2d');	
	context.font = "bold 20px sans-serif";
	//$(document).keydown(handleKeypress);
//var canvas;
//var context;
var theMaze = null;
var loaded = 0;
var onceLoaded = 0;
var bulletPack = 6;
var tank = null;
var bullet = null;

function generate() {
	makeMaze();
	tank = new Tank();
	bullet = new Array();
	for (var i = 0; i < bulletPack; i++)
    	bullet.push(new Bullet());
	
	theMaze.draw();
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

function makeMaze() {
	var rows =  Math.floor(Math.random() * 5) + 5;  // rows of maze
	var columns = Math.floor(Math.random() * 5) + 5; // columns of maze
	var gridsize = 400 / rows; // grid size of maze
	var mazeStyledecision = Math.floor(Math.random() * 2) + 1;
	//var mazeStyle = $('input[name=mazeStyle]:checked').val();
	if(mazeStyledecision == 1){
		var mazeStyle = 'straight';
	}else{
		var mazeStyle = 'normal';
	}
	var startColumn = 0;
	var startRow = 0;
	var endColumn = columns - 1;
	var endRow = rows - 1;
	var wallR = 0;
	var wallG = 0;
	var wallB = 0;
	var backgroundR = 255;
	var backgroundG = 255;
	var backgroundB = 255;
	var solutionR = $('#solutionR').val();
	var solutionG = $('#solutionG').val();
	var solutionB = $('#solutionB').val();
	
	var wallColor = "rgb(" + wallR + "," + wallG + "," + wallB + ")";
	var backgroundColor = "rgb(" + backgroundR + "," + backgroundG + "," + backgroundB + ")";
	var solutionColor = "rgb(" + solutionR + "," + solutionG + "," + solutionB + ")";
	theMaze = new maze(rows, columns, gridsize, mazeStyle, startColumn, startRow, endColumn, endRow, wallColor, backgroundColor, solutionColor);
	theMaze.generate();
	theMaze.draw();
}

function maze(rows, columns, gridsize, mazeStyle, startColumn, startRow, endColumn, endRow, wallColor, backgroundColor, solutionColor) {
	this.rows = rows;
	this.columns = columns;
	this.gridsize = gridsize;
	this.mazeStyle = mazeStyle;
	this.sizex = gridsize * rows;
	this.sizey = gridsize * columns;
	this.halfgridsize = this.gridsize / 2;
	this.grid = new Array(this.columns);
	this.history = new Array();
	this.startColumn = parseInt(startColumn);
	this.startRow = parseInt(startRow);
	this.endColumn = parseInt(endColumn);
	this.endRow = parseInt(endRow);
	this.wallColor = wallColor;
	this.backgroundColor = backgroundColor;
	this.solutionColor = solutionColor;
	this.lineWidth = this.gridsize / 60;
	this.genStartColumn = Math.floor(Math.random() * (this.columns- 1));
	this.genStartRow = Math.floor(Math.random() * (this.rows- 1));
	this.cellCount = this.columns * this.rows;
	this.generatedCellCount = 0;
	for (i = 0; i < columns; i++) {
		this.grid[i] = new Array(rows);		
	}
	for (j = 0; j < this.columns; j++) {
		for (k = 0; k < this.rows; k++) {
			var isStart = false;
			var isEnd = false;
			var partOfMaze = false;
			var isGenStart = false;
			if (j == this.startColumn && k == this.startRow) {
				isStart = true;
			}
			if (j == this.genStartColumn && k == this.genStartRow) {
				partOfMaze = true;
				isGenStart = true;
			}
			if (j == this.endColumn && k == this.endRow) {
				isEnd = true;		
			}
			this.grid[j][k] = new cell(j, k, partOfMaze, isStart, isEnd, isGenStart);
		}
	}
}
maze.prototype.generate = function() {
	var theMaze = this;
	var currentCell = this.grid[this.genStartColumn][this.genStartRow];
	var nextCell;
	var leftCellPartOfMaze = false;
	var topCellPartOfMaze = false;
	var rightCellPartOfMaze = false;
	var bottomCellPartOfMaze = false;
	var currentX = this.genStartColumn;
	var currentY = this.genStartRow;
	var changeX = 0;
	var changeY = 0;
	var previousChangeX = 0;
	var previousChangeY = 0;
	var leftCell;
	var topCell;
	var rightCell;
	var bottomCell;
	var direction;
	var leftChoices;
	var rightChoices;
	var downChoices;
	var upChoices;
	var biasDirection;
	var choices;
	while (this.generatedCellCount < this.cellCount - 1) {
		doGeneration();	
	}
	function chooseCell() {
		changeX = 0;
		changeY = 0;
		choices = [];
		biasDirection = '';
		if (previousChangeX == -1) {
			biasDirection = 'left';	
		} else if (previousChangeX == 1) {
			biasDirection = 'right';
		} else if (previousChangeY == -1) {
			biasDirection = 'up';
		} else if (previousChangeY == 1) {
			biasDirection = 'down';
		}
		direction = '';
		leftChoices = [0, 0, 0, 0, 0];
		upChoices = [1, 1, 1, 1, 1];
		rightChoices = [2, 2, 2, 2, 2];
		downChoices = [3, 3, 3, 3, 3];
		switch (theMaze.mazeStyle) {
		case "straight": {
			leftChoices = [0];
			upChoices = [1];
			rightChoices = [2];
			downChoices = [3];		
			if (biasDirection == 'left') {
				leftChoices = [0, 0, 0, 0, 0, 0, 0, 0];				
			} else if (biasDirection == 'right') {
				rightChoices = [2, 2, 2, 2, 2, 2, 2, 2];		
			} else if (biasDirection == 'down') {
				downChoices = [3, 3, 3, 3, 3, 3, 3, 3];	
			} else if (biasDirection == 'up') {
				upChoices = [1, 1, 1, 1, 1, 1, 1, 1]		
			}
			break;
		}
		case "normal": {
			leftChoices = [0];
			upChoices = [1];
			rightChoices = [2];
			downChoices = [3];
			break;
		}
		}
		choices = leftChoices.concat(rightChoices.concat(downChoices.concat(upChoices)));
		var rand = Math.floor(Math.random() * choices.length);
		var weightedRand = choices[rand];
		switch(weightedRand) {
		case 0: {
			nextCell = leftCell;
			changeX = -1;
			direction = 'left';
			break;				
		}
		case 1: {
			nextCell = topCell;
			changeY = -1;
			direction = 'up';
			break;	
		}
		case 2: {
			nextCell = rightCell;
			changeX = 1;
			direction = 'right';
			break;
		}
		case 3: {
			nextCell = bottomCell;
			changeY = 1;
			direction = 'down';
			break;	
		}
		default: {
			nextCell = null;
			changeY = 0;
			changeX = 0;
			break;		
		}
		}

		if (nextCell == null || nextCell.partOfMaze == true) {
			chooseCell();	
		} else {
			currentX += changeX;
			currentY += changeY;
			previousChangeX = changeX;
			previousChangeY = changeY;
			theMaze.history.push(direction);
		}
	}
	function addToMaze() {
		nextCell.partOfMaze = true;
		if (changeX == -1) {
			currentCell.leftWall = false;
			nextCell.rightWall = false;
		}
		if (changeY == -1) {
			currentCell.topWall = false;
			nextCell.bottomWall = false;
		}
		if (changeX == 1) {
			currentCell.rightWall = false;
			nextCell.leftWall = false;
		}
		if (changeY == 1) {
			currentCell.bottomWall = false;
			nextCell.topWall = false;
		}
	}
	function doGeneration() {
		//stop generation if the maze is full
		if (theMaze.generatedCellCount == theMaze.cellCount - 1) {
			return;		
		}
		//do actual generation
		changeX = 0;
		changeY = 0;
		if (currentX > 0) {
			leftCell = theMaze.grid[currentX - 1][currentY];
			leftCellPartOfMaze = leftCell.partOfMaze;
		} else {
			leftCell = null;
			leftCellPartOfMaze = true;
		}	
		if (currentY > 0) {
			topCell = theMaze.grid[currentX][currentY - 1];
			topCellPartOfMaze = topCell.partOfMaze;
			
		} else {
			topCell = null;	
			topCellPartOfMaze = true;
		}
		if (currentX < (theMaze.columns - 1)) {
			rightCell = theMaze.grid[currentX + 1][currentY];
			rightCellPartOfMaze = rightCell.partOfMaze;
		} else {
			rightCell = null;
			rightCellPartOfMaze = true;
		}
		if (currentY < (theMaze.rows - 1)) {
			bottomCell = theMaze.grid[currentX][currentY + 1];
			bottomCellPartOfMaze = bottomCell.partOfMaze;
		} else {
			bottomCell = null;
			bottomCellPartOfMaze = true;
		}
		if (leftCellPartOfMaze == true && topCellPartOfMaze == true && rightCellPartOfMaze == true && bottomCellPartOfMaze == true) {
			//go back and check previous cell for generation
			var lastDirection = theMaze.history.pop();
			changeX = 0;
			changeY = 0;
			switch (lastDirection) {
			case 'left': {
				changeX = 1;
				break;			
			}
			case 'up': {
				changeY = 1;
				break;				
			}			
			case 'right': {
				changeX = -1;
				break;				
			}
			case 'down': {
				changeY = -1;
				break;
			}
			}
			nextCell = theMaze.grid[currentX + changeX][currentY + changeY];
			currentX += changeX;
			currentY += changeY;
			currentCell = nextCell;
				doGeneration();

		} else {
			chooseCell();
			addToMaze();	
			currentCell = nextCell;
			//console.log(currentCell);
			theMaze.generatedCellCount += 1;
			//doGeneration();
		}
	}
}
maze.prototype.draw = function() {
	var totalWidth = this.columns * this.gridsize;
	var totalHeight = this.rows * this.gridsize;
	$('#maze').attr("width", totalWidth);
	$('#maze').attr("height", totalHeight);
	//document.getElementById("maze").style.margin-left = "600";
	context.clearRect(0, 0, totalWidth, totalHeight);
	for (j = 0; j < this.columns; j++) {
		for (k = 0; k < this.rows; k++) {
			var limit = this.lineWidth;
			var drawX = (j * this.gridsize);
			var drawY = (k * this.gridsize);
			var pastX = parseInt(drawX) + parseInt(this.gridsize);
			var pastY = parseInt(drawY) + parseInt(this.gridsize);
			var theCell = this.grid[j][k];
			//this.drawColors(theCell);
			context.lineWidth = this.lineWidth;
			context.fillStyle = this.backgroundColor;
			context.strokeStyle = this.wallColor;
			context.fillRect(drawX, drawY, this.gridsize, this.gridsize);	
			
			context.beginPath();
			if (theCell.leftWall == true) {
				//context.strokeRect(drawX, drawY, 1, this.gridsize);
				context.moveTo(drawX, drawY - limit);
				context.lineTo(drawX, pastY + limit);
			}
			if (theCell.topWall == true) {
				//context.strokeRect(drawX, drawY, this.gridsize, 1);
				context.moveTo(drawX - limit, drawY);
				context.lineTo(pastX + limit, drawY);
			}
			if (theCell.rightWall == true) {
				//context.strokeRect((drawX + this.gridsize), drawY, 1, this.gridsize);
				context.moveTo(pastX, drawY - limit);
				context.lineTo(pastX, pastY + limit);
			}
			if (theCell.bottomWall == true) {
				//context.strokeRect(drawX, (drawY + this.gridsize), this.gridsize, 1);	
				context.moveTo(drawX - limit, pastY);
				context.lineTo(pastX + limit, pastY);
			}
			context.closePath();
			context.stroke();
			
			context.lineWidth = this.lineWidth + 1;
			context.strokeStyle = this.backgroundColor;
			context.beginPath();
			if (theCell.leftWall == false) {
				//context.strokeRect(drawX, drawY, 1, this.gridsize);
				context.moveTo(drawX, drawY + limit);
				context.lineTo(drawX, pastY - limit);
			}
			if (theCell.topWall == false) {
				//context.strokeRect(drawX, drawY, this.gridsize, 1);
				context.moveTo(drawX + limit, drawY);
				context.lineTo(pastX - limit, drawY);
			}
			if (theCell.rightWall == false) {
				//context.strokeRect((drawX + this.gridsize), drawY, 1, this.gridsize);
				context.moveTo(pastX, drawY + limit);
				context.lineTo(pastX, pastY - limit);
			}
			if (theCell.bottomWall == false) {
				//context.strokeRect(drawX, (drawY + this.gridsize), this.gridsize, 1);	
				context.moveTo(drawX + limit, pastY);
				context.lineTo(pastX - limit, pastY);
			}
			context.closePath();
			context.stroke();
		}
	}
}

function cell(column, row, partOfMaze, isStart, isEnd, isGenStart) {
	this.x = column;
	this.y = row;
	this.leftWall = true;
	this.topWall = true;
	this.rightWall = true;
	this.bottomWall = true;
	this.partOfMaze = partOfMaze;
}







// javascript for tank
//function makeTank() {
//var canvas = document.getElementById("maze");
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
}

function initializeTank(aTank) {
	// tank parameters
	aTank.tankCenterX = theMaze.gridsize / 30;
	aTank.tankCenterY = theMaze.gridsize / 30;
	aTank.rotorX = aTank.tankCenterX + 15;
	aTank.rotorY = aTank.tankCenterY + 15;
	aTank.rotorAngle;
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

var bulletReload = false;
var leftClick = false;
var bulletShot = bulletPack;

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
			tank.upPressed = true;
			break;
		case 40:
			tank.downPressed = true;
			break;
		case 39:
			tank.rightPressed = true;
			break;
		case 37:
			tank.leftPressed = true;
			break;
		default:
			// none of these keys
			break;
	}
}

function keyUpHandler(e) {
	switch (e.keyCode) {
		case 38:
			tank.upPressed = false;
			break;
		case 40:
			tank.downPressed = false;
			break;
		case 39:
			tank.rightPressed = false;
			break;
		case 37:
			tank.leftPressed = false;
			break;
		default:
			// none of these keys
			break;
	}
}

function mouseMoveHandler(e) {
   var relativeX = e.clientX - canvas.offsetLeft;
	tank.rotorAngle = relativeX/2;
	if(tank.rotorAngle < 0)
	{
		tank.rotorAngle += 360;
	}
	tank.rotorAngle = tank.rotorAngle % 360;
}

function rightclick(event){
	if(event.button == 2){
		bulletReload = true;
		leftClick = false;
	}
	else if(event.button == 0){
			leftClick = true;
			bulletReload = false;
	}
}

function drawTank(x, y, radius, length, width,degrees){
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
	initializeTank(tank);
	for (var i = 0; i < bulletPack; i++)
    	initializeBullet(tank, bullet[i]);
	if (onceLoaded > 0) {	
		document.addEventListener("keydown", keyDownHandler, false);
		document.addEventListener("keyup", keyUpHandler, false);
		document.addEventListener("mousemove", mouseMoveHandler, false);
			
		onceLoaded = -1;
	}
	bulletReload = true;
}


maze.prototype.playGame = function() {
	// useful when having more than one tank
	 theMaze.drawing(tank);
 }

maze.prototype.drawing = function(aTank) {
 	var i = Math.floor(aTank.tankCenterX / theMaze.gridsize)
	var j = Math.floor(aTank.tankCenterY / theMaze.gridsize)
	var currentPlayerGrid = theMaze.grid[i][j];
	
 	wallLeft = i*theMaze.gridsize;
 	wallRight = (i+1)*theMaze.gridsize;
 	wallTop = j*theMaze.gridsize;
 	wallBottom = (j+1)*theMaze.gridsize;
	//console.log(i);
	//console.log(currentPlayerGrid.rightWall);
 
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
 
	//console.log(Mpressed);
 	if (aTank.rightPressed === true){
		if (!currentPlayerGrid.rightWall || (currentPlayerGrid.rightWall && aTank.tankCenterX  + aTank.tankRadius < wallRight - aTank.dDist)) {
			// Move the tank left
			aTank.rotorX += aTank.dDist;
		}
		else if (aTank.tankCenterX + aTank.tankRadius < wallRight) {
			aTank.rotorX += (wallRight - (aTank.tankCenterX + aTank.tankRadius));
		}
		else {
			// tank boundary on wall or beyond it
			// do nothing
		}
		
	}
 
 	else if (aTank.leftPressed === true) {
	 	if (!currentPlayerGrid.leftWall || (currentPlayerGrid.leftWall && aTank.tankCenterX  - aTank.tankRadius > wallLeft + aTank.dDist)) {
			// Move the tank left
			aTank.rotorX -= aTank.dDist;
		}
		else if (aTank.tankCenterX - aTank.tankRadius > wallLeft) {
			aTank.rotorX -= ((aTank.tankCenterX - aTank.tankRadius) - wallLeft );
		}
		else {
			// tank boundary on wall
			// do nothing
		}
 	}
 	if (aTank.upPressed) {
	 	if (!currentPlayerGrid.topWall || (currentPlayerGrid.topWall && aTank.tankCenterY  - aTank.tankRadius > wallTop + aTank.dDist)) {
			// Move the tank left
			aTank.rotorY -= aTank.dDist;
		}
		else if (aTank.tankCenterY - aTank.tankRadius > wallTop) {
			aTank.rotorY -= ((aTank.tankCenterY - aTank.tankRadius) - wallTop );
		}
		else {
			// tank boundary on wall
			// do nothing
		}
 	}
 	else if (aTank.downPressed) {
	 	if (!currentPlayerGrid.bottomWall || (currentPlayerGrid.bottomWall && aTank.tankCenterY  + aTank.tankRadius < wallBottom - aTank.dDist)) {
			// Move the tank left
			aTank.rotorY += aTank.dDist;
		}
		else if (aTank.tankCenterY + aTank.tankRadius < wallBottom) {
			aTank.rotorY += (wallBottom - (aTank.tankCenterY + aTank.tankRadius));
		}
		else {
			// tank boundary on wall
			// do nothing
		}
 	}
 	
 	aTank.tankCenterX = aTank.rotorX + aTank.rotorLength / 2;
	aTank.tankCenterY = aTank.rotorY + aTank.rotorWidth / 2;
 	theMaze.draw();
 	
	
	// Some Shooting....
	if (bulletReload){
		// reset each bullet and fill bulletPack
	/*	for (var i = bulletPack - 1; i >=0 ; i--){
				bullet[i].collisions = 0;
				bullet[i].shoot = false;
//				bulletReload = false;
//				document.getElementById('demo').innerHTML = "Relax";
		}*/
		bulletShot = bulletPack;
	}
	
	// shoot new bullet if you have
 	if (bulletShot > 0 && leftClick){
			shootBullet(bullet[bulletShot - 1]);
	//		bullet[bulletShot - 1].shoot = true;
			leftClick = false;
			bulletShot -= 1;
	//		document.getElementById('demo').innerHTML = "Beware!";
	}
	
	// shoot the bullets ready for shoot
 	
 	for (var i = bulletPack - 1; i >=0 ; i--){
		var x = 0;
		if (bullet[i].shoot) {
			Shoot(bullet[i]);
		}
	}
	
	// for debugging
	document.getElementById('demo').innerHTML = bulletShot + " " + leftClick + bulletReload + bullet[0].shoot + bullet[5].shoot;
	
	//bulletReload = false;
	drawTank(aTank.tankCenterX, aTank.tankCenterY, aTank.tankRadius, aTank.rotorLength, aTank.rotorWidth, aTank.rotorAngle);
 	//theMaze.draw();
 	bulletReload = false;
 	leftClick = false;
// 	if (bullet[0].shoot === false) document.getElementById('demo').innerHTML = "Relax";
		// for debugging
//	document.getElementById('demo').innerHTML = bulletShot;
	//	document.getElementById("demo").innerHTML = /*" "+ tankX + " " + tankY + " " + leftPressed + rightPressed + " " + upPressed + " " + downPressed + " " + tankCenterX + " " + tankCenterY + " Left:" + currentPlayerGrid.leftWall + " Right:" + currentPlayerGrid.rightWall + " Top:" + currentPlayerGrid.topWall + " Bottom:" + currentPlayerGrid.bottomWall + " " + loaded + Mpressed + " " + shoot + */" " /*+ rotorAngle*/ + "<br>Wait till " + bullet1.collisions + " collisoins or reload to fire next bullet" + bullet1.bulletX + bullet1.leftClick + bullet1.bulletReload;
}



function drawbullet(bulletX,bulletY,bulletRadius){
	context.beginPath();
	context.fillStyle = "black";
	context.arc(bulletX, bulletY, bulletRadius, 0, 2 * Math.PI);
	context.fill();
	context.closePath();
	leftClick = false;
	}

function shootBullet(aBullet) {
	aBullet.bulletX = tank.tankCenterX - tank.rotorLength * (Math.cos(tank.rotorAngle * Math.PI / 180));
	aBullet.bulletY = tank.tankCenterY - tank.rotorLength * (Math.sin(tank.rotorAngle * Math.PI / 180));;
	aBullet.bulletAngle = tank.rotorAngle;
	aBullet.collisions = 0;
	//console.log(rotorAngle);
//	drawbullet(bulletX,bulletY);
	aBullet.shoot = true;
	//aBullet.shootBegin = true;
	Shoot(aBullet);
}
function Shoot(aBullet){
	var i = Math.floor(aBullet.bulletX / theMaze.gridsize)
	var j = Math.floor(aBullet.bulletY / theMaze.gridsize)
/*	if (aBullet.shootBegin === true){
		if (i < 0 || i >= theMaze.columns || j < 0 || j >= theMaze.rows) {
			aBullet.shoot = false;
			return;
		}
		var iTank = Math.floor(tank.tankCenterX / theMaze.gridsize)
		var jTank = Math.floor(tank.tankCenterY / theMaze.gridsize)
		if (i != iTank){
			i = iTank;
			aBullet.bulletX = tank.tankCenterX;
		}
		if (j != jTank) {
			j = jTank;
			aBullet.bulletY = tank.tankCenterY;
		}
		aBullet.shootBegin = false;
	}*/
//	console.log(aBullet.bulletX);
//	document.getElementById('demo').innerHTML = " " + aBullet.bulletX;
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
	
