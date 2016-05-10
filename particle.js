var canvas = document.getElementById('particles');
var ctx = canvas.getContext('2d');
ctx.font = "12px sans-serif";

var running = true;

const particleRate = 50;
const gravity = 0.8;
const maxSpeed = 1;
const emitterSpeed = 40;

var frame = 0, deltaTime = 0, currentTime = 0, previousTime = performance.now(), fps = 0;

class PSystem {
	constructor(x = 150, y = 150) {
		this.emitter = {x, y, particles: []};
	}

	addParticle() {
		this.emitter.particles.push({
			x: this.emitter.x,
			y: this.emitter.y,
			dx: (Math.random() * maxSpeed) - (maxSpeed / 2),
			dy: (Math.random() * maxSpeed) - (maxSpeed / 2),
			age: 0,
			lifeTime: 255
		});
	}

	tick(frame) {
		let particles = this.emitter.particles;

		particles.forEach((p, i) => {
			if (p.age >= p.lifeTime) {
				particles.splice(i, 1);
			}

			p.age++;
			p.x += p.dx;
			p.y += p.dy + gravity;
		});

		this.emitter.x = 150 + (Math.sin(frame/emitterSpeed) * 50);
		this.emitter.y = 150 + (Math.cos(frame/emitterSpeed) * 50);
	}

	render(ctx) {
		ctx.globalCompositeOperation = 'lighter';

		this.emitter.particles.forEach(p => {
			var opacity = 0.02;
			var green = Math.floor(255 - (p.age / 100 ) * 255);
			ctx.fillStyle = `rgba(255, ${green}, 0, ${opacity})`;
			ctx.fillRect (p.x, p.y, 10, 10);
		});

		ctx.globalCompositeOperation = 'source-over';
	}
}

var system = new PSystem();

function draw() {
  	if (running) {
		requestAnimationFrame(draw);
	}

	// time update
  	currentTime = performance.now();
  	deltaTime = currentTime - previousTime;

	fps = (1 / deltaTime) * 1000;
	previousTime = currentTime;
	frame++;
	
	// clear screen
	ctx.fillStyle = "rgb(55,55,55)";
	ctx.fillRect(0,30, 300, 300);

	for (var i = 0; i < particleRate; i++) {
		system.addParticle();
	}

	system.tick(frame);	

	system.render(ctx);
	
	if (frame % 4 !== 0) {
		return;
	}
	stats();
}

function stats() {
	ctx.fillStyle = "rgb(75,75,75)";
	ctx.fillRect(0,0, 300, 30);

	ctx.fillStyle = "#FFFFFF";
	ctx.fillText(`fps:  ${fps.toFixed(2)}`, 10, 10);
	ctx.fillText(`particles:  ${system.emitter.particles.length}`, 10, 20);
}

draw();