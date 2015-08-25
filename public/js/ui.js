var canvas;
var context;
var map = 
[[0, 0],
['x', 'x']];

function setupCanvas() {
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	context.canvas.width = 800;
	context.canvas.height = 600;
	context.fillStyle = "#eeeeee";
	context.fillRect(0, 0, 800, 600);
	context.strokeStyle = "#aaaaaa";
	context.strokeRect(0, 0, 800, 600);
}

function drawMap() {
	var x = 0;
	var y = 0;
	var cell_width = canvas.width / map.length;
	var cell_height = canvas.height / map[0].length;
	context.strokeStyle = "#aaaaaa";

	for(var i = 0; i < map.length; i++) {
		for(var j = 0; j < map[0].length; j++) {
			if(map[i][j] == 'x') {
				context.fillStyle = "#666666";
				context.fillRect(x, y, cell_width, cell_height);
			} else {
				context.fillStyle = "#eeeeee";
				context.fillRect(x, y, cell_width, cell_height);
			}
			context.strokeRect(x, y, cell_width, cell_height);
			x += cell_width;
		}
		x = 0;
		y += cell_height;
	}
}

function drawPlayer(player) {
	context.fillStyle = "#420420";
	//context.strokeStyle = "#aaaaa";

	context.fillRect(player.x, player.y - player.height, player.width, player.height);
}

