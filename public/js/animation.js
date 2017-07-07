var timx=0;
var boom_r=10;
var bulletAudio = document.getElementById('audiobullet');
var endAudio = document.getElementById('audiotank');
var xxxx=0;


/*************************************************
** Animation functions
*************************************************/
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