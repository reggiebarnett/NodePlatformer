$(document).bind("keydown", (function(e) {
	var input = e.keyCode;
	switch(input) {
		case 38: //up arrow
		case 87: //w
			break;
		case 40: //down arrow
		case 83: //s
			break;
		case 37: //left arrow
		case 65: //a
			if(move_timer.timer == undefined || move_timer.direction == "right") {
				move_timer.start("left");
			}			
			break;
		case 39: //right arrow
		case 68: //d
			if(move_timer.timer == undefined || move_timer.direction == "left") {
				move_timer.start("right");
			}		
			break;
	}
}));

$(document).bind("keyup", function(e) {
	var input = e.keyCode;
	switch(input) {
		case 38: //up arrow
		case 87: //w
			break;
		case 40: //down arrow
		case 83: //s
			break;
		case 37: //left arrow
		case 65: //a
			move_timer.stop("left");
			break;
		case 39: //right arrow
		case 68: //d
			move_timer.stop("right");
			break;
	}
});

//================================================

var player;
var players;
var move_timer;

/// Timer that smooths out key presses
var MoveTimer = function() { 
	this.direction = undefined;
	this.timer = undefined;
};

/// Start movement when key is first pressed
MoveTimer.prototype.start = function(direction) {
	if(move_timer.timer !== undefined) {
		clearInterval(this.timer);
	}		
	this.direction = direction;
	this.timer = setInterval(this.tick, 20);
};

/// Stop movement when user releases the key
MoveTimer.prototype.stop = function(direction) {
	if(this.direction == direction) {
		clearInterval(this.timer);
		this.timer = undefined;
	}	
};

MoveTimer.prototype.tick = function() {
	player.move(move_timer.direction);
};

var Player = function() {
	this.x = 100;
	this.y = 300;
	this.width = 50;
	this.height = 50;

	this.speed = 8;
};

/// Determine how many pixels in both directions the player will move
/// If dx or dy are non-zero, emit move info to the server
Player.prototype.move = function(direction) {
	var dx = 0, dy = 0;
	if(direction == "left") {
		if(this.x - this.speed < 0) {
			dx = this.x * -1;
		} else if(this.x == 0) {
			dx = 0;
		} else {
			dx = this.speed * -1;
		}		
	} else if(direction == "right") {
		if(this.x + this.speed > canvas.width - player.width) {
			dx = (canvas.width - player.width) - this.x;
		} else if(this.x == canvas.width - player.width) {
			dx = 0;
		} else {
			dx = this.speed;
		}
	} 
	if(dx !== 0 || dy !== 0) {
		socket.emit('move', {
			dx: dx,
			dy: dy
		});
	}
}

function redraw() {
	drawMap();
	for(var i = 0; i < players.length; i++) {
		drawPlayer(players[i]);
	}	
}

socket.on('update', function(players_update) {
	players = players_update;
	redraw();
});

function init() {
	setupCanvas();
	drawMap();
	player = new Player();
	move_timer = new MoveTimer();
}

init();