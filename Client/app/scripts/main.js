$(function() {
	var socket = io.connect('http://localhost:9001');

	var SCREEN_WIDTH  = window.innerWidth,
	SCREEN_HEIGHT = window.innerHeight;

	// Colors
	var yellow = "#efc94c",
	red = "#df5a49",
	green = "#45b29d",
	blue = "#334d5c";

	// Create paper Raphael
	var paper = Raphael(document.getElementById("circles"), SCREEN_WIDTH, SCREEN_HEIGHT / 2);

	// Particle object
	var Particle = function (length) {
		// Velocity
		this.velX = Math.random() * 4 - 2; 
		this.velY = Math.random() * 2 + 0.5;

		// Position
		this.x = SCREEN_WIDTH / 2;
		this.y = SCREEN_HEIGHT / 2;

		// Random color
		var color = Math.floor(Math.random() * 3 + 1);
		switch(color) {
			case 1: this.color = yellow; break;
			case 2: this.color = red; break;
			case 3: this.color = green; break;
			default: this.color = red;
		}

		// Length
		this.radius = length / 3;
	}

	Particle.prototype = {
		render: function() {
			paper.circle(this.x, this.y, this.radius)
			.attr("fill", this.color)
			.attr("stroke", "#444")
			.attr("stroke-width", 3);
		},
		update: function() {
			this.x += this.velX;
			this.y -= this.velY;
		}
	}

	// Particles tab
	var particles = [];

	socket.on('tweet', function (data) {
		// Create particle
		var p = new Particle(data.text.length);
		particles.push(p);
	});

	function loop() {
		paper.clear();
		for(var i = 0, length = particles.length; i < length; i++) {
			if(
				particles[i].x < 0 - particles[i].radius || 
				particles[i].x > SCREEN_WIDTH + particles[i].radius || 
				particles[i].y < 0 - particles[i].radius
			) {
				particles.splice(i, 1);
				if(i == length - 1) {
					break;
				}
				length--;
			}
			particles[i].render();
			particles[i].update();
		}
  		requestAnimationFrame(loop);
	}
	requestAnimationFrame(loop);
});