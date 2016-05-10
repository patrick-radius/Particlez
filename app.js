function on(id, callback, event = "click") {
	document.getElementById(id).addEventListener(event, callback);
}


on('toggle', function() {
	window.running = !window.running;
	if (window.running) {
		draw();
	}
});

on('toggleEmitter', function() {
	window.moveEmitter = !window.moveEmitter;
});

on('toggleDebug', function() {
	window.debug = !window.debug;
});

on('toggleColors', function() {
	window.colors = !window.colors;
});