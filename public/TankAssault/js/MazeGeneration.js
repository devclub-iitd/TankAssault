// JavaScript Document for Generation of Maze
var	canvas = document.getElementById('maze');
var context = canvas.getContext('2d');	
context.font = "bold 20px sans-serif";
var theMaze = null;
var loaded = 0;
var onceLoaded = 0;

//var mazeHeight = 600;
//var socket = io();
// maze parameters from server
var rows1,
	columns1,
	lineWidth1,
	backgroundColor1,
	grid1,
	mazeHeight1;

var mazeBackgroundColor = "#e5f2c8";

/* walls */
var imgNeedle = new Image();
imgNeedle.src = '../TankAssault/images/wallNeedle.png';
imgNeedle.width = 10;
var grassImage = new Image();
grassImage.src = '../TankAssault/images/grass2.PNG';

/*function distanceBetween(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}
function angleBetween(point1, point2) {
  return Math.atan2( point2.x - point1.x, point2.y - point1.y );
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}*/
function makeNeedleWall(start, dist, pos)
{
  //var dist = distanceBetween(coord1, coord2);
  var angle;// = angleBetween(coord1, coord2);
  //angle = 
  switch(pos)
  {
	  case "left":
		  angle = Math.PI;
		  break;
	  case "top":
		  angle = Math.PI / 2;
		  break;
	  case "bottom":
		  angle = -Math.PI / 2;
		  break;
	  case "right":
		  angle = 0;
		  break;
	  default:
		  angle = 0;
  }
  //console.log(pos+"->"+angle);
  //for (var i = 0; i < dist; i++) {
    //x = coord1.x + (Math.sin(angle) * i);
    //y = coord1.y + (Math.cos(angle) * i);
    ctx.save();
    //ctx.translate(x, y);
	/*if (pos == "left")
		ctx.translate(coord1.x+dist/8, coord1.y);
	else*/
		ctx.translate(start.x, start.y);
   // ctx.scale(0.5, 0.5);
	ctx.rotate(-angle + 90 * Math.PI / 180);
    //ctx.rotate(Math.PI * 180 / getRandomInt(0, 180));
	  //ctx.rotate(Math.PI * 180);
	if (Math.abs(angle) < 0.2 || Math.abs(angle - Math.PI) < 0.2)
    	ctx.drawImage(grassImage, 0, 0, dist, dist / 8);
	else if (Math.abs(angle - Math.PI / 2) < 0.2)
		ctx.drawImage(grassImage, -dist*.1, 0, dist*1.1, dist / 8);
	else 
		ctx.drawImage(grassImage, +dist*.1, 0, dist*1.1, dist / 8);
		//ctx.drawImage(imgNeedle, 0, 0);
    ctx.restore();
  //}
}

