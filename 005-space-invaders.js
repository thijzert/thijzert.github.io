
var canvas, ctx;
var width = 800, height = 480;
var currentlyPressed;

var enemies, bullets, particles;

var enemySpeed = width / 10.0;
var enemyAcceleration = width / 600.0;
var enemyStages = [ 0.8, 0.15 ];

var playerSpeed = width / 3.0;
var bulletSpeed = height / 1.0;

var waveTime = 30.0
var waveCounter;

var sprites;
var spriteSize = 7;

var explosionSpeed = 150.0;
var explosionGravity = 80.0;
var explosionDrag = 0.8;
var explosionDecay = 0.6;


var setup = function()
{
	canvas = document.getElementById("canvas");
	canvas.height = height;
	canvas.width = width;

	ctx = canvas.getContext("2d");
	ctx.fillStyle = 'rgb( 20, 20, 20 )';
	ctx.fillRect( 0, 0, width, height );

	sprites = {
		enemyA: new Sprite(
			"  x     x  ",
			"   x   x   ",
			"  xxxxxxx  ",
			" xx xxx xx ",
			"xxxxxxxxxxx",
			"x xxxxxxx x",
			"x x     x x",
			"   xx xx   "
		),
		enemyB: new Sprite(
			"   x   x   ",
			" x  xxx  x ",
			" x xxxxx x ",
			" xxx x xxx ",
			"  xxxxxxx  ",
			"   x   x   ",
			"  x     x  "
		),
		enemyC: new Sprite(
			"     x     ",
			"    xxx    ",
			"   xxxxx   ",
			"  xxxxxxx  ",
			" xx  x  xx ",
			" xxxxxxxxx ",
			"   xxxxx   ",
			"  x  x  x  ",
			" x  x x  x "
		),
		player: new Sprite(
			"      x      ",
			"     xxx     ",
			" xxxxxxxxxxx ",
			"xxxxxxxxxxxxx",
			"xxxxxxxxxxxxx"
		)
	};

	player = new Player();
	enemies = [];
	bullets = [];
	particles = [];

	waveCounter = waveTime - 0.5;
	currentlyPressed = { h: false, l: false };
};

var draw = function( deltaT )
{
	ctx.fillStyle = 'rgb( 20, 20, 20 )';
	ctx.fillRect( 0, 0, width, height );

	var newSpeed = enemySpeed + enemyAcceleration * deltaT;
	var f = newSpeed / enemySpeed;
	enemyStages[0] /= f;
	enemyStages[1] /= f;
	enemySpeed = newSpeed;

	if ( !player.Dead )
	{
		for ( var i = particles.length - 1; i >= 0; i-- )
		{
			particles[i].update( deltaT );
			if ( particles[i].Intensity < -1 )
				particles.splice( i, 1 );
		}

		for ( var i = enemies.length - 1; i >= 0; i-- )
		{
			enemies[i].update( deltaT );
			if ( enemies[i].Dead )
				enemies.splice( i, 1 );
		}

		for ( var i = bullets.length - 1; i >= 0; i-- )
		{
			bullets[i].update( deltaT );
			if ( bullets[i].Y < -20 )
				bullets.splice( i, 1 );
		}

		player.update( deltaT );

		waveCounter += deltaT;
		if ( waveCounter >= waveTime )
		{
			waveCounter -= waveTime;
			wave();
		}
	}

	for ( var i = particles.length - 1; i >= 0; i-- )
	{
		particles[i].draw();
	}
	for ( var i = enemies.length - 1; i >= 0; i-- )
	{
		enemies[i].draw();
	}
	for ( var i = bullets.length - 1; i >= 0; i-- )
	{
		bullets[i].draw();
	}
	player.draw();
};


