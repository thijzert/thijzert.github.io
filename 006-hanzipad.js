

class Hanzipad
{
	constructor()
	{
		this._size = 100;
		this._border = 50;

		this._canvas = null;
		this._ctx = null;

		this._strokes = [];


		this.BackgroundGlyph = "";

		this.Colours = {
			Background: "#fff",
			ChessSquares: "#f5f5f5",
			Border: "#c8c8c8",
			BackgroundGlyph: "rgba( 80, 80, 80, 0.3 )",
			CurrentStroke: "#1e1e1e",
			PreviousStrokes: "#323232"
		};
	}


	set size( v )
	{
		this._size = v;
		if ( this._canvas )
		{
			var s = 2*this._border + this._size;
			this._canvas.height = s;
			this._canvas.width = s;
			this.redraw();
		}
	}
	get size()
	{
		return this._size;
	}

	set border( v )
	{
		this._border = v;
		if ( this._canvas )
		{
			var s = 2*this._border + this._size;
			this._canvas.height = s;
			this._canvas.width = s;
			this.redraw();
		}
	}
	get border()
	{
		return this._border;
	}

	set canvas( c )
	{
		this._ctx = c.getContext("2d");
		this._canvas = c;
		this.redraw();
	}
	get canvas()
	{
		return this._canvas;
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


	/**
	 * Redraw the Hanzipad component
	 **/
	redraw()
	{
		if ( !this._ctx )
			return;

		this._ctx.fillStyle = this.Colours.Background;
		this._ctx.fillRect( 0, 0, this._size + 2*this._border, this._size + 2*this._border );

		this._ctx.fillStyle = this.Colours.ChessSquares;

		var b = this._border;
		var s = this._size;
		var x = this._size / 8;
		for ( var i = 0; i < 8; i++ )
		{
			for ( var j = 0; j < 8; j++ )
			{
				if ( (i+j)%2 == 0 ) continue;
				this._ctx.fillRect( b + i*x, b + j*x, x, x );
			}
		}

		this._ctx.strokeStyle = this.Colours.Border;
		this._ctx.lineWidth = 4;
		this._ctx.lineCap = "round";

		this._ctx.strokeRect( b, b, s, s );

		this._ctx.beginPath();

		x = 0.0615 * this._size;
		this._ctx.setLineDash([ x, x ]);

		this._ctx.moveTo( b, b );
		this._ctx.lineTo( b+s, b+s );
		this._ctx.moveTo( b+s, b );
		this._ctx.lineTo( b, b+s );
		this._ctx.stroke();

		this._ctx.setLineDash([]);



		if ( this.BackgroundGlyph != "" )
		{
			this._ctx.fillStyle = this.Colours.BackgroundGlyph;
			this._ctx.font = s+"px serif";
			this._ctx.textAlign = "center";
			this._ctx.textBaseline = "middle";
			this._ctx.fillText( this.BackgroundGlyph, b+0.5*s, b+0.58*s );
		}


		this._ctx.strokeStyle = this.Colours.PreviousStrokes;
		this._ctx.lineWidth = 8;

		for ( var i = 0; i < this._strokes.length; i++ )
		{
			if ( this._strokes[i].length == 0 )  continue;

			var prev = this.toAbs(this._strokes[i][0]);
			var curr;
			for ( var j = 1; j < this._strokes[i].length; j++ )
			{
				curr = this.toAbs(this._strokes[i][j]);

				this._ctx.beginPath();
				this._ctx.moveTo( prev[0], prev[1] );
				this._ctx.lineTo( curr[0], curr[1] );
				this._ctx.stroke();

				prev = curr;
			}
		}
	}
}