function makeMaze() {
	// maze parameters
	var rows =  Math.floor(Math.random() * 4) + 5,
		columns = Math.floor(Math.random() * 5) + 7,
	 	gridsize = (mazeHeight / rows),
	 	mazeStyledecision = Math.floor(Math.random() * 2) + 1;
	
	while(columns * gridsize > 900 || columns * gridsize < 800)
	{
		console.log("in col loop");
		rows =  Math.floor(Math.random() * 5) + 5;  // rows of maze
		columns = Math.floor(Math.random() * 5) + 10; // columns of maze
		gridsize = mazeHeight / rows; // grid size of maze
	}
	console.log("on client gridsize = "+gridsize);
	
	var mazeStyle;
	if(mazeStyledecision == 1){
		mazeStyle = 'straight';
	}else{
		mazeStyle = 'normal';
	}
	
	// actual maze
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
	this.startColumn = 0;
	this.startRow = 0;
	this.endColumn = columns - 1;
	this.endRow = rows - 1;
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
		//console.log("rosss " + choices);
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
}
maze.prototype.draw = function() {
	var totalWidth = this.columns * this.gridsize;
	var totalHeight = this.rows * this.gridsize;
	$('#maze').attr("width", totalWidth);
	$('#maze').attr("height", totalHeight);
	//document.getElementById("maze").style.margin-left = "600";
	context.clearRect(0, 0, totalWidth, totalHeight);
	context.fillStyle = mazeBackgroundColor;
	context.fillRect(0, 0, totalWidth, totalHeight);
	for (j = 0; j < this.columns; j++) {
		for (k = 0; k < this.rows; k++) {
			var limit = this.lineWidth;
			var drawX = (j * this.gridsize);
			var drawY = (k * this.gridsize);
			var distance = parseInt(this.gridsize);
			var pastX = parseInt(drawX) + distance;
			var pastY = parseInt(drawY) + distance;
			var theCell = this.grid[j][k];
			//this.drawColors(theCell);
			//context.lineWidth = this.lineWidth;
			
				
			context.beginPath();
			//context.lineJoin="round";
			
			if (theCell.leftWall == true) {
				//context.strokeRect(drawX, drawY, 1, this.gridsize);
				//context.moveTo(drawX, drawY - limit);
				//context.lineTo(drawX, pastY + limit);
				makeNeedleWall({x:drawX, y:pastY + limit},distance, "left");
			}
			if (theCell.topWall == true) {
				//context.strokeRect(drawX, drawY, this.gridsize, 1);
				//context.moveTo(drawX - limit, drawY);
				//context.lineTo(pastX + limit, drawY);
				makeNeedleWall({x:drawX - limit,y:drawY},distance, "top");
			}
			if (theCell.rightWall == true) {
				//context.strokeRect((drawX + this.gridsize), drawY, 1, this.gridsize);
				//context.moveTo(pastX, drawY - limit);
				//context.lineTo(pastX, pastY + limit);
				makeNeedleWall({x:pastX,y:drawY - limit},distance, "right");
			}
			if (theCell.bottomWall == true) {
				//context.strokeRect(drawX, (drawY + this.gridsize), this.gridsize, 1);	
				//context.moveTo(drawX - limit, pastY);
				//context.lineTo(pastX + limit, pastY);
				makeNeedleWall( {x:pastX + limit, y:pastY},distance, "bottom");
			}/*
			if (j === this.columns - 1) {
				//draw right border
				makeNeedleWall({x:pastX,y:drawY - limit}, {x:pastX, y:pastY + limit});
			}
			if (k === this.rows - 1) {
				// draw bottom border
				makeNeedleWall({x:drawX - limit,y:pastY}, {x:pastX + limit, y:pastY});
			}*/
			context.closePath();
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

function drawmaze(){
	this.rows = rows1;
	this.columns = columns1;
	this.backgroundColor = backgroundColor1;
	this.grid = grid1;
	this.gridsize = mazeHeight1/rows1;
	this.lineWidth = gridsize/60;
	//console.log("all" + rows + " " + backgroundColor + " " + wallColor + " " + grid + " " + columns);
	var totalWidth = this.columns * this.gridsize;
	var totalHeight = this.rows * this.gridsize;
	$('#maze').attr("width", totalWidth);
	$('#maze').attr("height", totalHeight);
	//document.getElementById("maze").style.margin-left = "600";
	context.clearRect(0, 0, totalWidth, totalHeight);
	context.fillStyle = mazeBackgroundColor;
	context.fillRect(0, 0, totalWidth, totalHeight);
	for (j = 0; j < this.columns; j++) {
		for (k = 0; k < this.rows; k++) {
			var limit = this.lineWidth;
			var drawX = (j * this.gridsize);
			var drawY = (k * this.gridsize);
			var distance = parseInt(this.gridsize);
			var pastX = parseInt(drawX) + distance;
			var pastY = parseInt(drawY) + distance;
			var theCell = this.grid[j][k];
			//this.drawColors(theCell);
			//context.lineWidth = this.lineWidth;
			
				
			context.beginPath();
			//context.lineJoin="round";
			
			if (theCell.leftWall == true) {
				//context.strokeRect(drawX, drawY, 1, this.gridsize);
				//context.moveTo(drawX, drawY - limit);
				//context.lineTo(drawX, pastY + limit);
				makeNeedleWall({x:drawX, y:pastY + limit},distance, "left");
			}
			if (theCell.topWall == true) {
				//context.strokeRect(drawX, drawY, this.gridsize, 1);
				//context.moveTo(drawX - limit, drawY);
				//context.lineTo(pastX + limit, drawY);
				makeNeedleWall({x:drawX - limit,y:drawY},distance, "top");
			}
			if (theCell.rightWall == true) {
				//context.strokeRect((drawX + this.gridsize), drawY, 1, this.gridsize);
				//context.moveTo(pastX, drawY - limit);
				//context.lineTo(pastX, pastY + limit);
				makeNeedleWall({x:pastX,y:drawY - limit},distance, "right");
			}
			if (theCell.bottomWall == true) {
				//context.strokeRect(drawX, (drawY + this.gridsize), this.gridsize, 1);	
				//context.moveTo(drawX - limit, pastY);
				//context.lineTo(pastX + limit, pastY);
				makeNeedleWall( {x:pastX + limit, y:pastY},distance, "bottom");
			}/*
			if (j === this.columns - 1) {
				//draw right border
				makeNeedleWall({x:pastX,y:drawY - limit}, {x:pastX, y:pastY + limit});
			}
			if (k === this.rows - 1) {
				// draw bottom border
				makeNeedleWall({x:drawX - limit,y:pastY}, {x:pastX + limit, y:pastY});
			}*/
			context.closePath();
		}
	}
}
