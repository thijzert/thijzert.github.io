
var canvas, ctx;
var width = 800, height = 300;

var lsize = 0.3 * height;

var setup = function()
{
	canvas = document.getElementById("canvas");
	canvas.height = height;
	canvas.width = width;

	ctx = canvas.getContext("2d");
	ctx.fillStyle = 'rgb( 255, 255, 255 )';
	ctx.fillRect( 0, 0, width, height );






	ctx.fillStyle = 'rgb( 255, 255, 255 )';
	ctx.fillRect( 0, 0, width, height );

	ctx.lineWidth = 8;
	ctx.lineCap = "round";
	ctx.strokeStyle = 'rgb( 60, 20, 20 )';

	ctx.beginPath();

	for ( var t = 0.0; t <= 2*Math.PI+0.03; t+=0.02 )
	{
		var p = lemn( t );

		if ( t == 0.0 )
			ctx.moveTo( p[0], p[1] );
		else
			ctx.lineTo( p[0], p[1] );
	}

	ctx.stroke();
};

// The lemniscate curve
var lemn = function(t)
{
	var st = Math.sin(t);
	var ct = Math.cos(t);
	var s = Math.sqrt(2) / (st*st + 1);

	var x = ct * s
	var y = ct*st * s;

	return [
		0.5*width  + x*lsize,
		0.5*height - y*lsize
	];
};

var draw = function( deltaT )
{
};







(function()
{
	setup();
	var nextFrame = null;
	var then = 0;

	nextFrame = function( now )
	{
		var deltaT = (now - then) * 0.001;
		if ( deltaT > 1.0 )
			deltaT = 1.0;

		draw( deltaT );
		then = now;

		requestAnimationFrame( nextFrame );
	};
	requestAnimationFrame( nextFrame );
})();


