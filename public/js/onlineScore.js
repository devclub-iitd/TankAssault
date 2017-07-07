var myScore = new component("30px", "Consolas", "black", 20, 40, "text");
function component(width, height, color, x, y, type) {
  this.type = type;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0; 
  this.x = x;
  this.y = y; 
  this.update = function() {
    //var ctx = canvas.context;
    if (this.type === "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}


// health
var width = 10000;
// this is the function to change the health of the player
// currently it justs decreases the health with time
function changeHealth() {
  var elem = document.getElementById("myBar");   
  
 // var id = setInterval(frame, 10);
 
      width-=0.5; 
      elem.style.width = width/100 + '%';
	if(width <= 0) alert("You are Dead!!");
  
}

