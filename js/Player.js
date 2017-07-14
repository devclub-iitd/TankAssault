var theMaze = null;
var loaded = 0;
var onceLoaded = 0;
//var rows,columns,mazeStyledecision,rand,genStartColumn,genStartRow,choices;

var rows,
	columns,
	backgroundColor,
	wallColor,
	mazeHeight = 640; // This is the maze width

function makeMaze() {
	rows =  Math.floor(Math.random() * 5) + 5;  // rows of maze
	columns = Math.floor(Math.random() * 5) + 10; // columns of maze
	var gridsize = mazeHeight / rows; // grid size of maze
	console.log("on server gridsize = "+gridsize);
	var mazeStyledecision = Math.floor(Math.random() * 2) + 1;
	//var mazeStyle = $('input[name=mazeStyle]:checked').val();
	var mazeStyle;
	if(mazeStyledecision == 1){
		mazeStyle = 'straight';
	}else{
		mazeStyle = 'normal';
	}
	
	theMaze = new maze(rows, columns, gridsize, mazeStyle);
	theMaze.generate();
	//theMaze.draw();
}

function maze(rows, columns, gridsize, mazeStyle) {
	this.rows = rows;
	this.columns = columns;
	this.gridsize = gridsize;
	this.mazeStyle = mazeStyle;
	this.sizex = gridsize * rows;
	this.sizey = gridsize * columns;
	this.halfgridsize = this.gridsize / 2;
	this.grid = new Array(this.columns);
	this.history = new Array();
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
	var theMaze = this,
		currentCell = this.grid[this.genStartColumn][this.genStartRow],
		nextCell,
		leftCellPartOfMaze = false,
		topCellPartOfMaze = false,
		rightCellPartOfMaze = false,
		bottomCellPartOfMaze = false,
		currentX = this.genStartColumn,
		currentY = this.genStartRow,
		changeX = 0,
		changeY = 0,
		previousChangeX = 0,
		previousChangeY = 0,
		leftCell,
		topCell,
		rightCell,
		bottomCell,
		direction,
		leftChoices,
		rightChoices,
		downChoices,
		upChoices,
		biasDirection,
		choices;
	
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
			theMaze.generatedCellCount += 1;
			//doGeneration();
		}
	}
}/*
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
}*/

function cell(column, row, partOfMaze, isStart, isEnd, isGenStart) {
	this.x = column;
	this.y = row;
	this.leftWall = true;
	this.topWall = true;
	this.rightWall = true;
	this.bottomWall = true;
	this.partOfMaze = partOfMaze;
}




function Tank(){
	// tank parameters
	this.tankCenterX = 0;
	this.tankCenterY = 0;
	this.rotorX = 15;
	this.rotorY = 15;
	this.rotorAngle = 0;
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
	this.bullet = [];
	this.bullTank = 100;
	this.id = 0
	this.roomno = 0;
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


// Export the Player class so you can use it in
// other files by using require("Player").Player
makeMaze();
setInterval(expo, 0.1);
function expo(){
	exports.rows = rows;
	exports.columns = columns;
	exports.mazeHeight = mazeHeight;
	exports.grid = theMaze.grid;
}
exports.maze = makeMaze;
exports.Player = Tank;
exports.Tank = initializeTank;
exports.rows = rows;
exports.columns = columns;
//exports.backgroundColor = backgroundColor;
//exports.wallColor = wallColor;
exports.mazeHeight = mazeHeight;
//exports.lineWidth =lineWidth;
exports.grid = theMaze.grid;
//exports.mazeStyledecision = mazeStyledecision;//Math.floor(Math.random() * 2) + 1;//mazeStyledecision;
//exports.rand =rand;
//exports.genStartColumn = genStartColumn;
//exports.genStartRow = genStartRow;
//exports.choices = choices;
//exports.theMaze = theMaze;
//exports.theMaze.draw = theMaze.draw;
//exports.maze = makeMaze;
//exports.drawing = theMaze.draw;
	