
var canvas, ctx;
var stars;
var width = 800, height = 480;

var starSize = 10;
var speed = 0.1;

var setup = function()
{
	canvas = document.getElementById("canvas");
	canvas.height = height;
	canvas.width = width;

	ctx = canvas.getContext("2d");
	ctx.fillStyle = 'rgb( 20, 20, 20 )';
	ctx.fillRect( 0, 0, width, height );

	stars = [];
	for ( var i = 0; i < 200; i++ )
	{
		stars.push( new Star );
	}
};

var draw = function()
{
	ctx.fillStyle = 'rgb( 20, 20, 20 )';
	ctx.fillRect( 0, 0, width, height );

	for ( var i = stars.length- 1; i >= 0; i-- )
	{
		stars[i].update();

		if ( stars[i].Z < 0 )
		{
			stars.splice( i, 1, new Star() );
		}

		stars[i].draw(ctx);
	}
};


class Star
{
	constructor()
	{
		this.X = 5 * width * (Math.random()-0.5);
		this.Y = 5 * height * (Math.random()-0.5);
		this.Z = starSize / ( 0.2 + (Math.random()*0.6) );
	}

	draw(ctx)
	{
		if ( this.Z < 0 )
			return;

		var d = 1 / (this.Z + 1);

		var sx = d * this.X + (0.5 * width);
		var sy = d * this.Y + (0.5 * height);

		var r = d * 5;

		ctx.fillStyle = 'rgb( 222, 222, 222 )';
		ctx.fillRect( sx-r, sy-r, 2*r, 2*r );
	}

	update()
	{
		this.Z -= speed;
	}
}






(function()
{
	setup();
	var nextFrame = null;

	nextFrame = function()
	{
		draw();
		window.setTimeout( nextFrame, 1000/100 );
	};
	nextFrame();
})();



