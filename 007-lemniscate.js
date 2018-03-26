
var canvas, ctx;
var width = 800, height = 300;

var lsize = 0.4 * height;

var particles;

var setup = function()
{
	canvas = document.getElementById("canvas");
	canvas.height = height;
	canvas.width = width;

	ctx = canvas.getContext("2d");
	ctx.fillStyle = 'rgb( 255, 255, 255 )';
	ctx.fillRect( 0, 0, width, height );

	particles = [];
	for ( var i = 0; i < 7; i++ )
	{
		particles.push( new Particle( 0.61, -0.5-i*0.06 ) );
	}
};

var draw = function( deltaT )
{
	ctx.fillStyle = 'rgb( 255, 255, 255 )';
	ctx.fillRect( 0, 0, width, height );


	for ( var i = 0; i < particles.length; i++ )
	{
		particles[i].update( deltaT );
	}

	for ( var i = 0; i < particles.length; i++ )
	{
		particles[i].show( ctx );
	}
};



class Particle
{
	constructor( s, t )
	{
		console.log(t);
		this.T = t;
		this.S = s;
		this.A = linv(s);
	}

	update( deltaT )
	{
		if ( this.T < 0 )
		{
			this.T += deltaT
			if ( this.T > 0 )
				deltaT = this.T;
		}

		if ( this.T >= 0 )
		{
			var p = lemn(this.A);
			var speed = 0.5 - 0.45*p[1];

			this.S += speed * deltaT;
			this.A = linv(this.S)
		}
	}

	show( ctx )
	{
		ctx.fillStyle = "rgb( 20, 20, 80 )";
		ctx.beginPath();

		var p = labs(lemn(this.A));

		ctx.arc( p[0], p[1], 6, 0, Math.PI * 2, 0 );
		ctx.closePath();
		ctx.fill();
	}
}

// The lemniscate curve
var lemn = function(t)
{
	var st = Math.sin(t);
	var ct = Math.cos(t);
	var s = Math.sqrt(2) / (st*st + 1);

	return [
		ct * s,
		ct*st * s
	];
};
var labs = function( x, y )
{
	if ( x.length == 2 )
	{
		y = x[1];
		x = x[0];
	}

	return [
		0.5*width  + x*lsize,
		0.5*height - y*lsize
	];
};

// Inverse integrated lemiscate curve length.
var linv = function( s )
{
	// Values found through experimentation.
	// Pragmaticism trumps a math degree for describing a function that's basically linear

	return (-0.011653156703457948 * Math.sin(4*Math.PI*s) + s) * Math.PI * 2;
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


