var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/HTMLs/OnlinePlay.html');
	//res.sendFile(__dirname + '/js/MazeGeneration.js');
	//res.sendFile(__dirname + '/js/OnlineGame.js');
	//res.sendFile(__dirname + '/js/OnlineGamePlay.js');
	//res.sendFile(__dirname + '/styles/stylesheet1.css');
	//res.sendFile(__dirname + '/styles/buttons.css');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});