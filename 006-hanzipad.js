

class Hanzipad
{
	constructor()
	{
		this._size = 100;
		this._border = 50;

		this._canvas = null;
		this._ctx = null;
		this._optionTarget = null;

		this._strokes = [];
		this._options = [];
		this._activeIndex = 0;

		this._pendown = false;
		this._penpos = [ 0.5, 0.5 ];
		this._lastpos = [ 0.5, 0.5 ];
		this._currentStroke = [];

		this._queue = [];


		this.BackgroundGlyph = "";

		this.Colours = {
			Background: "#fff",
			ChessSquares: "#fff",
			Border: "#c8c8c8",
			BackgroundGlyph: "rgba( 80, 80, 80, 0.3 )",
			CurrentStroke: "#1e1e1e",
			PreviousStrokes: "#323232"
		};
	}


	/**
	 * Get/set the size, in CSS pixels, of the Hanzipad chess board
	 **/
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

	/**
	 * Get/set the size of the border around the chess board
	 **/
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

	/**
	 * Set the target HTML canvas in which to draw the main Hanzipad component
	 **/
	set canvas( c )
	{
		if ( this._canvas )
		{
			this._canvas.removeEventListener( "mousedown", this );
			this._canvas.removeEventListener( "mousemove", this );

			this._canvas.removeEventListener( "touchstart", this );
			this._canvas.removeEventListener( "touchmove", this );
			this._canvas.removeEventListener( "touchend", this );
		}
		else
		{
			window.addEventListener( "mouseup", this );
			window.addEventListener( "touchcancel", this );
		}

		c.addEventListener( "mousedown", this );
		c.addEventListener( "mousemove", this );

		c.addEventListener( "touchstart", this );
		c.addEventListener( "touchmove", this );
		c.addEventListener( "touchend", this );

		this._ctx = c.getContext("2d");
		this._canvas = c;
		this.redraw();
	}
	get canvas()
	{
		return this._canvas;
	}


	/**
	 * A DOM UL or OL element in which the Hanzipad will highlight its options
	 **/
	set optionTarget( v )
	{
		v.classList.add( "optionList" );

		this._optionTarget = v;
		this.redraw();
	}

	/**
	 * The index of the selected option
	 **/
	get activeIndex()
	{
		if ( this._options.length == 0 )
			return 0;

		return this._activeIndex % this._options.length;
	}
	set activeIndex( i )
	{
		if ( this._options.length == 0 )
			this._activeIndex = 0;

		this._activeIndex = i % this._options.length;
		if ( this._activeIndex < 0 )
		{
			this._activeIndex += 2*this._options.length;
			this._activeIndex %= this._options.length;
		}


		if ( this._optionTarget )
		{
			var j = 0;
			var li = this._optionTarget.firstChild;
			while ( li )
			{
				if ( li.tagName == "LI" && li.classList.contains("option") )
				{
					if ( j == this._activeIndex )
						li.classList.add("active");
					else
						li.classList.remove("active");

					j++;
				}
				li = li.nextSibling;
			}
		}
	}

	/**
	 * All possible characters for the given drawing
	 **/
	get options()
	{
		var rv = JSON.parse(JSON.stringify(this._options));
		if ( rv.length > 0 )
		{
			rv[ this._activeIndex % rv.length ].active = true;
		}

		return rv;
	}


	/**
	 * Add a character to the output queue
	 **/
	enqueueCharacter( character )
	{
		this._queue.push( character );
		this.redraw();
	}

	/**
	 * Remove a character from the output queue
	 **/
	dequeueCharacter( i )
	{
		if ( i >= 0 && i < this._queue.length )
			this._queue = this._queue.slice( i, 0 );

		this.redraw();
	}

	/**
	 * Remove a character from the output queue
	 **/
	resetQueue()
	{
		this._queue = [];
		this.redraw();
	}

	/**
	 * Get the currently queued output
	 **/
	get outputQueue()
	{
		var rv = "";
		for ( var i = 0; i < this._queue.length; i++ )
			rv += this._queue[i].glyph;
		return rv;
	}


