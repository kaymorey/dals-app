$(function() {

	var SCREEN_WIDTH  = window.innerWidth,
	SCREEN_HEIGHT = window.innerHeight;

	var paper = Raphael(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

	var path = "M0,0L30,40L30,70L50,70L100,120";

	var c = paper.path(path);
});