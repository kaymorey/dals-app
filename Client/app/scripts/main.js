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

	/***********************************
	*		     PARTICLES             *
	************************************/
	var particles = [];

	var Particle = function (data) {
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
		this.radius = data.text.length / 3;

		this.move = true;

		this.data = data;
	}

	Particle.prototype = {
		render: function() {
			var text = this.data.text;
			var id = this.data.id;
			var data = this.data;

			var circle = paper.circle(this.x, this.y, this.radius)
			.attr('fill', this.color)
			.attr('stroke', '#444')
			.attr('stroke-width', 3);

			var cx = Math.floor(Math.random() * SCREEN_WIDTH);
			var cy = 0 - this.radius;
			var speed = Math.floor(Math.random() * 2500 + 3000);
			circle.animate({cx: cx, cy: cy}, speed, 'linear', function() {
				circle.remove();
			});
			circle.toBack();
			
			circle.hover(function() {
				circle.pause();
				circle.attr('stroke', '#FFF');
				circle.toFront();
			},
			function() {
				circle.animate({cx: cx, cy: cy}, speed, 'linear', function() {
					circle.remove();
				});
				circle.attr('stroke', '#444');
				$.fancybox.close();
			})
			circle.click(function() {
				var user = data.user;
				var template = '<div class="tweet">';
					template += '<img src ="'+user.profile_image_url+'" alt="" />';
					template += '<div class="user">';
						template += '<span class="name">'+user.name+'</span><br />';
						template += '<span class="screen-name">@'+user.screen_name+'</span>';
					template += '</div>';
					template += '<div class="clear"></div>';
					template += '<p class="text">'+data.text+'</p>';
				template += '</div>';
				$.fancybox.open( {
					content: template,
					closeBtn: false,
					autoSize: false,
					width: 500,
					height: 'auto',
					padding: 0,
					helpers: {
						overlay: null
					}
				});
			});
		},
		update: function() {
			this.x += this.velX;
			this.y -= this.velY;
		}
	}

	/***********************************
	*		        STATS              *
	************************************/
	var Stats = function() {
		this.total = 0;
		this.candidats = [];

		this.max = 0;
		this.secondmax = 0;
		this.thirdmax = 0;

		this.maxIndex = '';
		this.secondmaxIndex = '';
		this.thirdmaxIndex = '';
	}

	Stats.prototype = {
		data: function(data) {
			this.total = data.total;
			this.candidats = data.candidats;

			this.max = data.max;
			this.secondmax = data.secondmax;
			this.thirdmax = data.thirdmax;

			this.maxIndex = data.maxIndex;
			this.secondmaxIndex = data.secondmaxIndex;
			this.thirdmaxIndex = data.thirdmaxIndex;
		},
		render: function() {
			$('div#statistics div.total-tweets p.total').html(this.total);

			var generalTemplate = '<ul>';

			if(this.maxIndex != '') {
				var template = '<li class="first">';
				template += '<img src="http://localhost/labo/dals-app/Client/app/images/'+this.maxIndex+'.jpg" alt="" /><br />';
				template += '<span class="name">'+this.candidats[this.maxIndex]['name']+'</span><br />';
				template += '<span class="total">'+this.max+'</span> tweets';
				template += '</li>';
				generalTemplate += template;	
			}	

			if(this.secondmaxIndex != '') {
				var template = '<li class="second">';
				template += '<img src="http://localhost/labo/dals-app/Client/app/images/'+this.secondmaxIndex+'.jpg" alt="" /><br />';
				template += '<span class="name">'+this.candidats[this.secondmaxIndex]['name']+'</span><br />';
				template += '<span class="total">'+this.secondmax+'</span> tweets';
				template += '</li>';
				generalTemplate += template;
			}

			if(this.thirdmaxIndex != '') {
				var template = '<li class="third">';
				template += '<img src="http://localhost/labo/dals-app/Client/app/images/'+this.thirdmaxIndex+'.jpg" alt="" /><br />';
				template += '<span class="name">'+this.candidats[this.thirdmaxIndex]['name']+'</span><br />';
				template += '<span class="total">'+this.thirdmax+'</span> tweets';
				template += '</li>';
				generalTemplate += template;
			}
			generalTemplate += '</ul>';
			jQuery('div#statistics div.candidats div.stats').html(generalTemplate);
		}
	}
	var stats = new Stats();
	


	/***********************************
	*		    SOCKET TWEET           *
	************************************/
	socket.on('tweet', function (tweet, dataStats) {
		
		// Create particle all 3 tweets
		stats.data(dataStats);
		if(stats.total % 3 == 0) {
			var p = new Particle(tweet);
			//particles.push(p);
			p.render();
		}

		//stats.update(data);
		stats.render();
	});

	/*
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
	*/
});