var wave = function()
{
	var enemyMargin = 20.0;
	var enemySpacing = spriteSize * 1;
	var enemyWidth = sprites.enemyA.size()[0];

	var enemiesX = 7;
	var spacingX = ( width - enemyMargin*2 - enemyWidth - (enemyStages[0]*enemySpeed) ) / ( enemiesX - 1 );

	var Y = 10;

	for ( var j = 0; j < 5; j++ )
	{
		var t = 0;
		if ( j == 4 )      t = 2;
		else if ( j >= 2 ) t = 1;

		for ( var i = 0; i < enemiesX; i++ )
		{
			var x = enemyMargin + (0.5*enemyWidth) + i*spacingX;

			enemies.push( new Enemy( x, -1*Y, t ) );
		}

		var e = new Enemy( x, -1*Y, t );
		Y += e.Sprite.size()[1] + enemySpacing;
	}
};




class Player
{
	constructor()
	{
		this.X = width / 2;
		this.Y = height - sprites.player.size()[1];
		this.xoff = sprites.player.size()[0] / -2;
		this.Velocity = 0.0;
		this.Dead = false;
	}

	draw()
	{
		ctx.fillStyle = "rgb(200, 200, 40)";
		if ( this.Dead )
		{
			ctx.fillStyle = "rgb( 146, 147, 147 )";
		}
		sprites.player.draw( this.X + this.xoff, this.Y );
	}

	update( deltaT )
	{
		if ( currentlyPressed.h && !currentlyPressed.l )
			this.Velocity = -1;
		else if ( !currentlyPressed.h && currentlyPressed.l )
			this.Velocity = 1;
		else
			this.Velocity = 0;

		this.X += this.Velocity * playerSpeed * deltaT;

		if ( this.X < 40 )
			this.X = 40;
		if ( this.X > (width-40) )
			this.X = width-40;
	}
}

class Enemy
{
	constructor( x, y, type )
	{
		this.X = x;
		this.Y = y;
		this.stage = 0;
		this.stageCounter = 0.0;
		this.Dead = false;

		if ( type == 2 )
		{
			this.Sprite = sprites.enemyC;
		}
		else if ( type == 1 )
		{
			this.Sprite = sprites.enemyB;
		}
		else
		{
			this.Sprite = sprites.enemyA;
		}

		this.off = this.Sprite.size();
		this.off[0] /= 2;
	}

	draw()
	{
		ctx.fillStyle = "rgb(200, 40, 200)"
		this.Sprite.draw( this.X - this.off[0], this.Y - this.off[1] );
	}

	update( deltaT )
	{
		var tmax = enemyStages[0];
		if ( this.stage == 0 || this.stage == 2 )
			tmax = enemyStages[1];

		var tn = this.stageCounter + deltaT;
		if ( tn <= tmax )
		{
			this.innerUpdate( deltaT );
		}
		else
		{
			var snp = tmax - this.stageCounter;
			this.innerUpdate( snp );
			this.stage = (this.stage+1) % 4;
			this.stageCounter = 0.0;

			this.update( deltaT - snp );
			return;
		}

		var off = [ this.X - this.off[0], this.Y - this.off[1] ];
		for ( var i = bullets.length - 1; i >= 0; i-- )
		{
			if ( this.Sprite.inside( bullets[i].X - off[0], bullets[i].Y - off[1] ) )
			{
				bullets.splice( i, 1 );
				this.die();
				break;
			}
		}

		if ( this.Y >= height )
			player.Dead = true;
	}

	die()
	{
		this.Dead = true;
		this.Sprite.explode( this.X - this.off[0], this.Y - this.off[1] );
	}

	innerUpdate( deltaT )
	{
		if ( this.stage == 0 || this.stage == 2 )
		{
			this.Y += deltaT * enemySpeed;
		}
		else if ( this.stage == 1 )
		{
			this.X += deltaT * enemySpeed;
		}
		else if ( this.stage == 3 )
		{
			this.X -= deltaT * enemySpeed;
		}

		this.stageCounter += deltaT;
	}
}

class Bullet
{
	constructor( x, y )
	{
		this.X = x;
		this.Y = y;
	}

	draw()
	{
		// todo
		ctx.strokeStyle = "rgb(200, 200, 200)"
		ctx.lineWidth = 7
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo( this.X, this.Y );
		ctx.lineTo( this.X, this.Y + 30 );
		ctx.stroke();
	}

