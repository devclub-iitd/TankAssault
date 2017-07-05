'use strict';

const util = require("util");
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected' + socket.id);
  util.log("New player has connected: " + socket.id);
  /*socket.on('disconnect', () => {
	  console.log('Client disconnected');
	  util.log("Player has disconnected: "+socket.id+"server.js message");
  });*/
});

/*io.on('disconnect', (socket) => {
  	console.log('Client disconnected');
	util.log("Player has disconnected: "+socket.id+"server.js message");
});*/

function onClientDisconnect() {
	util.log("Player has disconnected: "+socket.id+"server.js message");
};

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
