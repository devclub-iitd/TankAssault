// javascript for tank
var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

// tank parameters
var tankX = canvas.width / 2;
var tankY = canvas.height / 2;
var tankAngle = 270;
var dAng = 1;
var dDist = 2;
var tankLength = 40;
var tankWidth = 20;

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
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
   }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
	if(e.keyCode == 38) {
		upPressed = true;
	}
	else if(e.keyCode == 40) {
        downPressed = true;
   }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
	if(e.keyCode == 38) {
		upPressed = false;
	}
	else if(e.keyCode == 40) {
        downPressed = false;
   }
}

function drawTank(x, y, length, width,degrees){

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
        ctx.rect( -length / 2, -width / 2, length, width);

        ctx.fillStyle = "gold";
        ctx.fill();

        // restore the context to its untranslated/unrotated state
        ctx.restore();

    }

/*function moveTank(x, y, length, width, degrees, dDist){
	
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
        ctx.rect( -length / 2 + dDist, -width / 2, length, width);

        ctx.fillStyle = "gold";
        ctx.fill();

        // restore the context to its untranslated/unrotated state
        ctx.restore();
}*/

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//tankAngle += dAng;
	//tankX += Math.cos(tankAngle * Math.PI / 180) * dDist;
		//tankY += Math.sin(tankAngle * Math.PI / 180) * dDist;
	//moveTank(tankX, tankY, tankLength, tankWidth, tankAngle, dX);
	if (rightPressed === true) {
		tankAngle += dAng;
	}
	else if (leftPressed === true) {
		tankAngle -= dAng;
	}
	if (upPressed) {
		// Move the tank forward
		tankX += Math.cos(tankAngle * Math.PI / 180) * dDist;
		tankY += Math.sin(tankAngle * Math.PI / 180) * dDist;
	}
	if (downPressed) {
		// Move the tank forward
		tankX -= Math.cos(tankAngle * Math.PI / 180) * dDist;
		tankY -= Math.sin(tankAngle * Math.PI / 180) * dDist;
	}
	
	drawTank(tankX, tankY, tankLength, tankWidth, tankAngle);
	// for debugging
	//document.getElementById("demo").innerHTML = "" + dAng  + " "+ tankX + " " + tankY + " " + leftPressed;
}
setInterval(draw, 10);




