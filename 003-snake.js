
var canvas, ctx;
var width = 800, height = 480;
var size = 20;

var gameTick = 0.4;
var currentTick = 0.0;

var snake;
var obstacles;

var setup = function()
{
	canvas = document.getElementById("canvas");
	canvas.height = height;
	canvas.width = width;

	ctx = canvas.getContext("2d");
	ctx.fillStyle = 'rgb( 20, 20, 20 )';
	ctx.fillRect( 0, 0, width, height );

	snake = new Snake(new Grid(0,0), new Grid(1,0));

	obstacles = [];
	var x0 = width / (size*2);
	var y0 = height / (size*2);

	for ( var i = 0; (i*size) < width; i++ )
	{
		obstacles.push( new Obstacle( new Grid( i-x0, y0-1 ) ) );
		obstacles.push( new Obstacle( new Grid( i-x0, -1*y0 ) ) );
	}
	for ( var i = 0; (i*size) < height; i++ )
	{
		obstacles.push( new Obstacle( new Grid( x0-1, i-y0 ) ) );
		obstacles.push( new Obstacle( new Grid( -1*x0, i-y0 ) ) );
	}
};

var draw = function( deltaT )
{
	ctx.fillStyle = 'rgb( 20, 20, 20 )';
	ctx.fillRect( 0, 0, width, height );

	currentTick += deltaT;
	if ( currentTick >= gameTick )
	{
		update();
	}

	for ( var i = 0; i < obstacles.length; i++ )
	{
		obstacles[i].show();
	}

	snake.show();
};

var update = function()
{
	currentTick -= gameTick;
	snake.update();
};


class Grid
{
	constructor( x, y )
	{
		this.X = x;
		this.Y = y;
	}

	add( b )
	{
		return new Grid( this.X + b.X, this.Y + b.Y );
	}

	eq( b )
	{
		return this.X == b.X && this.Y == b.Y;
	}

	zero()
	{
		return this.X == 0 && this.Y == 0;
	}

	absolute()
	{
		return [
			(width / 2) + (size * this.X),
			(height / 2) + (size * this.Y),
		];
	}
}

class Snake
{
	constructor(pos, vel)
	{
		this.Velocity = vel;
		this.VelocityQueue = [];
		this.Head = pos;
		this.Tail = [ pos, pos ];
		this.Dead = false;
	}

	update()
	{
		if ( this.VelocityQueue.length > 0 )
		{
			var vq = this.VelocityQueue[0];
			if ( !vq.add(this.Velocity).zero() )
			{
				this.Velocity = this.VelocityQueue[0];
			}
			this.VelocityQueue.splice(0, 1);
		}
		var np = this.Head.add( this.Velocity );

		for ( var i = 0; i < obstacles.length; i++ )
		{
			if ( obstacles[i].Position.eq( np ) )
				this.Dead = true;
		}
		for ( var i = 0; i < this.Tail.length; i++ )
		{
			if ( this.Tail[i].eq( np ) )
				this.Dead = true;
		}

		if ( this.Dead )
			return;

		for ( var i = this.Tail.length - 1; i >= 1; i-- )
		{
			this.Tail[i] = this.Tail[i-1];
		}
		this.Tail[0] = this.Head;
		this.Head = np;
	}

	show()
	{
		ctx.fillStyle = "rgb( 214, 202, 163 )";
		if ( this.Dead )
			ctx.fillStyle = "rgb( 188, 182, 164 )";

		for ( var i = 0; i < this.Tail.length; i++ )
		{
			var c = this.Tail[i].absolute();
			ctx.fillRect( c[0], c[1], size, size );
		}

		ctx.fillStyle = "rgb( 216, 150, 85 )"
		if ( this.Dead )
			ctx.fillStyle = "rgb( 151, 124, 97 )";
		var c = this.Head.absolute();
		ctx.fillRect( c[0], c[1], size, size );
	}
}

class Obstacle
{
	constructor( pos )
	{
		this.Position = pos;
	}

	show()
	{
		ctx.fillStyle = "rgb( 200, 200, 200 )"
		var c = this.Position.absolute();
		ctx.fillRect( c[0], c[1], size, size );
	}
}


window.addEventListener( "keydown", function(event)
{
	if ( event.defaultPrevented )
		return;

	var nv = null;

	switch ( event.key )
	{
		case "h":
			nv = new Grid( -1, 0 );
			break;
		case "j":
			nv = new Grid( 0, 1 );
			break;
		case "k":
			nv = new Grid( 0, -1 );
			break;
		case "l":
			nv = new Grid( 1, 0 );
			break;
		default:
			return
	};

	if ( nv != null )
	{
		if ( snake.VelocityQueue.length > 0 || !snake.Velocity.eq(nv) )
			snake.VelocityQueue.push( nv );
	}

	event.preventDefault();
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


