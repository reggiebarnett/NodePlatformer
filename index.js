var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//passing index.html to server

app.use(express.static(__dirname + "/public"));

app.get('/', function(req, res){
	res.sendFile(__dirname+'/views/index.html');
});
//listening for connections
io.on('connection', function(socket){
	console.log('user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on', http.address().port);
});

/*http.listen(3000, function(){
	console.log('listening on port 3000');
});*/