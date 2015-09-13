$(document).bind("keydown", (function(e) {
	var input = e.keyCode;
	switch(input) {
		case 38: //up arrow
		case 87: //w
		case 32: //spacebar
			move_timer.addDirection("up");
			break;
		case 40: //down arrow
		case 83: //s
			break;
		case 37: //left arrow
		case 65: //a
			move_timer.addDirection("left");
			break;
		case 39: //right arrow
		case 68: //d
			move_timer.addDirection("right");
			break;
	}
}));

$(document).bind("keyup", function(e) {
	var input = e.keyCode;
	switch(input) {
		case 38: //up arrow
		case 87: //w
		case 32: //spacebar
			move_timer.removeDirection("up");
			break;
		case 40: //down arrow
		case 83: //s
			break;
		case 37: //left arrow
		case 65: //a
			move_timer.removeDirection("left");
			break;
		case 39: //right arrow
		case 68: //d
			move_timer.removeDirection("right");
			break;
	}
});

//================================================

var player;
var players = [];
var move_timer;
var on_Ground = true;
var jumping = false;
var timeout = 0;

/// Timer that smooths out key presses
var MoveTimer = function() { 
	this.directions = [];
	this.dirs_to_remove = [];
	this.timer = undefined;
	this.fps = 60;
};

MoveTimer.prototype.addDirection = function(direction) {
	for(var i = 0; i < this.directions.length; i++) {
		if(this.directions[i] == direction) {
			return;
		} else if(this.directions[i] == "left" && direction == "right") {
			this.directions.splice(i, 1);
		} else if(this.directions[i] == "right" && direction == "left") {
			this.directions.splice(i, 1);
		} 
	}

	if(direction == "up"){
		jumping = true;	
	}	

	this.directions.push(direction);
	if(this.directions.length == 1 && this.timer == undefined) {
		this.start();
	} else {
		// if the timer is already going
	}
};

MoveTimer.prototype.removeDirection = function(direction) {
	var removed = undefined;

	if(direction == "up") {
		jumping = false;
	}

	if(!on_Ground) {
		this.dirs_to_remove.push(direction);
	}

	for(var i = 0; i < this.directions.length; i++) {
		if(this.directions[i] == direction) {
			if(direction !== "up" || on_Ground) {
				removed = this.directions.splice(i, 1);
			} 
		}
	}

	if(this.directions.length == 0) {
		clearInterval(this.timer);
		this.timer = undefined;
	}
};

/// Start movement when key is first pressed
MoveTimer.prototype.start = function() {
	this.dirs_to_remove = [];
	if(move_timer.timer !== undefined) {
		clearInterval(this.timer);
	}
	for(var i = 0; i < this.directions.length; i++) {
		if(this.directions[i] == "up"){
			jumping = true;	
		}	
	}
	
	//this.direction = direction;
	this.timer = setInterval(this.tick, 1000.0 / this.fps);
};

/// Stop movement when user releases the key
MoveTimer.prototype.stop = function(direction) {
	if(direction == "up"){
		jumping = false;
	} else if(this.direction == direction) {
		clearInterval(this.timer);
		this.timer = undefined;
	}	
};
MoveTimer.prototype.tick = function() {
	for(var i = 0; i < move_timer.directions.length; i++) {
		if(move_timer.directions[i] == "up") {
			//jumping = true;
		}
		player.move(move_timer.directions[i]);
	}	
};

var Player = function(name) {
	this.name = name;
	this.x = 100;
	this.y = 300;
	this.width = 50;
	this.height = 50;

	this.xspeed = 8;
	this.yspeed = 0;
};

Player.prototype.intersects = function(shape, dx, dy) {

};

/// Determine how many pixels in both directions the player will move
/// If dx or dy are non-zero, emit move info to the server
Player.prototype.move = function(direction) {
	var dx = 0, dy = 0;
	var gravity = .8;
	var JUMP_SPEED = -14;
	var MAX_FALL = 15;

	if(direction == "left") {
		if(this.x - this.xspeed < 0) {
			dx = this.x * -1;
		} else if(this.x == 0) {
			dx = 0;
		} else {
			dx = this.xspeed * -1;
		}		
	} else if(direction == "right") {
		if(this.x + this.xspeed > canvas.width - player.width) {
			dx = (canvas.width - player.width) - this.x;
		} else if(this.x == canvas.width - player.width) {
			dx = 0;
		} else {
			dx = this.xspeed;
		}
		//WIP ;_;
	} else if(direction == "up"){
		on_Ground = false;
		//while in the air

		if(jumping){
			this.yspeed = JUMP_SPEED;
			timeout++;
			if(timeout > 10){
				jumping = false;
				timeout = 0;
			}
		}
		else{
			this.yspeed += gravity;
			if(this.yspeed > MAX_FALL){
				this.yspeed = MAX_FALL;
			}
		}

		dy = this.yspeed;

		/*if(this.y >= 300 && !jumping){
			dy = 0;
			//this.y = 300;
			on_Ground = true;
			timeout = 0;
			for(var i = 0; i < move_timer.dirs_to_remove.length; i++) {
				move_timer.removeDirection(move_timer.dirs_to_remove[i]);
			}			
			//clearInterval(move_timer.timer);
			//move_timer.timer = undefined;
		}*/
		//console.log(this.y);
	}
	for(var i = 0; i < map.objects.length; i++) {
		var shape = map.objects[i]
		if(dy > 0 && player.y <= shape.y) { // falling
			if(player.y + dy >= shape.y) {
				if(player.x + dx + player.width >= shape.x && player.x + dx <= shape.x + shape.width) {
					dy = shape.y - player.y;
					on_Ground = true;
					timeout = true;
					for(var i = 0; i < move_timer.dirs_to_remove.length; i++) {
						move_timer.removeDirection(move_timer.dirs_to_remove[i]);
					}	
				}
			}
		} else if(dy < 0 && player.y > shape.y) {
			if(player.y - player.height + dy <= shape.y + shape.height) {
				if(player.x + dx + player.width >= shape.x && player.x + dx <= shape.x + shape.width) {
					dy = player.y - player.height - shape.y - shape.height;
					dy *= -1;
					console.log("dy: "+ dy);
					jumping = false;
					this.yspeed = 0;
				}
			}
		}

		if(dx > 0) {

		} else if(dx < 0) {

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

socket.on('init', function(name) {
	init(name);
});

socket.on('update', function(players_update) {
	if(players.length == 0 || players.length != players_update.length) {
		players = players_update;
		//console.log("updating");
	}
	for(var i = 0; i < players_update.length; i++) {
		players[i].x = players_update[i].x;
		players[i].y = players_update[i].y;
		if(players_update[i].name == player.name) {
			player.x = players[i].x;
			player.y = players[i].y;
			break;
		}
	}
	redraw();
});

function init(name) {
	player = new Player(name);
	move_timer = new MoveTimer();
	setupCanvas();
	redraw();
}