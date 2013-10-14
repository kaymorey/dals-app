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

		this.move = true;
	}

	Particle.prototype = {
		render: function() {
			paper.circle(this.x, this.y, this.radius)
			.attr("fill", this.color)
			.attr("stroke", "#444")
			.attr("stroke-width", 3)
			.hover(function() {
				this.move = false;
			});
		},
		update: function() {
			this.x += this.velX;
			this.y -= this.velY;
		}
	}

	var Stats = function() {
		this.total = 0;

		this.candidats = {
			'alizee': {
				'name': 'Alizée',
				'total': 0
			},
			'tal': {
				'name': 'Tal',
				'total': 0
			},
			'ournac': {
				'name': 'Laurent Ournac',
				'total': 0
			},
			'zaibat': {
				'name': 'Brahim Zaibat',
				'total': 0
			},
			'sargue': {
				'name': 'Damien Sargue',
				'total': 0
			},
			'keenv': {
				'name': 'Keen\'V',
				'total': 0
			},
			'milot': {
				'name': 'Laetitia Milot',
				'total': 0
			},
			'thilleman': {
				'name': 'Laury Thilleman',
				'total': 0
			},
			'titoff': {
				'name': 'Titoff',
				'total': 0
			}
		}

		this.max = 0;
		this.secondmax = 0;
		this.thirdmax = 0;

		this.maxIndex = '';
		this.secondmaxIndex = '';
		this.thirdmaxIndex = '';
	}

	Stats.prototype = {
		render: function() {
			$('div#statistics div.total-tweets p.total').html(this.total);

			if(this.maxIndex != '') {
				$('div#statistics div.candidats p.first span.name').html(this.candidats[this.maxIndex]['name']);
				$('div#statistics div.candidats p.first span.total').html(this.candidats[this.maxIndex]['total']);
			}	

			if(this.secondmaxIndex != '') {
				$('div#statistics div.candidats p.second span.name').html(this.candidats[this.secondmaxIndex]['name']);
				$('div#statistics div.candidats p.second span.total').html(this.candidats[this.secondmaxIndex]['total']);
			}

			if(this.thirdmaxIndex != '') {
				$('div#statistics div.candidats p.third span.name').html(this.candidats[this.thirdmaxIndex]['name']);
				$('div#statistics div.candidats p.third span.total').html(this.candidats[this.thirdmaxIndex]['total']);
			}
		},
		update: function(data) {
			if(data.text.toLowerCase().indexOf('alizée') != -1) {
				this.candidats['alizee']['total'] += 1;
			}
			if(data.text.toLowerCase().indexOf('tal') != -1) {
				this.candidats['tal']['total'] += 1;
			}
			if(data.text.toLowerCase().indexOf('laurent') != -1 || data.text.toLowerCase().indexOf('ournac') != -1) {
				this.candidats['ournac']['total'] += 1;
			}
			if(data.text.toLowerCase().indexOf('brahim') != -1 || data.text.toLowerCase().indexOf('zaibat') != -1) {
				this.candidats['zaibat']['total'] += 1;
			}
			if(data.text.toLowerCase().indexOf('damien') != -1 || data.text.toLowerCase().indexOf('sargue') != -1) {
				this.candidats['sargue']['total'] += 1;
			}
			if(data.text.toLowerCase().indexOf('keenv') != -1 || data.text.toLowerCase().indexOf('keen\'v') != -1) {
				this.candidats['keenv']['total'] += 1;
			}
			if(data.text.toLowerCase().indexOf('laetitia') != -1 || data.text.toLowerCase().indexOf('milot') != -1) {
				this.candidats['milot']['total'] += 1;
			}
			if(data.text.toLowerCase().indexOf('laury') != -1 || data.text.toLowerCase().indexOf('thilleman') != -1) {
				this.candidats['thilleman']['total'] += 1;
			}
			if(data.text.toLowerCase().indexOf('titoff') != -1) {
				this.candidats['titoff']['total'] += 1;
			}

			// Search for max
			for(var index in this.candidats) {
				if(this.candidats[index]['total'] > this.max) {
					this.max = this.candidats[index]['total'];
					this.maxIndex = index;
				}
			}
			// Search for second max
			for(var index in this.candidats) {
				if(this.candidats[index]['total'] > this.secondmax && index != this.maxIndex) {
					this.secondmax = this.candidats[index]['total'];
					this.secondmaxIndex = index;
				}
			}
			// Search for third max
			for(var index in this.candidats) {
				if(this.candidats[index]['total'] > this.thirdmax && index != this.maxIndex && index != this.secondmaxIndex) {
					this.thirdmax = this.candidats[index]['total'];
					this.thirdmaxIndex = index;
				}
			}
			console.log(this.candidats);
		}
	}

	// Particles tab
	var particles = [];

	// Stats
	var stats = new Stats();

	socket.on('tweet', function (data) {
		stats.total += 1;
		
		// Create particle all 3 tweets
		if(stats.total % 1 == 0) {
			var p = new Particle(data.text.length);
			particles.push(p);
		}

		stats.update(data);
		stats.render();
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
			if(particles[i].move) {
				particles[i].update();
			}
		}
  		requestAnimationFrame(loop);
	}
	requestAnimationFrame(loop);
});