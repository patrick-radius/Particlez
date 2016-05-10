function on(id, callback, event = "click") {
	document.getElementById(id).addEventListener(event, callback);
}


on('toggle', function() {
	window.running = !window.running;
	if (window.running) {
		draw();
	}
});
