

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
}




