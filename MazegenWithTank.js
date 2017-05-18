
var	canvas = document.getElementById('maze');
var context = canvas.getContext('2d');	
	context.font = "bold 20px sans-serif";
	//$(document).keydown(handleKeypress);
var canvas;
//var context;
var theMaze = null;
var loaded = 0;
var reload = 0;


function generate() {
	//console.profile();
	//context.clearRect(0, 0, canvas.width, canvas.height);
	//reload = 1;
	//earseTank(tankX, tankY, tankLength, tankWidth, tankAngle);
	makeMaze();
	//context.strokeStyle = "gold;
	//context.strokeRect(0, 0, canvas.width / 2, canvas.height / 2);
	//reload = 0;
	//loaded = 1;
	//document.getElementById("demo").innerHTML = "Hello";
	//makeTank();
	//console.profileEnd();
}
function loadTank() {
	//console.profile();
	//context.clearRect(0, 0, canvas.width, canvas.height);
	//makeMaze();
	//document.getElementById("demo").innerHTML = "Hello";
	theMaze.draw();
	theMaze.initialize();
	setInterval(theMaze.drawing, 10);
	//drawTank();
	//if (!loaded) setInterval(theMaze.drawing, 10);
	
	//console.profileEnd();
}
function makeMaze() {
	var rows =  Math.floor(Math.random() * 5) + 5;  // rows of maze
	var columns = Math.floor(Math.random() * 5) + 5; // columns of maze
	var gridsize = 7*rows; // grid size of maze
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
	this.lineWidth = 2;
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
	context.lineWidth = this.lineWidth;
	context.clearRect(0, 0, totalWidth, totalHeight);
	context.strokeStyle = this.wallColor;
	for (j = 0; j < this.columns; j++) {
		for (k = 0; k < this.rows; k++) {
			var drawX = (j * this.gridsize);
			var drawY = (k * this.gridsize);
			var pastX = parseInt(drawX) + parseInt(this.gridsize);
			var pastY = parseInt(drawY) + parseInt(this.gridsize);
			var theCell = this.grid[j][k];
			//this.drawColors(theCell);
				context.fillStyle = this.backgroundColor;
			
			context.fillRect(drawX, drawY, this.gridsize, this.gridsize);	
			context.beginPath();
			if (theCell.leftWall == true) {
				//context.strokeRect(drawX, drawY, 1, this.gridsize);
				context.moveTo(drawX, drawY);
				context.lineTo(drawX, pastY);
			}
			if (theCell.topWall == true) {
				//context.strokeRect(drawX, drawY, this.gridsize, 1);
				context.moveTo(drawX, drawY);
				context.lineTo(pastX, drawY);
			}
			if (theCell.rightWall == true) {
				//context.strokeRect((drawX + this.gridsize), drawY, 1, this.gridsize);
				context.moveTo(pastX, drawY);
				context.lineTo(pastX, pastY);
			}
			if (theCell.bottomWall == true) {
				//context.strokeRect(drawX, (drawY + this.gridsize), this.gridsize, 1);	
				context.moveTo(drawX, pastY);
				context.lineTo(pastX, pastY);
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
	var canvas = document.getElementById("maze");
	var ctx = canvas.getContext("2d");
	
	// tank parameters
	var tankX = 10;
	var tankY = 10
	
	// real tank determinants
	var tankCenterX = 0;
	var tankCenterY = 0;

	// collision detector parameters
	var newTankX;
	var newTankY;
	var newTankCenterX;
	var newTankCenterY;

	var tankAngle = 0;
	var dAng = 1;
	var dDist = 2;
	var tankLength;
	var tankWidth;

	// maze parameters
	// border parameters
	var borX;
	var borY;
	// wall parameters
	var wallLeft = 0;
	var wallRight = 0;
	var wallTop = 0;
	var wallBottom = 0;

	// collision parameters
	var projectedX;
	var projectedY;
	
	// tank  controls
	var rightPressed = false;
	var leftPressed = false;
	var upPressed = false;
	var downPressed = false;
	/* Left: 37
	Up: 38
	Right: 39
	Down: 40
	*/
	
	//var i = Math.floor(tankCenterX / theMaze.gridsize)
	//var j = Math.floor(tankCenterY / theMaze.gridsize)
	//var currentPlayerGrid = theMaze.grid[i][j];
	//console.log(currentPlayerGrid.leftWall);
	//console.log(currentPlayerGrid.rightWall);
		
	
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	
	
	function keyDownHandler(e) {
		switch (e.keyCode) {
			case 38:
				upPressed = true;
				break;
			case 40:
				downPressed = true;
				break;
			case 39:
				rightPressed = true;
				break;
			case 37:
				leftPressed = true;
				break;
			default:
				// none of these keys
				break;
		}
		//theMaze.drawing();
	}
	function keyUpHandler(e) {
		switch (e.keyCode) {
			case 38:
				upPressed = false;
				break;
			case 40:
				downPressed = false;
				break;
			case 39:
				rightPressed = false;
				break;
			case 37:
				leftPressed = false;
				break;
			default:
				// none of these keys
				break;
		}
	}
	
	function drawTank(x, y, length, width,degrees){
		
		// first save the untranslated/unrotated context
		ctx.save();
		
		ctx.beginPath();
		// move the rotation point to the center of the rect
		tankCenterX = x + length/2;
		tankCenterY = y + width/2;
		
		ctx.translate( tankCenterX, tankCenterY );
		// rotate the rect
		ctx.rotate(degrees * Math.PI / 180);
		
		// draw the rect on the transformed context
		// Note: after transforming [0,0] is visually [x,y]
		//       so the rect needs to be offset accordingly when drawn
		ctx.rect( -length / 2, -width / 2, length, width);
		
		ctx.fillStyle = "gold";
		ctx.fill();
		
		// restore the context to its untranslated/unrotated state
		ctx.restore();
		
	}
	/*function earseTank(x, y, length, width,degrees){

        // first save the untranslated/unrotated context
        ctx.save();

        ctx.beginPath();
        // move the rotation point to the center of the rect
        ctx.translate( x + length/2, y + width/2 );
        // rotate the rect
        ctx.rotate(degrees * Math.PI / 180);

        // draw the rect on the transformed context
        // Note: after transforming [0,0] is visually [x,y]
        //       so the rect needs to be offset accordingly when drawn
		ctx.fillStyle = "white";
		ctx.fillRect( -length / 2, -width / 2, length, width);
		ctx.fillRect( -length / 2, -width / 2, length, width);

        
        //ctx.fill();

        // restore the context to its untranslated/unrotated state
        ctx.restore();

    }*/

maze.prototype.initialize = function() {
	// Borders
	borX = theMaze.columns * theMaze.gridsize;
	borY = theMaze.rows * theMaze.gridsize;
		
	// set tank parameters
	tankLength = theMaze.gridsize * 2 / 3.5;
	tankWidth = theMaze.gridsize / 2.5;
	
	// tank position
	tankCenterX = tankX + tankLength/2;
	tankCenterY = tankY + tankWidth/2;
	
	// movement parameters
	dDist = tankLength / 30;
	dAng = 1;
}

 maze.prototype.drawing = function() {
		//earseTank(tankX, tankY, tankLength, tankWidth, tankAngle);
		//if (reload == 1) return;
		
		
		
		
		//var currentPlayerGrid = theMaze.grid[i][j];
		//var a = currentPlayerGrid.y;
		//console.log(currentPlayerGrid.x);
		//console.log(a);
		//console.log(drawTank().currentPlayerGrid.leftWall);
		//console.log(drawTank().currentPlayerGrid.rightWall);
		
	 
	    // move the rotation point to the center of the rect
		//tankCenterX = x + length/2;
		//tankCenterY = y + width/2;
	 
	 	var i = Math.floor(tankCenterX / theMaze.gridsize)
		var j = Math.floor(tankCenterY / theMaze.gridsize)
		var currentPlayerGrid = theMaze.grid[i][j];
	 	wallLeft = i*theMaze.gridsize;
	 	wallRight = (i+1)*theMaze.gridsize;
	 	wallTop = j*theMaze.gridsize;
	 	wallBottom = (j+1)*theMaze.gridsize;
		//console.log(i);
		//console.log(currentPlayerGrid.rightWall);
		//if((upPressed == true) && (currentPlayerGrid.leftWall == true) && (wallLeft < tankLength/2)){
		//	upPressed = false;
		//	downPressed = true;
		//	}
		//else if((upPressed == true) && (currentPlayerGrid.rightWall == true) && (-wallRight < tankLength/2)){
		//	upPressed = false;
		//	downPressed = true;
		//	}
		//else if((downPressed == true) && (currentPlayerGrid.leftWall == true) && (wallLeft < tankLength/2)){
		//	downPressed = false;
		//	upPressed = true;
		//	}
		//else if((downPressed == true) && (currentPlayerGrid.rightWall == true) && (-wallRight < tankLength/2)){
		//	downPressed = false;
		//	upPressed = true;
		//	}
		//else if((upPressed == true) && (currentPlayerGrid.topWall == true) && (wallTop < tankLength/2)){
		//	upPressed = false;
		//	downPressed = true;
		//	}
		//else if((downPressed == true) && (currentPlayerGrid.topWall == true) && (wallTop < tankLength/2)){
		//	downPressed = false;
		//	upPressed = true;
		//	}
		//else if((currentPlayerGrid.bottomWall == true) && (-wallBottom < tankLength/2) && (downPressed == true)){
		//	downPressed = false;
		//	upPressed = true;
		//	}
		//else if((upPressed == true) && (currentPlayerGrid.bottomWall == true) && (-wallBottom < tankLength/2)){
		//	downPressed = false;
			//upPressed = true;
			//}
		
	 
	 
	 
	 
	 
		if (rightPressed === true) {
			tankAngle += dAng;
		}
		else if (leftPressed === true) {
			tankAngle -= dAng;
		}
	 
	 	projectedX = tankLength * Math.cos(tankAngle * Math.PI / 180) / 2 + tankWidth * Math.abs(Math.sin(tankAngle * Math.PI / 180)) / 2 + dDist * Math.cos(tankAngle * Math.PI / 180);
	 	projectedY = tankLength * Math.abs(Math.sin(tankAngle * Math.PI / 180)) / 2 + tankWidth * Math.cos(tankAngle * Math.PI / 180) / 2 + dDist * Math.abs(Math.sin(tankAngle * Math.PI / 180));
		if (upPressed) {
			// Move the tank forward
			//if (tankCenterX < wallRight - tankLength / 2 && tankCenterX > wallLeft + tankLength / 2 && tankCenterY > wallTop + tankLength / 2 && tankCenterY < wallBottom - tankLength / 2){
				tankX += Math.cos(tankAngle * Math.PI / 180) * dDist;
				tankY += Math.sin(tankAngle * Math.PI / 180) * dDist;
			//}
			/*else {
				newTankX = tankX +  Math.cos(tankAngle * Math.PI / 180) * dDist;
				newTankY = tankY + Math.sin(tankAngle * Math.PI / 180) * dDist;
				newTankCenterX = newTankX + tankLength/2;
				newTankCenterY = newTankY + tankWidth/2;
				if (newTankCenterX < wallRight - tankLength / 2 && newTankCenterX > wallLeft + tankLength / 2 && newTankCenterY > wallTop + tankLength / 2 && newTankCenterY < wallBottom - tankLength / 2){
					tankX = newTankX;
					tankY = newTankY;
				}
			}*/
			
		}
		if (downPressed){
			// Move the tank backward
			if ((!currentPlayerGrid.rightWall || (currentPlayerGrid.rightWall && tankCenterX <= wallRight - projectedX)) && (!currentPlayerGrid.leftWall || (currentPlayerGrid.leftWall && tankCenterX >= wallLeft + projectedX)) && (!currentPlayerGrid.topWall || (currentPlayerGrid.topWall && tankCenterY >= wallTop + projectedY)) && (!currentPlayerGrid.bottomWall || (currentPlayerGrid.bottomWall && tankCenterY <= wallBottom - projectedY))){
				tankX -= Math.cos(tankAngle * Math.PI / 180) * dDist;
				tankY -= Math.sin(tankAngle * Math.PI / 180) * dDist;
			}
			/*else {
				newTankX = tankX -  Math.cos(tankAngle * Math.PI / 180) * dDist;
				newTankY = tankY - Math.sin(tankAngle * Math.PI / 180) * dDist;
				newTankCenterX = newTankX + tankLength/2;
				newTankCenterY = newTankY + tankWidth/2;
				if ((!currentPlayerGrid.rightWall || (currentPlayerGrid.rightWall && newTankCenterX < wallRight - tankLength / 2)) && (!currentPlayerGrid.leftWall || (currentPlayerGrid.leftWall && newTankCenterX > wallLeft + tankLength / 2)) && (!currentPlayerGrid.topWall || (currentPlayerGrid.topWall && newTankCenterY > wallTop + tankLength / 2)) && (!currentPlayerGrid.bottomWall || (currentPlayerGrid.bottomWall && newTankCenterY < wallBottom - tankLength / 2))){
					tankX = newTankX;
					tankY = newTankY;
				}
			}*/
		}
		//console.log(tankX);
		//console.log(tankY);
		
		theMaze.draw();
		drawTank(tankX, tankY, tankLength, tankWidth, tankAngle);
		//theMaze.draw();
		// for debugging
		document.getElementById("demo").innerHTML = " "+ tankX + " " + tankY + " " + leftPressed + rightPressed + " " + upPressed + " " + downPressed + " " + tankCenterX + " " + tankCenterY + " " + wallLeft + " " + wallTop;
	}
	
	
	
	
	
	
	
	
	
	
