
var canvas, ctx;
var width = 400, height = 400;

var penpos, lastpos, pendown;

var setup = function()
{
	canvas = document.getElementById("canvas");
	canvas.height = height;
	canvas.width = width;

	ctx = canvas.getContext("2d");
	ctx.fillStyle = 'rgb( 255, 255, 255 )';
	ctx.fillRect( 0, 0, width, height );

	penpos = [ width/2, height/2 ];
	lastpos = [ width/2, height/2 ];
	pendown = false;
};

var draw = function( deltaT )
{
};

var canvasPosition = function( e )
{
	if ( e.clientX && e.clientY )
	{
		lastpos[0] = penpos[0];
		lastpos[1] = penpos[1];

		var bcr = canvas.getBoundingClientRect();
		penpos[0] = ( e.clientX - bcr.x ) * ( width / bcr.width );
		penpos[1] = ( e.clientY - bcr.y ) * ( height / bcr.height );
	}
};


window.addEventListener( "mousemove", function(e)
{
	canvasPosition( e );

	if ( pendown )
	{
		ctx.strokeStyle = "rgb( 30, 30, 30 )";
		ctx.lineWidth = 8;
		ctx.lineCap = "round";

		ctx.beginPath();
		ctx.moveTo( lastpos[0], lastpos[1] );
		ctx.lineTo( penpos[0], penpos[1] );
		ctx.stroke();
	}
} );

window.addEventListener( "mouseup", function(e)
{
	pendown = false;
});
window.addEventListener( "mousedown", function(e)
{
	pendown = true;
});





(function()
{
	setup();
	var nextFrame = null;
	var then = 0;

	nextFrame = function( now )
	{
		var deltaT = (now - then) * 0.001;
		draw( deltaT );
		then = now;

		requestAnimationFrame( nextFrame );
	};
	requestAnimationFrame( nextFrame );
})();


