

class Hanzipad
{
	constructor()
	{
		this._size = 100;
		this._border = 50;
	}


	set size( v )
	{
		this._size = v;
	}
	get size()
	{
		return this._size;
	}

	set border( v )
	{
		this._border = v;
	}
	get border()
	{
		return this._border;
	}


	/**
	 * Convert a coordinate from absolute base (pixel position within the canvas)
	 * to a relative base (the chess board stretched to a unit square)
	 **/
	fromAbs(v)
	{
		// Note: canvas origin is in the top left corner, while the chess board's
		// origin is bottom left
		return [
			     (v[0] - this._border) / this._size,
			1 - ((v[1] - this._border) / this._size)
		];
	}

	/**
	 * Convert a coordinate from chess base (inverted unit square) to an
	 * absolute pixel position within the canvas.
	 **/
	toAbs(v)
	{
		// Note: canvas origin is in the top left corner, while the chess board's
		// origin is bottom left
		return [
			(v[0]*this._size + this._border),
			((1 - v[1]) * this._size + this._border)
		];
	}


	chessSquare(x, y)
	{
		x = Math.floor( 8 * x );
		y = Math.floor( 8 * y );

		if ( x >= 0 && x < 8 && y >= 0 && y < 8 )
		{
			return String.fromCharCode(65 + x) + (y+1);
		}
		return null;
	}
	chessSquareAbs(x, y)
	{
		var c = this.fromAbs([x, y]);
		return this.chessSquare( c[0], c[1] );
	}


	/**
	 * Return the approximate direction of `b-a` as a letter clock code, which
	 * divides the unit circle in twelve sections labeled a-l. (L is straight up,
	 * A is 30 degrees right, C is horizontal right, F is down, etc.)
	 **/
	clockDirection( a, b )
	{
		var clock = Math.round( 12 * Math.atan2( b[0]-a[0], b[1]-a[1] ) / (Math.PI*2) );
		return String.fromCharCode( 97 + (((clock - 1)+144) % 12) );
	};
	/**
	 * Like clockDirection(), only it works on absolute coordinates
	 **/
	clockDirectionAbs( a, b )
	{
		var clock = Math.round( 12 * Math.atan2( b[0]-a[0], b[1]-a[1] ) / (Math.PI*2) );
		return String.fromCharCode( 97 + (((5 - clock)+144) % 12) );
	};


	/**
	 * Return the 'chess clock code' for a given stroke, which encodes the
	 * starting square on the chess board, and 'clock direction' indicators for
	 * every segment.
	 * For example, an uppercase letter Z may be encoded as "B7cgc"
	 **/
	getStrokeCode( stroke )
	{
		var startSquare = null;
		var direction = null, nextDirection = null, directionCounter = 0;
		var strokeDirection = "";

		var directionCountMax = stroke.length / 15;
		if ( directionCountMax < 5 )  directionCountMax = 5;
		if ( directionCountMax > 12 ) directionCountMax = 12;

		var directionOffset = Math.round( stroke.length / 20 );
		if ( directionOffset < 2 ) directionOffset = 2;
		if ( directionOffset > 5 ) directionOffset = 5;

		for ( var j = 0; j < stroke.length; j++ )
		{
			var x = stroke[j][0], y = stroke[j][1];

			if ( !startSquare )
			{
				startSquare = this.chessSquare( x, y );
			}

			if ( j >= directionOffset )
			{
				var d = this.clockDirection( stroke[j-directionOffset], stroke[j] );

				if ( d != nextDirection )
				{
					directionCounter = 0;
				}
				else if ( nextDirection != direction )
				{
					directionCounter++;
					if ( directionCounter > directionCountMax )
					{
						direction = d;
						strokeDirection += d;
						directionCounter = 0;
					}
				}
				nextDirection = d;
			}
		}

		if ( startSquare != null )
			return startSquare + strokeDirection;

		return null;
	}
}




