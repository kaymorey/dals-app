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
	var paper = Raphael(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT / 2);

	// Particle object
	var Particle = function (length) {
		// Velocity
		this.velX = Math.random() * 2 + 0.5; 
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
		this.length = length;
	}

	Particle.prototype = {
		render: function() {
			paper.circle(this.x, this.y, this.length)
			.attr("fill", this.color);
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
});