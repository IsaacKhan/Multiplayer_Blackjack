// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 3000);
app.use('/static', express.static(__dirname + '/static'));


// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
app.use('/js', express.static(__dirname + '/static/js'));


// Starts the server.
server.listen(3000, function() {
  console.log('Starting server on port 3000');
});

// Add the WebSocket handlers
io.on('connection', function(socket){
  console.log("client connected");
  
  //when a new client connects
	io.clients(function(error, clients){
	  if (error) throw error;
		  //send the list of clients out to all the clients
		  io.emit('clientList', clients);
	});
});