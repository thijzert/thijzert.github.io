
var canvas, ctx;
var width = 800, height = 300;

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

	var a = Math.sqrt(2) * -1;

	ctx.beginPath();

	for ( var t = 0.0; t <= 2*Math.PI+0.03; t+=0.02 )
	{
		var s = Math.sin(t);
		s = 1 / (s*s + 1);
		var x = (a * Math.cos(t)) * s;
		var y = (a * Math.cos(t)*Math.sin(t)) * s;

		var absX = 0.5*width  + x*height/3;
		var absY = 0.5*height + y*height/3;

		if ( t == 0.0 )
			ctx.moveTo( absX, absY );
		else
			ctx.lineTo( absX, absY );
	}

	ctx.stroke();
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


