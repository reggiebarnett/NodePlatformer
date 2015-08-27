var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var game = require('./game');

//passing index.html to server

app.use(express.static(__dirname + "/public"));

app.get('/', function(req, res){
	res.sendFile(__dirname+'/views/index.html');
});
//listening for connections
io.on('connection', function(socket) {
	var player_name = game.connect();
	game.setIO(io);

	socket.emit('init', player_name);

	socket.on('disconnect', function() {
		game.disconnect(player_name);
	});

	socket.on('move', function(data) {
		game.playerMove(player_name, data);
	});
});

http.listen(process.env.PORT || 3000, function() {
  console.log('listening on', http.address().port);
});

/*http.listen(3000, function(){
	console.log('listening on port 3000');
});*/