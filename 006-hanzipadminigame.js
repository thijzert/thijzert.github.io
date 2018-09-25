

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

		this.hdr_hint = document.createElement("DIV");
		this.hdr_hint.classList.add("current-hint");
		this._rootElement.appendChild( this.hdr_hint );
		this.hdr_hints = [];


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
					if ( waitingFor == 0 && hzpmg.currentWord == null )
						hzpmg.newChallenge();
				};
				img.onerror = function()
				{
					waitingFor--;
					if ( waitingFor == 0 && hzpmg.currentWord == null )
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
			this.hdr_current.textContent = "loading...";
			this._rootElement.classList.toggle( "loading", true );

			window.setTimeout( (function(hzmpg)
			{
				return (function()
				{
					if ( hzpmg.currentWord == null )
						hzpmg.newChallenge();
				});
			})( this ), 3000 );
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

			this.resetHints();
		}
	}

	resetHints()
	{
		var ql = this.hzp.outputQueue.length;

		for ( let i = 0; i < this.hdr_hints.length; i++ )
		{
			this.hdr_hints[i].style.color = "transparent";

			if ( i < ql )
				this.hdr_hints[i].setAttribute("class","past");
			else if ( i == ql )
				this.hdr_hints[i].setAttribute("class","present");
			else
				this.hdr_hints[i].setAttribute("class","future");
		}

		this.hintStart = 0;
		var that = this;
		requestAnimationFrame( function(t) { that.growHint(t); } );
	}

	// Hinting: add a hint character that grows over time
	growHint( _now )
	{
		if ( this.hintStart == 0 )
			this.hintStart = _now;

		var t = 0.00012 * ( _now - this.hintStart );
		var s = t*t - 0.2;
		var sq = this.hzp.outputQueue.length;

		if ( this.hdr_hints.length <= sq )
		{
			var that = this;
			requestAnimationFrame( function(t) { that.growHint(t); } );
			return;
		}

		if ( s > 1 )
		{
			this.hdr_hints[sq].style.color = null;
			this.hdr_hints[sq].style.fontSize = "100%";
		}
		else
		{
			if ( s < 0 )
			{
				this.hdr_hints[sq].style.color = "transparent";
			}
			else
			{
				this.hdr_hints[sq].style.color = null;
				this.hdr_hints[sq].style.fontSize = (100*s) + "%";
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
		if ( typeof(this.currentWord) == "function" )
			this.currentWord = this.currentWord();

		this.hdr_current.textContent = this.currentWord.eng;
		this.hdr_hint.innerHTML = "";

		this.hdr_hints = [];

		for ( var i = 0; i < this.currentWord.glyphs.length; i++ )
		{
			let s = document.createElement("SPAN");
			s.style.color = "transparent";
			s.textContent = this.currentWord.glyphs.substr(i,1);
			this.hdr_hints.push(s);
			this.hdr_hint.appendChild(s);
		}


		// Reset Hanzipad to defaults
		this.hzp.BackgroundImage = null;
		this.hzp.Colours.Background = null;
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

		this.resetHints();
	};
}


