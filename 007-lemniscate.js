
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


	ctx.lineWidth = 6;
	ctx.lineCap = "round";
	ctx.strokeStyle = 'rgb( 10, 10, 80 )';

	ctx.beginPath();
	ctx.moveTo( 0, height );

	for ( var s = 0.0; s <= 1.0; s+= 0.01 )
	{
		var t = linv(s);
		ctx.lineTo( width * s, height * (1-(t / (Math.PI*2) )));
	}

	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo( 0, linvprime(0) );

	for ( var s = 0.0; s <= 1.0; s+= 0.01 )
	{
		var t = linvprime(s);
		ctx.lineTo( width * s, height * (1-t) );
	}

	ctx.stroke();

	ctx.lineWidth = 3;
	ctx.lineCap = "round";
	ctx.strokeStyle = 'rgb( 150, 70, 70 )';



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


// Inverse integrated lemiscate curve length.
// TODO: direct formula
var linv = (function()
{
	var npoints = 1000;
	var points = new Array(npoints + 1);
	var dmax = 0.0;
	var dmin = Infinity;

	var pl = lemn(0);
	var total = 0.0;
	points[0] = { s: 0.0, t: 0.0 };

	for ( var i = 1; i <= npoints; i++ )
	{
		var t = Math.PI * 2 * i / npoints;
		var pp = lemn(t);

		var d = Math.sqrt( (pp[0]-pl[0])*(pp[0]-pl[0]) + (pp[1]-pl[1])*(pp[1]-pl[1]) );
		total += d;
		points[i] = { s: total, t: t, d: d };

		if ( d > dmax )
			dmax = d;
		if ( d < dmin )
			dmin = d;

		pl[0] = pp[0];
		pl[1] = pp[1];
	}

	for ( var i = 0; i <= npoints; i++ )
	{
		points[i].s /= total;
	}

	console.log(dmax,dmin,(dmax-dmin)/2, dmin + (dmax-dmin)/2);
	console.log((dmax-dmin)/(2*dmax), (dmin + (dmax-dmin)/2)/dmax);
	window.linvprime = (function( s )
	{
		s -= Math.floor(s);

		// TODO: logarithmic search
		for ( var i = 0; i < npoints; i++ )
		{
			if ( points[i].s < s )
				continue;

			// TODO: more-clever-than-linear interpolation
			var d = points[i+1].s - points[i].s
			if ( d > 0 )
			{
				d = ( s - points[i].s ) / d
				return ( points[i].d*d + points[i+1].d*(1-d) ) / dmax;
			}
			else
			{
				return points[i].d / dmax;
			}
		}

		return 1;
	});
	return (function( s )
	{
		s -= Math.floor(s);

		// TODO: logarithmic search
		for ( var i = 0; i < npoints; i++ )
		{
			if ( points[i].s < s )
				continue;

			// TODO: more-clever-than-linear interpolation
			var d = points[i+1].s - points[i].s
			if ( d > 0 )
			{
				d = ( s - points[i].s ) / d
				return points[i].t*d + points[i+1].t*(1-d)
			}
			else
			{
				return points[i].t;
			}
		}

		return Math.PI * 2;
	});
})();

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


