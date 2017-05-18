// javascript for tank
var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

// tank parameters
var tankCenterX;
var tankCenterY;
var rotorX = canvas.width / 2;
var rotorY = canvas.height / 2;
var rotorAngle = 270;
var dAng = 1;
var dDist = 2;
var tankRadius = 15;
var rotorLength = 20;
var rotorWidth = 7;

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
document.addEventListener("mousemove", mouseMoveHandler, false);


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

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
	rotorAngle = relativeX/2;
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
        

		/*var grdRect = ctx.createLinearGradient(0, 0, 30, 0);
		grd.addColorStop(0,"white");
		grd.addColorStop(1,"gold");*/
	    ctx.fillStyle = "yellow";

		ctx.fillRect( -length / 2 - 10, -width / 2, length, width);
        

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
		// Move the tank left
		rotorX += dDist;
	}
	else if (leftPressed === true) {
		// Move the tank right
		rotorX -= dDist;
	}
	if (upPressed) {
		// Move the tank upward
		rotorY -= dDist;
	}
	else if (downPressed) {
		// Move the tank downward
		rotorY += dDist;
	}
	
	tankCenterX = rotorX + rotorLength / 2;
	tankCenterY = rotorY + rotorWidth / 2;
	drawTank(tankCenterX, tankCenterY, tankRadius, rotorLength, rotorWidth, rotorAngle);
	// for debugging
	//document.getElementById("demo").innerHTML = "" + dAng  + " "+ tankX + " " + tankY + " " + leftPressed;
}
setInterval(draw, 10);




