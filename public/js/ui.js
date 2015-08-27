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
	var cell_width = canvas.width / map.length;
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
	}
}

function drawPlayer(player) {
	context.fillStyle = "#420420";
	//context.strokeStyle = "#aaaaa";

	context.fillRect(player.x, player.y - player.height, player.width, player.height);
}

