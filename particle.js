var canvas = document.getElementById('particles');
var ctx = canvas.getContext('2d');
ctx.font = "12px sans-serif";

var running = false;
var moveEmitter = false;
var debug = false;
var colors = false;

const particleRate = 60;
const maxSpeed = 0.3;
const emitterSpeed = 70;
const gravity = 0;//.098;
const bouyancy = -0.01;

var frame = 0, deltaTime = 0, currentTime = 0, previousTime = performance.now(), fps = 0;

class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	get() {
		return new Vector(this.x, this.y);
	}
	getX() {
		return this.x;
	}

	getY() {
		return this.y;
	}
}

class Particle {
	constructor(x, y, lifeTime = 200) {
		this.x = x;
		this.y = y;
		this.vx = (Math.random() * maxSpeed) - (maxSpeed / 2);
		this.vy = (Math.random() * maxSpeed) - (maxSpeed / 2);
		this.mass = Math.random() * 4;
		this.age = 0;
		this.lifeTime = lifeTime;
	}

	applyForce(f) {
		this.vx += f.getX();
		this.vy += f.getY();
	}

	isDead() {
		return this.age >= this.lifeTime;
	}

	tick() {
		this.age++;
		this.x += this.vx;
		this.y += this.vy;
	}
}

let img = new Image();

class PSystem {
	constructor(x = 150, y = 250) {
		this.emitter = {x, y, particles: []};
		this.forces = [];
		this.displacementMap = [];

		img.src = perlinImage;
		let that = this;
		img.onload = function() {
			ctx.drawImage(img, 0, 0);
			let myImageData = ctx.getImageData(0, 0, 300, 300);
		    for (let i = 0; i < myImageData.data.length; i += 4) {
		    	that.displacementMap.push(myImageData.data[i]);
			}			
			console.log('Mapsize: ', that.displacementMap.length);
			console.log(that.displacementMap);
		}
	}

	getDisplacement(x, y) {
		if (! this.displacementMap.length || x > 300 || y > 300) {
			return 0;
		}		
		let i = Math.floor(x) + 300 * Math.floor(y);

		return (this.displacementMap[i] - 128) / 10000;
	}

	addParticle() {
		this.emitter.particles.push(new Particle(this.emitter.x, this.emitter.y));
	}

	addForce(x, y) {
		this.forces.push(new Vector(x, y));
	}

	tick(frame) {
		if (debug) {
			ctx.drawImage(img, 0, 0);
		}

		let particles = this.emitter.particles;

		particles.forEach((p, i) => {
			if (p.isDead()) {
				particles.splice(i, 1);
			}

			this.forces.forEach(f => p.applyForce(f.get()));
			let displacement = this.getDisplacement(p.x, frame % 300);

			// if (frame % 10 === 0  && i == 0){
				// console.log(displacement, p.vx, p.vy);
				// running = false;
			// }
			
			p.applyForce(new Vector(displacement * p.mass, 0));

			p.tick();
		});

		if (moveEmitter) {
			this.emitter.x = 150 + (Math.sin(frame/emitterSpeed) * 50);
			this.emitter.y = 150 + (Math.cos(frame/emitterSpeed) * 50);	
		}
	}

	render(ctx) {
		ctx.globalCompositeOperation = 'lighter';

		this.emitter.particles.forEach(p => {
			var opacity = 0.05;
			if (!colors) {
				var gray = Math.floor(255 - (p.age / 300 ) * 255);
				ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, ${opacity})`;	
			} else {
				var green = Math.floor(255 - (p.age / 100 ) * 255);
				ctx.fillStyle = `rgba(255, ${green}, 0, ${opacity})`;	
			}
			
			ctx.fillRect (p.x, p.y, 5, 5);
		});

		ctx.globalCompositeOperation = 'source-over';
	}
}

var system = new PSystem();

// gravity
// system.addForce(0, gravity);

// bouyancy
system.addForce(0, bouyancy);

function draw() {
  	if (running) {
		requestAnimationFrame(draw);
	}

	updateTimes();
	
	// clear screen
	ctx.fillStyle = "rgb(55,55,55)";
	ctx.fillRect(0, 0, 300, 300);

	for (var i = 0; i < particleRate; i++) {
		system.addParticle();
	}

	system.tick(frame);	
	if (debug) {
			ctx.fillStyle = "#FFFFFF";
			ctx.fillText(`fps:  ${fps.toFixed(2)}`, 10, 10);
			ctx.fillText(`particles:  ${system.emitter.particles.length}`, 10, 20);
		}
	system.render(ctx);
	
	if (frame % 2 !== 0) {
		return;
	}

	
}

function updateTimes() {
	// time update
  	currentTime = performance.now();
  	deltaTime = currentTime - previousTime;

	fps = (1 / deltaTime) * 1000;
	previousTime = currentTime;
	frame++;
}

function stats() {

	
}

draw();