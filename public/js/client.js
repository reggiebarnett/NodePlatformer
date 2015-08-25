$(document).bind("keydown", (function(e) {
	var input = e.keyCode;
	switch(input) {
		case 38: //up arrow
		case 87: //w
			alert("yay");
			break;
		case 40: //down arrow
		case 83: //s
			alert("yay");
			break;
		case 37: //left arrow
		case 65: //a
			move_timer.start("left");
			break;
		case 39: //right arrow
		case 68: //d
			move_timer.start("right");
			break;
	}
}));

$(document).bind("keyup", function(e) {
	var input = e.keyCode;
	switch(input) {
		case 38: //up arrow
		case 87: //w
			alert("yay");
			break;
		case 40: //down arrow
		case 83: //s
			alert("yay");
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
var move_timer;

var MoveTimer = function() { 
	this.direction = undefined;
	this.timer = undefined;
};

MoveTimer.prototype.start = function(direction) {
	if(this.timer !== undefined) {
		clearInterval(this.timer);
	}
	this.direction = direction;
	this.timer = setInterval(this.tick, 5);
};

MoveTimer.prototype.stop = function(direction) {
	if(this.direction == direction) {
		clearInterval(this.timer);
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
};

Player.prototype.move = function(direction) {
	if(direction == "left") {
		player.x -= 2;
		if(player.x < 0) {
			player.x = 0;
		}
	} else if(direction == "right") {
		player.x += 2;
		if(player.x > canvas.width - player.width) {
			player.x = canvas.width - player.width;
		}
	}
	redraw();
};

function redraw() {
	drawMap();
	drawPlayer(player);
}

function init() {
	setupCanvas();
	drawMap();
	player = new Player();
	move_timer = new MoveTimer();
	drawPlayer(player);
}

init();