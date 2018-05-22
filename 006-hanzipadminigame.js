

class HanzipadMinigame
{
	constructor( rootElement )
	{
		this.words = [];

		this._rootElement = rootElement;
		this._rootElement.classList.add("HanziPadMinigame");

		this.hdr_previous = document.createElement("H2");
		this.hdr_previous.classList.add("previous-answer");
		this._rootElement.appendChild(this.hdr_previous);

		var hcurrent = document.createElement("H1")
		hcurrent.classList.add("current-challenge");
		this._rootElement.appendChild(hcurrent);
		this.hdr_current = document.createElement("SPAN");
		hcurrent.appendChild( this.hdr_current );

		this.hdr_hint = document.createElement("SPAN");
		this.hdr_hint.classList.add("current-hint");
		hcurrent.appendChild( this.hdr_hint );


		var hpc = document.createElement("DIV");
		hpc.classList.add("HanziPad");
		var hpcv = document.createElement("CANVAS");
		hpc.appendChild( hpcv );
		var hpul = document.createElement("UL");
		hpc.appendChild( hpul );
		this._rootElement.appendChild(hpc);

		this.hzp = new Hanzipad();
		this.hzp.canvas = hpcv;
		this.hzp.optionTarget = hpul;

		this.hzp.size = 220;
		this.hzp.border = 30;


		this.hintStart = 0;
		this.currentWord = null;
		this.currentGlyphs

		var that = this;
		this.hzp.addEventListener( "select", function(event)
		{
			that.addChar( event.character, event );
		});
	}


	start()
	{
		var waitingFor = 0;

		for ( var i = 0; i < this.words.length; i++ ) (function(i,x,hzpmg)
		{
			if ( x.image )
			{
				waitingFor++;

				var img = document.createElement("img");
				img.src = x.image;
				img.onload = function()
				{
					x._imagePreloaded = img;

					waitingFor--;
					if ( waitingFor == 0 )
						hzpmg.newChallenge();
				};
				img.onerror = function()
				{
					waitingFor--;
					if ( waitingFor == 0 )
						hzpmg.newChallenge();
				};
			}
		})( i, this.words[i], this );

		if ( waitingFor == 0 )
		{
			this.newChallenge();
		}
		else
		{
			this._rootElement.classList.toggle( "loading", true );
		}
	}


	addChar( chr, event )
	{
		if ( this.currentWord == null )
		{
			this.newChallenge();
		}

		if ( this.currentWord.glyphs.length == 1 )
		{
			this.newChallenge( chr.glyph );
		}
		else
		{
			this.hzp.enqueueCharacter( chr );
			var sq = this.hzp.outputQueue;
			this.hzp.reset();

			if ( sq.length == this.currentWord.glyphs.length )
			{
				this.newChallenge( sq );
			}
		}
	}

	// Hinting: add a hint character that grows over time
	growHint( _now )
	{
		if ( this.hintStart == 0 )
			this.hintStart = _now;

		var t = 0.00012 * ( _now - this.hintStart );
		var s = t*t - 0.2;

		if ( s > 1 )
		{
			this.hdr_hint.style.display = "inline";
			this.hdr_hint.style.fontSize = "100%";
		}
		else
		{
			if ( s < 0 )
			{
				this.hdr_hint.style.display = "none";
			}
			else
			{
				this.hdr_hint.style.display = "inline";
				this.hdr_hint.style.fontSize = (100*s) + "%";
			}

			var that = this;
			requestAnimationFrame( function(t) { that.growHint(t); } );
		}
	};

	newChallenge( glyphs )
	{
		this._rootElement.classList.toggle( "loading", false );

		var apc = function( to )
		{
			for ( var i = 1; i < arguments.length; i++ )
			{
				if ( typeof(arguments[i]) === "string" )
					to.appendChild( document.createTextNode( arguments[i] ) );
				else
					to.appendChild( arguments[i] );
			}
			return to;
		};
		var spc = function( className )
		{
			var to = document.createElement("SPAN");
			to.classList.add( className );

			for ( var i = 1; i < arguments.length; i++ )
			{
				if ( typeof(arguments[i]) === "string" )
					to.appendChild( document.createTextNode( arguments[i] ) );
				else
					to.appendChild( arguments[i] );
			}
			return to;
		};



		if ( glyphs && this.currentWord )
		{
			this.hdr_previous.innerHTML = "";

			if ( glyphs == this.currentWord.glyphs )
			{
				apc( this.hdr_previous, spc("correct","\u2714"), this.currentWord.eng, " - ", this.currentWord.glyphs );
			}
			else
			{
				apc( this.hdr_previous, spc("wrong","\u2718"), this.currentWord.eng, " - ", this.currentWord.glyphs, " ",
					spc("youanswered", "(you answered: ", glyphs, " )") );
			}
		}

		this.current = Math.floor( this.words.length * Math.random() );
		this.currentWord = this.words[this.current];
		this.hdr_current.textContent = this.currentWord.eng;
		this.hdr_hint.textContent = this.currentWord.glyphs;


		// Reset Hanzipad to defaults
		this.hzp.BackgroundImage = null;
		this.hzp.Colours.Background = "#fff";
		this.hzp.Colours.ChessSquares = null;
		this.hzp.Colours.CurrentStroke = "#1e1e1e";
		this.hzp.Colours.PreviousStrokes = "#323232";
		this.hzp.Colours.Border = "#c8c8c8";
		this.hzp.Colours.BackgroundGlyph = "rgba( 80, 80, 80, 0.3 )";

		if ( this.currentWord._imagePreloaded )
		{
			this.hzp.Colours.Background = "rgba( 255, 255, 255, 0.3 )";
			this.hzp.BackgroundImage = this.currentWord._imagePreloaded;
			this.hzp.Colours.Border = "rgba( 30, 30, 30, 0.8 )";
		}
		if ( this.currentWord.colours )
		{
			this.hzp.Colours.Background = this.currentWord.colours.bg;
			this.hzp.Colours.CurrentStroke = this.currentWord.colours.fg;
			this.hzp.Colours.PreviousStrokes = this.currentWord.colours.fg;
			//this.hzp.Colours.ChessSquares = this.currentWord.colours.chk;
			this.hzp.Colours.ChessSquares = null;
			this.hzp.Colours.Border = this.currentWord.colours.br;
		}


		this.hzp.reset();
		this.hzp.resetQueue();
		this.hzp.redraw();

		this.hintStart = 0;
		var that = this;
		requestAnimationFrame( function(t) { that.growHint(t); } );
	};
}


