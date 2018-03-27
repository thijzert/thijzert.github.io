#!/usr/bin/php
<?php

$title = @$argv[1];
if ( empty($title) )
{
	fwrite( STDERR, "Usage:   {$argv[0]} TITLE\n" );
	exit( 1 );
}

$title = ucfirst($title);
$name = str_replace(" ", "-", strtolower($title));
$nr = count(glob("*-*.html")) + 1;
$id = sprintf("%03d", $nr);


$js = "{$id}-{$name}.js";
$html = "{$id}-{$name}.html";

file_put_contents( $html, "<!DOCTYPE html>
<html>
	<head>
		<meta charset=\"UTF-8\"/>
		<title>".htmlspecialchars($title)."</title>
	</head>
	<body>
		<canvas id=\"canvas\"></canvas>
		<script src=\"".htmlspecialchars($js)."\"></script>
	</body>
</html>" );

file_put_contents( $js, "
var canvas, ctx;
var width = 800, height = 480;

var setup = function()
{
	canvas = document.getElementById(\"canvas\");
	canvas.height = height;
	canvas.width = width;

	ctx = canvas.getContext(\"2d\");
	ctx.fillStyle = 'rgb( 20, 20, 20 )';
	ctx.fillRect( 0, 0, width, height );
};

var draw = function( deltaT )
{
	ctx.fillStyle = 'rgb( 20, 20, 20 )';
	ctx.fillRect( 0, 0, width, height );
};







(function()
{
	setup();
	var nextFrame = null;
	var then = 0;

	nextFrame = function( now )
	{
		var deltaT = (now - then) * 0.001;
		if ( deltaT > 0.1 )
			deltaT = 0.1;

		draw( deltaT );
		then = now;

		requestAnimationFrame( nextFrame );
	};
	requestAnimationFrame( nextFrame );
})();


" );

file_put_contents( "README.md", "
## {$nr}. [{$title}]({$html})
(enter description here)
", FILE_APPEND );
