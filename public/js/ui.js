var canvas;
var context;
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

setupCanvas();