
var canvas, ctx;
var width = 800, height = 480;

var skyColour = "rgb( 134, 146, 153 )";
var dropColour = "rgb( 88, 117, 132 )";
var dropsize = 15;

var speed = height * 12.0;
var splashSpeed = 8;


var drops;

var setup = function()
{
	canvas = document.getElementById("canvas");
	canvas.height = height;
	canvas.width = width;

	ctx = canvas.getContext("2d");
	ctx.fillStyle = skyColour;
	ctx.fillRect( 0, 0, width, height );

	drops = [];
	for ( var i = 0; i < 500; i++ )
	{
		var d = new Drop();
		d.Z *= Math.random();
		drops.push( d );
	}
};

var draw = function( deltaT )
{
	ctx.fillStyle = skyColour;
	ctx.fillRect( 0, 0, width, height );

	for ( var i = drops.length - 1; i >= 0; i-- )
	{
		drops[i].update( deltaT );

		if ( drops[i].done() )
		{
			drops.splice( i, 1, new Drop() );
		}
	}

	for ( var i = 0; i < drops.length; i++ )
	{
		drops[i].show();
	}
};



class Drop
{
	constructor()
	{
		this.Y = Math.random() * (2*dropsize);
		this.scale = 1 / (this.Y + 1);

		this.X = (Math.random() - 0.5) * width / this.scale;

		this.Z = (12.0 + 4.0*Math.random()) * height;
		this.splashAnimation = 0.0;
	}

	update( deltaT )
	{
		if ( this.Z <= 0 )
		{
			this.splashAnimation += deltaT * splashSpeed;
		}
		else
		{
			this.Z -= speed * deltaT;

			if ( this.Z < 0 )
			{
				this.splashAnimation -= (this.Z/speed) * splashSpeed;
				this.Z = 0.0;
			}
		}
	}

	show()
	{
		ctx.lineWidth = dropsize * this.scale;
		ctx.lineCap = "round";
		ctx.strokeStyle = dropColour;

		ctx.beginPath();
		var absX = 0.5*width + this.X * this.scale;
		var absY = -1.0 * (this.Z-(height*1.1)) * this.scale + height*0.7;

		var dss = dropsize * this.scale;

		if ( this.Z <= 0 )
		{
			var r0 = 0.0;
			var r1 = this.splashAnimation;

			if ( this.splashAnimation > 0.5 )
				r0 = (this.splashAnimation - 0.5) * 2.0;

			ctx.moveTo( absX - 3*r0*dss, absY - 3*r0*dss );
			ctx.lineTo( absX - 3*r1*dss, absY - 3*r1*dss );

			ctx.moveTo( absX + 3*r0*dss, absY - 3*r0*dss );
			ctx.lineTo( absX + 3*r1*dss, absY - 3*r1*dss );

			if ( this.splashAnimation < 0.7 )
			{
				ctx.moveTo( absX, absY );
				ctx.lineTo( absX, absY - 4*(1.0-(this.splashAnimation * 1.428))*dss );
			}
		}
		else
		{
			ctx.moveTo( absX, absY );
			ctx.lineTo( absX, absY - 4*dss );
		}

		ctx.stroke();
	}

	done()
	{
		if ( this.Z > 0 )
			return false;

		return ( this.splashAnimation >= 1.0 );
	}
}





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