	update( deltaT )
	{
		this.Y -= deltaT * bulletSpeed;
	}
}


class Sprite
{
	constructor(...spriteData)
	{
		this.spriteData = spriteData;

		if ( this.spriteData.length == 0 )
			console.error( "empty sprite" );

		var ln = this.spriteData[0].length;
		for ( var i = 0; i < this.spriteData.length; i++ )
		{
			if ( this.spriteData[i].length != ln )
				console.error( "inconsistent sprite size!" );
		}
	}

	size()
	{
		return [ spriteSize * this.spriteData[0].length, spriteSize * this.spriteData.length ];
	}

	draw( x, y )
	{
		for ( var i = 0; i < this.spriteData.length; i++ )
		{
			for ( var j = 0; j < this.spriteData[i].length; j++ )
			{
				if ( this.spriteData[i].substr(j,1) == "x" )
				{
					ctx.fillRect( x + spriteSize*j, y + spriteSize*i, spriteSize + 0.7, spriteSize + 0.7 );
				}
			}
		}
	}

	explode( x, y )
	{
		for ( var i = 0; i < this.spriteData.length; i++ )
		{
			for ( var j = 0; j < this.spriteData[i].length; j++ )
			{
				if ( this.spriteData[i].substr(j,1) == "x" )
				{
					particles.push( new SmokeParticle( x + spriteSize*(j+0.5), y + spriteSize*(i+0.5), spriteSize ) );
				}
			}
		}
	}

	inside( x, y )
	{
		var epsilon = 0.4;

		for ( var i = 0; i < this.spriteData.length; i++ )
		{
			for ( var j = 0; j < this.spriteData[i].length; j++ )
			{
				if ( this.spriteData[i].substr(j,1) == "x" )
				{
					if ( x >= spriteSize*j - epsilon && x <= spriteSize*(j+1) + epsilon )
					{
						if ( y >= spriteSize*i - epsilon && y <= spriteSize*(i+1) + epsilon )
						{
							return true;
						}
					}
				}
			}
		}

		return false;
	}
}


class SmokeParticle
{
	constructor( x, y, size )
	{
		this.X = x;
		this.Y = y;
		this.S = size;

		var v = (0.2 + 0.8*Math.random()) * explosionSpeed;
		var θ = 360 * Math.random();

		this.Intensity = (0.8 + 0.2*Math.random())
		this.Decay = (0.3 + 0.7*Math.random()*Math.random()) * explosionDecay;

		this.V = [ v * Math.sin(θ), v * Math.cos(θ) ];
	}

	draw()
	{
		var s = Math.round( 256 * this.Intensity );
		if ( s < 0 )    s = 0
		if ( s > 255 )  s = 255;

		ctx.fillStyle = "rgb("+s+","+s+","+s+")";
		ctx.fillRect( this.X - this.S/2, this.Y - this.S/2, this.S, this.S );
	}

	update( deltaT )
	{
		var acc = [ 0, explosionGravity ];
		acc[0] += this.V[0] * explosionDrag * -1;
		acc[1] += this.V[1] * explosionDrag * -1;

		this.V[0] += acc[0] * deltaT;
		this.V[1] += acc[1] * deltaT;

		this.X += this.V[0] * deltaT;
		this.Y += this.V[1] * deltaT;

		this.Intensity -= this.Decay * deltaT;
	}
}




window.addEventListener( "keydown", function(event)
{
	if ( event.defaultPrevented )
		return;

	switch ( event.key )
	{
		case "h":
		case "l":
			currentlyPressed[event.key] = true;
			break;
		case " ":
			bullets.push( new Bullet( player.X, player.Y ) );
			break;
	}
} );

window.addEventListener( "keyup", function(event)
{
	if ( event.defaultPrevented )
		return;

	switch ( event.key )
	{
		case "h":
		case "l":
			currentlyPressed[event.key] = false;
			break;
	}
} );

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


