var canvas;
var context;
var map;

var Map = function() {
	this.objects = [];
};

Map.prototype.addObject = function(shape) {
	this.objects.push(shape);
};

var Rectangle = function(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};

function setupCanvas() {
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	context.canvas.width = 800;
	context.canvas.height = 600;
	context.fillStyle = "#eeeeee";
	context.fillRect(0, 0, 800, 600);
	context.strokeStyle = "#aaaaaa";
	context.strokeRect(0, 0, 800, 600);

	createMap();
}

function createMap() {
	map = new Map();
	map.addObject(new Rectangle(100, 300, 600, 300));
	map.addObject(new Rectangle(350, 100, 100, 100));
}

function drawMap() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.strokeStyle = "#666666";
	context.fillStyle = "#666666";
	context.strokeRect(0, 0, canvas.width, canvas.height);

	for(var i = 0; i < map.objects.length; i++) {
		var shape = map.objects[i];
		context.fillRect(shape.x, shape.y, shape.width, shape.height);
	}
	/*var cell_width = canvas.width / map.length;
	var cell_height = canvas.height / map[0].length;
	context.strokeStyle = "#aaaaaa";

	for(var i = 0; i < map.length; i++) {
		for(var j = 0; j < map[0].length; j++) {
			if(map[i][j] == 'x') {
				context.fillStyle = "#666666";
				context.fillRect(j * cell_width, i * cell_height, cell_width, cell_height);
			} else {
				context.fillStyle = "#eeeeee";
				context.fillRect(j * cell_width, i * cell_height, cell_width, cell_height);
			}
			context.strokeRect(j * cell_width, i * cell_height, cell_width, cell_height);
		}
	}*/
}

function drawPlayer(player) {
	context.fillStyle = "#420420";
	//context.strokeStyle = "#aaaaa";

	context.fillRect(player.x, player.y - player.height, player.width, player.height);
}

