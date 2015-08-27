var Game = function() {
	this.players = [];

	this.io = undefined;
	this.current_snapshot = undefined;
	this.snapshot_queue = [];
	this.data_received = [];

	this.update_timer = undefined;
	this.fps = 60;	// 60 fps master race
};

Game.prototype.setIO = function(io) {
	this.io = io;
};

///
Game.prototype.updateLoop = function() {
	if(this.io == undefined) {
		console.log("ERROR: IO not set!");
		clearInterval(this.updateTimer);
	}

	var client_update, player_index;
	
	if(this.data_received.length == 0) {
		// No new moves to apply
	} else {
		// Apply moves
		for(var i = 0; i < this.data_received.length; i++) {
			for(player_index = 0; player_index < this.players.length; player_index++) { 
				if(this.players[player_index].name == this.data_received[i].player_name) {
					break;
				}
			}
			this.players[player_index].move(this.data_received[i].dx, this.data_received[i].dy);
		}
	}

	// Add snapshot to the end of the queue
	this.snapshot_queue.unshift(this.players);

	// Send out snapshot from 3 cycles ago
	if(this.snapshot_queue.length > 3) {
		client_update = this.snapshot_queue.pop();
		this.io.sockets.emit('update', client_update)
	}	

	// Reset data array for next loop
	this.data_received = [];
};

/// Called when the server receives a client move event
/// Add the move event to the data_received object
Game.prototype.playerMove = function(name, data) {
	this.data_received.push({
		player_name: name, 
		dx: data.dx, 
		dy: data.dy
	});
};

/// Player joins the game
/// Assign a name to the player and add to list
/// If the player is the only one in the server, start game loop
/// Return name of new player to the server
Game.prototype.connect = function() {
	var name = "";
	if(this.players.length == 0) { 
		//Generate random int between 1 and 2. lol
		if(Math.floor((Math.random() * (2 - 1 + 1) + 1)) == 1) {
			name = "Reggie";
		} else {
			name = "Andrew";
		}
	} else {
		if(this.players[0].name == "Andrew") {
			name = "Reggie";
		} else {
			name = "Andrew";
		}
	}
	this.players.push(new Player(name, 100, 300));
	this.data_received.push({player_name: name, dx: 0, dy: 0})

	// If this is the first player, start the update loop
	if(this.players.length == 1) {
		var object_instance = this;
		this.update_timer = setInterval(function() {
			object_instance.updateLoop();
		}, 1000 / this.fps);
	}

	console.log(name + " connected");
	return name;
};

/// Player leaves the game
/// Remove from player from the players array
/// If the game server is now empty, stop the update loop
Game.prototype.disconnect = function(name) {
	console.log(name + " disconnected");
	for(var i = 0; i < this.players.length; i++) {
		if(this.players[i].name === name) {
			this.players.splice(i, 1);
		}
	}

	if(this.players.length == 0) {
		clearInterval(this.update_timer);
	}
};

/// Data class for storing player positions
var Player = function(name, x, y) {
	this.name = name;
	this.x = x;
	this.y = y;
	this.width = 50;
	this.height = 50;
};

Player.prototype.move = function(dx, dy) {
	this.x += dx;
	this.y += dy;
	console.log("x: "+this.x+" y: "+this.y);
};

module.exports = new Game();