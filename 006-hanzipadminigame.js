

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
			that.addChar( event.character.glyph, event );
		});
	}


	start()
	{
		this.newChallenge();
	}


	addChar( chr, event )
	{
		if ( this.currentWord == null )
		{
			this.newChallenge();
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



		var col = this.words[this.current];
		if ( glyphs )
		{
			this.hdr_previous.innerHTML = "";

			if ( glyphs == col.glyphs )
			{
				apc( this.hdr_previous, spc("correct","\u2714"), col.eng, " - ", col.glyphs );
			}
			else
			{
				apc( this.hdr_previous, spc("wrong","\u2718"), col.eng, " - ", col.glyphs, " ",
					spc("youanswered", "(you answered: ", glyphs, " )") );
			}
		}

		this.current = Math.floor( this.words.length * Math.random() );
		col = this.words[this.current];
		this.hdr_current.textContent = col.eng;
		this.hdr_hint.textContent = col.glyphs;

		if ( false )
		{
			this.hzp.Colours.Background = col.bg;
			this.hzp.Colours.CurrentStroke = col.fg;
			this.hzp.Colours.PreviousStrokes = col.fg;
			//this.hzp.Colours.ChessSquares = col.chk;
			this.hzp.Colours.ChessSquares = col.bg;
			this.hzp.Colours.Border = col.br;
		}

		this.hzp.reset();
		this.hzp.redraw();

		this.hintStart = 0;
		var that = this;
		requestAnimationFrame( function(t) { that.growHint(t); } );
	};
}


