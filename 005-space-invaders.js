
var canvas, ctx;
var width = 800, height = 480;
var currentlyPressed;

var enemySpeed = width / 10.0;
var enemyStages = [ 0.8, 0.35 ];

var playerSpeed = width / 3.0;
var bulletSpeed = height / 1.0;

var waveTime = 30.0
var waveCounter;

var setup = function()
{
	canvas = document.getElementById("canvas");
	canvas.height = height;
	canvas.width = width;

	ctx = canvas.getContext("2d");
	ctx.fillStyle = 'rgb( 20, 20, 20 )';
	ctx.fillRect( 0, 0, width, height );

	player = new Player();
	enemies = [];
	bullets = [];

	waveCounter = waveTime - 2.5;
	currentlyPressed = { h: false, l: false };
};

var draw = function( deltaT )
{
	ctx.fillStyle = 'rgb( 20, 20, 20 )';
	ctx.fillRect( 0, 0, width, height );

	for ( var i = enemies.length - 1; i >= 0; i-- )
	{
		enemies[i].update( deltaT );
		enemies[i].draw();
	}

	player.update( deltaT );
	player.draw();

	for ( var i = bullets.length - 1; i >= 0; i-- )
	{
		bullets[i].update( deltaT );
		bullets[i].draw();
	}

	waveCounter += deltaT;
	if ( waveCounter >= waveTime )
	{
		waveCounter -= waveTime;
		wave();
	}
};


var wave = function()
{
	var enemyMargin = 20.0;
	var enemiesX = 7;
	var spacingX = ( width - enemyMargin*2 - 80.0 - (enemyStages[0]*enemySpeed) ) / ( enemiesX - 1 );

	for ( var i = 0; i < enemiesX; i++ )
	{
		var x = enemyMargin + 40.0 + i*spacingX;

		for ( var j = 0; j < 4; j++ )
		{
			enemies.push( new Enemy( x, (j+1) * -60 ) );
		}
	}
};




class Player
{
	constructor()
	{
		this.X = width / 2;
		this.Y = height - 40;
		this.Velocity = 0.0;
	}

	draw()
	{
		// todo
		ctx.fillStyle = "rgb(200, 200, 40)"
		ctx.fillRect( this.X - 40, this.Y, 80, 50 );
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
	constructor( x, y )
	{
		this.X = x;
		this.Y = y;
		this.stage = 0;
		this.stageCounter = 0.0;
	}

	draw()
	{
		// todo
		ctx.fillStyle = "rgb(200, 40, 200)"
		ctx.fillRect( this.X - 40, this.Y - 50, 80, 50 );
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

		// TODO: handle collision
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


