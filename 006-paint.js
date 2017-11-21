
var canvas, ctx;
var width = 400, height = 400;

var penpos, lastpos, pendown;
var strokes, currentStroke;

var setup = function()
{
	canvas = document.getElementById("canvas");
	canvas.height = height;
	canvas.width = width;

	ctx = canvas.getContext("2d");

	penpos = [ width/2, height/2 ];
	lastpos = [ width/2, height/2 ];
	pendown = false;

	strokes = [];

	redraw();
};

var draw = function( deltaT )
{
};

var redraw = function()
{
	ctx.fillStyle = 'rgb( 255, 255, 255 )';
	ctx.fillRect( 0, 0, width, height );

	ctx.fillStyle = 'rgb( 245, 245, 245 )';

	var w = width / 16;
	var h = width / 16;
	for ( var i = 4; i < 12; i++ )
	{
		for ( var j = 4; j < 12; j++ )
		{
			if ( (i+j)%2 == 0 ) continue;
			ctx.fillRect( i*w, j*h, w, h );
		}
	}

	ctx.strokeStyle = 'rgb( 200, 200, 200 )';
	ctx.lineWidth = 4;
	ctx.lineCap = "round";

	ctx.strokeRect( width/4, height/4, width/2, height/2 );

	ctx.beginPath();
	ctx.setLineDash([12.3,12.3]);
	w = width / 4;
	h = width / 4;
	ctx.moveTo( w, h );
	ctx.lineTo( 3*w, 3*h );
	ctx.moveTo( 3*w, h );
	ctx.lineTo( w, 3*h );
	ctx.stroke();

	ctx.setLineDash([]);


	ctx.strokeStyle = "rgb( 50, 50, 50 )";
	ctx.lineWidth = 8;

	for ( var i = 0; i < strokes.length; i++ )
	{
		if ( strokes[i].length == 0 )  continue;

		ctx.beginPath();
		ctx.moveTo( strokes[i][0][0], strokes[i][0][1] );

		for ( var j = 1; j < strokes[i].length; j++ )
		{
			ctx.lineTo( strokes[i][j][0], strokes[i][j][1] );
			ctx.moveTo( strokes[i][j][0], strokes[i][j][1] );
		}

		ctx.stroke();
	}
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
		ctx.lineWidth = 10;
		ctx.lineCap = "round";

		ctx.beginPath();
		ctx.moveTo( lastpos[0], lastpos[1] );
		ctx.lineTo( penpos[0], penpos[1] );
		ctx.stroke();

		currentStroke.push( [ penpos[0], penpos[1] ] );
	}
} );

window.addEventListener( "mouseup", function(e)
{
	pendown = false;
	strokes.push(currentStroke);
	redraw();
});
window.addEventListener( "mousedown", function(e)
{
	pendown = true;
	currentStroke = [];

	canvasPosition( e );
	currentStroke = [ [ penpos[0], penpos[1] ] ];
});

window.addEventListener( "keydown", function(e)
{
	if ( e.defaultPrevented )
		return;

	switch ( e.key )
	{
		case "Escape":
			if ( strokes.length > 0 )
				strokes.pop();
			redraw();
			break;
	};
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