	/**
	 * Get the chess clock code for the current drawing
	 **/
	get glyphCode()
	{
		var rv = [];
		for ( var i = 0; i < this._strokes.length; i++ )
		{
			var sc = this.getStrokeCode( this._strokes[i] );
			if ( sc )
				rv.push( sc );
		}
		return rv;
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
		var strokeDirection = "";

		var stroke_size = 0.0;
		for ( var i = 1; i < stroke.length; i++ )
		{
			var dx = stroke[i][0] - stroke[i-1][0];
			var dy = stroke[i][1] - stroke[i-1][1];
			var d = Math.sqrt( dx*dx + dy*dy );

			stroke_size += d;

			var dy = stroke[i][1] - stroke[i-1][1];
		}

		// Target distance: only when the stroke moves at least this much in any direction will we count it as a change in direction
		var tgt_d = stroke_size / 12;

		// Minimal distance: if two points are closer than this, skip points until they aren't.
		var min_d = stroke_size / 20;
		if ( min_d < 0.05 )  min_d = 0.05;

		// The direction the stroke is moving
		var current_hdg = "";

		// Total distance: the distance traveled so far in this direction since the last turn
		// (We give it a bit of bonus material at the start.)
		var td = tgt_d * 0.5;
		for ( var i = 0; i < stroke.length; i++ )
		{
			var d = 0.0;
			var d0 = 0.0;

			for ( var j = i+1; j < stroke.length && d < min_d; j++ )
			{
				if ( !startSquare )
				{
					startSquare = this.chessSquare( stroke[i][0], stroke[i][1] );
				}

				var dx = stroke[i][0] - stroke[j][0];
				var dy = stroke[i][1] - stroke[j][1];
				d = Math.sqrt( dx*dx + dy*dy );

				// Save the distance to the very next point for later
				if ( j == i+1 )
					d0 = d;
			}
			if ( j >= stroke.length )
				break;

			var hdg = this.clockDirection( stroke[i], stroke[j] );
			if ( hdg != current_hdg )
			{
				if ( current_hdg != "" )
				{
					if ( td > tgt_d )
					{
						strokeDirection += current_hdg;
					}

					td = 0;
				}
			}
			current_hdg = hdg;
			td += d0;
		}
		if ( current_hdg != "" && td > tgt_d )
		{
			strokeDirection += current_hdg;
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
		if ( this._ctx )
		{
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

			// Align to centre of pixel
			b += 0.5;

			this._ctx.strokeStyle = this.Colours.Border;
			this._ctx.lineWidth = this._size * 0.013;
			this._ctx.lineWidth = this._size * 0.005;
			this._ctx.lineCap = "round";

			this._ctx.strokeRect( b, b, s, s );

			this._ctx.beginPath();

			x = 0.0615 * this._size;
			//this._ctx.setLineDash([ x, x ]);

			x = 0.5 * this._size;
			this._ctx.moveTo( b, b );
			this._ctx.lineTo( b+s, b+s );
			this._ctx.moveTo( b+s, b );
			this._ctx.lineTo( b, b+s );
			this._ctx.stroke();

			//this._ctx.setLineDash([]);


			this._ctx.lineWidth = this._size * 0.005;
			this._ctx.beginPath();

			x = 0.5 * this._size;
			this._ctx.moveTo( b+x, b );
			this._ctx.lineTo( b+x, b+s );
			this._ctx.moveTo( b+s, b+x );
			this._ctx.lineTo( b, b+x );

			this._ctx.stroke();


			if ( this.BackgroundGlyph != "" )
			{
				this._ctx.fillStyle = this.Colours.BackgroundGlyph;
				this._ctx.font = s+"px serif";
				this._ctx.textAlign = "center";
				this._ctx.textBaseline = "middle";
				this._ctx.fillText( this.BackgroundGlyph, b+0.5*s, b+0.58*s );
			}


			this._ctx.strokeStyle = this.Colours.PreviousStrokes;
			this._ctx.lineWidth = this._size * 0.04;

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

		if ( this._optionTarget )
		{
			this._optionTarget.innerHTML = "";


			var li = document.createElement("LI");
			li.classList.add( "undo" );
			if ( this._strokes.length == 0 )
				li.classList.add( "nope" );
			li.innerHTML = "<span class=\"glyph\">\u2718</span><span class=\"sound\">undo</span>";

			li.addEventListener( "click", (function(hzp)
			{
				return (function( event )
				{
					hzp.popStroke();
					event.preventDefault();
					return false;
				});
			})( this ));
			this._optionTarget.appendChild(li);


			for ( var i = 0; i < this._queue.length; i++ )
			{
				var li = document.createElement("LI");
				li.classList.add( "queued" );
				li.dataset["index"] = i;
				li.dataset["glyph"] = this._queue[i].glyph;


				var s = document.createElement("SPAN");
				s.classList.add( "glyph" );
				s.textContent = this._queue[i].glyph;
				li.appendChild( s );

				s = document.createElement("SPAN");
				s.classList.add( "sound" );
				if ( this._queue[i].descriptions.length > 0 )
					s.textContent = this._queue[i].descriptions[0].sound;

				li.appendChild( s );

				li.addEventListener( "click", (function(i,hzp)
				{
					return (function( event )
					{
						hzp.dequeueCharacter( i );
					});
				})( i, this ));

				this._optionTarget.appendChild(li);
			}

			for ( var i = 0; i < this._options.length; i++ )
			{
				var li = document.createElement("LI");
				li.classList.add("option");
				li.dataset["index"] = i;
				li.dataset["glyph"] = this._options[i].character.glyph;

				if ( i == this._activeIndex )
					li.classList.add( "active" );

				var s = document.createElement("SPAN");
				s.setAttribute( "class", "glyph" );
				s.textContent = this._options[i].character.glyph;
				li.appendChild( s );

				s = document.createElement("SPAN");
				s.setAttribute( "class", "sound" );
				if ( this._options[i].character.descriptions.length > 0 )
				{
					s.textContent = this._options[i].character.descriptions[0].sound;
				}
				li.appendChild( s );

				li.addEventListener( "click", (function(i,hzp)
				{
					return (function( event )
					{
						hzp.activeIndex = i;
						hzp.accept();
					});
				})( i, this ));

				//s = document.createElement("SPAN");
				//s.setAttribute( "class", "score" );
				//s.textContent = this._options[i].score.toFixed(2);
				//li.appendChild( s );

				//s = document.createElement("SPAN");
				//s.setAttribute( "class", "normalized-score" );
				//if ( this._strokes.length > 0 )
				//{
				//	s.textContent = (this._options[i].score / this._strokes.length).toFixed(2);
				//}
				//li.appendChild( s );

				this._optionTarget.appendChild(li);
			}
		}
	}

	/**
	 * Something changed - fire all relevant events and redraw.
	 **/
	_changed()
	{
		this._options = Hanzipad.LookupCharacter( this.glyphCode );
		this._activeIndex = 0;

		var opts = new Event("options");
		opts.characterOptions = JSON.parse(JSON.stringify(this._options));

		this.dispatchEvent(opts);
		this.dispatchEvent(new Event("change"));
		this.redraw();
	}


	/**
	 * Accept the currently highlighted character (if any) and reset.
	 **/
	accept()
	{
		if ( this._options.length > 0 )
		{
			var ch = this.options[ this.activeIndex ];
			var sel = new Event("select");
			sel.character = ch.character;
			sel.score = ch.score;
			this.dispatchEvent(sel);
		}

		this.reset();
	}


	/**
	 * Remove all strokes, begin anew.
	 **/
	reset()
	{
		this._strokes = [];

		this._pendown = false;
		this._currentStroke = [];
		this._changed();
	}

	/**
	 * Remove the last stroke
	 **/
	popStroke()
	{
		if ( this._strokes.length > 0 )
			this._strokes.pop();

		this._changed();
	}


	/**
	 * Handle events
	 **/
	handleEvent( event )
	{
		if ( event.type == "mousedown" || event.type == "touchstart" )
		{
			return this._mouseDown( event );
		}
		else if ( event.type == "mousemove" || event.type == "touchmove" )
		{
			return this._mouseMove( event );
		}
		else if ( event.type == "mouseup" || event.type == "touchend" )
		{
			return this._mouseUp( event );
		}
		else if ( event.type == "touchcancel" )
		{
			this._pendown = false;
		}
	}


	_touchPosition( e )
	{
		if (( "clientX" in e ) && ( "clientY" in e ))
		{
			this._lastpos = this._penpos;

			var bcr = this._canvas.getBoundingClientRect();
			var s = 2*this._border + this._size;
			var pp = [
				( e.clientX - bcr.x ) * ( s / bcr.width ),
				( e.clientY - bcr.y ) * ( s / bcr.height )
			];

			this._penpos = this.fromAbs( pp );
		}
		else if ( e.touches && e.touches.length > 0 )
		{
			this._touchPosition( e.touches[0] );
		}
	};
	_mouseMove(e)
	{
		this._touchPosition( e );

		if ( this._pendown )
		{
			e.preventDefault();

			this._ctx.strokeStyle = this.Colours.CurrentStroke;
			this._ctx.lineWidth = this._size * 0.05;
			this._ctx.lineCap = "round";

			var lpa = this.toAbs( this._lastpos );
			var ppa = this.toAbs( this._penpos );

			this._ctx.beginPath();
			this._ctx.moveTo( lpa[0], lpa[1] );
			this._ctx.lineTo( ppa[0], ppa[1] );
			this._ctx.stroke();

			this._currentStroke.push( [ this._penpos[0], this._penpos[1] ] );
		}
	}
	_mouseUp(e)
	{
		if ( this._pendown )
		{
			this._pendown = false;
			this._strokes.push(this._currentStroke);
			this._changed();
		}
	}
	_mouseDown(e)
	{
		this._touchPosition( e );

		this._pendown = true;
		this._currentStroke = [ [ this._penpos[0], this._penpos[1] ] ];
	};



	/**
	 * Handle custom events. (Implement the EventTarget interface.)
	 * Source: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
	 **/
	addEventListener( type, callback )
	{
		if ( !this._listeners )
			this._listeners = {};
		if ( !(type in this._listeners ) )
			this._listeners[type] = [];

		this._listeners[type].push( callback );
	}
	removeEventListener( type, callback )
	{
		if ( !this._listeners || !(type in this._listeners ) )
			return;

		var stack = this._listeners[type];
		for ( var i = 0; i < stack.length; i++ )
		{
			if ( stack[i] === callback )
			{
				stack.splice( i, 1 );
				return;
			}
		}
	}
	dispatchEvent( event )
	{
		if ( !this._listeners || !(event.type in this._listeners ) )
			return true;

		var stack = this._listeners[event.type];
		for ( var i = 0; i < stack.length; i++ )
		{
			stack[i].call( this, event );
		}
		return !event.defaultPrevented;
	}



	/**
	 * Character database
	 **/


	static RegisterCharacter( glyph, stroke, descriptions )
	{
		if ( !Hanzipad._characterDatabase )
			Hanzipad._characterDatabase = [];

		stroke = stroke.trim().split(/ +/);
		var sl = stroke.length;
		if ( sl > 99 )  return;

		if ( Hanzipad._characterDatabase.length <= sl )
		{
			for ( var i = Hanzipad._characterDatabase.length; i <= sl; i++ )
			{
				Hanzipad._characterDatabase[i] = [];
			}
		}

		Hanzipad._characterDatabase[sl].push({
			glyph: glyph,
			stroke: stroke,
			descriptions: descriptions
		});
	};

	// Difference in starting square
	static _sqdif( a, b )
	{
		var dx = a.charCodeAt(0) - b.charCodeAt(0);
		var dy = a.charCodeAt(1) - b.charCodeAt(1);

		if ( dx == 0 )  return Math.abs(dy);
		if ( dy == 0 )  return Math.abs(dx);

		return Math.sqrt( dx*dx + dy*dy );
	};

	// Difference in direction
	static _dirdif( a, b )
	{
		if ( a == "" )
		{
			if ( b == "" )
				return 0;
			return 1;
		}
		else if ( b == "" )
			return 1;

		var s0 = a.charCodeAt(0) - b.charCodeAt(0);
		if ( s0 < 0 )  s0 *= -1;
		s0 *= 0.3;

		var s1a = Hanzipad._dirdif( a.substr(1), b.substr(1) );
		var s1b = s1a;
		if ( a.length > b.length )
			s1b = Hanzipad._dirdif( a.substr(1), b );
		else if ( b.length < a.length )
			s1b = Hanzipad._dirdif( a, b.substr(1) );

		if ( s1b < s1a )
			return s0 + s1b;
		return s0 + s1a;
	};


	static _sdif( a, b )
	{
		if ( ! Hanzipad._sqrt )
		{
			Hanzipad._sqrt = new Array(20);
			for ( var i = 0; i < 20; i++ )
				Hanzipad._sqrt[i] = Math.sqrt(i);
		}

		var d0 = Hanzipad._sqdif( a, b );
		var d1 = Hanzipad._dirdif( a.substr(2), b.substr(2) );
		d1 /= Hanzipad._sqrt[a.length];

		return d0*0.2 + d1*0.9;
	};

	static LookupCharacter( stroke )
	{
		//stroke = stroke.trim().split(/ +/);
		var jstr = stroke.join("");

		if ( ! ( stroke.length in Hanzipad._characterDatabase ) )
			return [];

		var wieners = [];
		var dmax = stroke.length * 0.7;

		for ( var i = 0; i < Hanzipad._characterDatabase[stroke.length].length; i++ )
		{
			var d = 0.0;
			for ( var j = 0; j < stroke.length; j++ )
			{
				d += Hanzipad._sdif( Hanzipad._characterDatabase[stroke.length][i].stroke[j], stroke[j] );

				if ( d > dmax )  break;
			}

			if ( d < dmax )
			{
				wieners.push({
					score: d,
					character: Hanzipad._characterDatabase[stroke.length][i]
				});
			}
		}

		wieners.sort(function(a,b)
		{
			return a.score - b.score;
		});

		return wieners;
	}
}




