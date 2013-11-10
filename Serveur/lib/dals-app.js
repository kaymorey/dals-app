/*
 * Dals App
 * https://github.com/kaymorey/dals-app
 *
 * Copyright (c) 2013 Katia Moreira
 * Licensed under the MIT license.
 */

'use strict';

var twitter = require('ntwitter');
var io = require('socket.io').listen(9001);
var EventEmitter = require('events').EventEmitter;
var pubsub = new EventEmitter();

var Timeline = function() {
	this.tweetMinutes = 300; /* TO CHANGE */
	this.minutesCount = 0;

	this.width = 700;
	this.height = 250;
	this.max = 2500;
	this.intervals = [0, 40, 70, 100, 130, 160, 175];

	this.path = "M0,"+this.height;
}
Timeline.prototype = {
	update: function() {
		this.tweetMinutes+= 1;
	},
	interval: function() {
		this.minutesCount += 1;
		this.path += "L"+(this.minutesCount*this.width/this.intervals[this.intervals.length-1])+","+(this.height-(this.tweetMinutes*this.height/this.max));
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

	this.mostRetweeted = '';
}

Stats.prototype = {
	init: function() {
		this.max = 0;
		this.secondmax = 0;
		this.thirdmax = 0;

		this.maxIndex = '';
		this.secondmaxIndex = '';
		this.thirdmaxIndex = '';
	},
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
		this.total += 1;

		this.tweetMinutes += 1;

		if(data.text.toLowerCase().indexOf('alizée') != -1 || data.text.toLowerCase().indexOf('alizee') != -1) {
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

		this.init();

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
	}
}
var timeline = new Timeline();
var stats = new Stats();

var twitterClient = new twitter({
	consumer_key: '6OhjJFiJmb2OiFVO6y6DA',
	consumer_secret: 'ejjrUeibzVE3VDjuumXydK6yk6QUcbUAhAXAO7ZXvQ',
	access_token_key: '514231459-4u3QktBkFT8t6jQ15U7wZW97B0dmLqSG5qOM5I9D',
	access_token_secret: 'qtMhkuXiWRLjcKRku5eMEANQp3JmKCturbIrp5x1U'
});

twitterClient.stream('statuses/filter', {'track' : '#dals'}, function (stream) {
	stream.on('data', function (data) {
		console.log(data.text);
		pubsub.emit('tweet', data);
	});
});

io.sockets.on('connection', function (socket) {
	pubsub.on('tweet', function (tweet) {
		if(tweet.retweeted_status ==  null) {
			stats.update(tweet);
			timeline.update();
			socket.emit('tweet', tweet, stats);
		}
		else {
			if(tweet.retweeted_status.retweet_count > stats.mostRetweeted.retweet_count || stats.mostRetweeted == '') {
				stats.mostRetweeted = tweet;
			}
		}
	});

	setInterval(function() {
		timeline.interval();
		socket.emit('smallInterval', timeline);
		timeline.tweetMinutes = 0;
	}, 60000);
});
