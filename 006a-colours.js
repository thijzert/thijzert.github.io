
(function()
{
	var canvas = document.getElementById("canvas");
	var options = document.getElementById("options");
	var hzp = new Hanzipad();

	hzp.canvas = canvas;
	hzp.size = 220;
	hzp.border = 30;

	hzp.optionTarget = options;



	var colours = [
		{ glyph: "\u68D5", bg: "#8B4513", chk: "#B08566", br: "#D7B9A5", fg: "#cccccc", eng: "brown" },
		{ glyph: "\u6A59", bg: "#FF8C00", chk: "#ECB36D", br: "#F3D2A9", fg: "#333333", eng: "orange" },
		{ glyph: "\u6D45", bg: "#eeeeee", chk: "#cccccc", br: "#dddddd", fg: "#aaaaaa", eng: "light, shallow" },
		{ glyph: "\u6DF1", bg: "#333333", chk: "#3a3a3a", br: "#444444", fg: "#555555", eng: "dark, deep" },
		{ glyph: "\u7070", bg: "#777777", chk: "#aaaaaa", br: "#bbbbbb", fg: "#444444", eng: "gray" },
		{ glyph: "\u767D", bg: "#ffffff", chk: "#dddddd", br: "#dddddd", fg: "#eeeeee", eng: "white" },
		{ glyph: "\u7C89", bg: "#FF1493", chk: "#F488C2", br: "#F1BDD9", fg: "#612D49", eng: "pink" },
		{ glyph: "\u7D2B", bg: "#9400D3", chk: "#630D88", br: "#A74AD0", fg: "#D1ADE2", eng: "purple" },
		{ glyph: "\u7EA2", bg: "#ED3C3C", chk: "#B41A1A", br: "#902929", fg: "#E87272", eng: "red" },
		{ glyph: "\u7EFF", bg: "#0EC10F", chk: "#136613", br: "#345634", fg: "#6FC36F", eng: "green" },
		{ glyph: "\u84DD", bg: "#1A1AF1", chk: "#121292", br: "#1B1B57", fg: "#B8B8F1", eng: "blue" },
		{ glyph: "\u91D1", bg: "#DAA520", chk: "#A07812", br: "#947629", fg: "#F1DEAF", eng: "gold" },
		{ glyph: "\u9EC4", bg: "#EAE814", chk: "#D0CF26", br: "#B3B320", fg: "#EEEEA2", eng: "yellow" },
		{ glyph: "\u9ED1", bg: "#000000", chk: "#1e1e1e", br: "#282828", fg: "#777777", eng: "black" },
		{ glyph: "\u989C", bg: "#ffffff", chk: "#f5f5f5", br: "#c8c8c8", fg: "#1e1e1e", eng: "face" },
		{ glyph: "\u8272", bg: "#ffffff", chk: "#f5f5f5", br: "#c8c8c8", fg: "#1e1e1e", eng: "colour" }
	];

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

	var hdr_current = document.getElementById("current-challenge");
	var hdr_hint = document.getElementById("current-hint");
	var hdr_previous = document.getElementById("previous-answer");

	// Hinting: add a hint character that grows over time
	var hintStart = 0;
	var growHint = function( _now )
	{
		if ( hintStart == 0 )
			hintStart = _now;

		var t = 0.00012 * ( _now - hintStart );
		var s = t*t - 0.2;

		if ( s > 1 )
		{
			hdr_hint.style.display = "inline";
			hdr_hint.style.fontSize = "100%";
		}
		else
		{
			if ( s < 0 )
			{
				hdr_hint.style.display = "none";
			}
			else
			{
				hdr_hint.style.display = "inline";
				hdr_hint.style.fontSize = (100*s) + "%";
			}

			requestAnimationFrame( growHint );
		}
	};

	var current = 0;
	var newChallenge = function(glyph)
	{
		var col = colours[current];
		if ( glyph )
		{
			hdr_previous.innerHTML = "";

			if ( glyph == col.glyph )
			{
				apc( hdr_previous, spc("correct","\u2714"), col.eng, " - ", col.glyph );
			}
			else
			{
				apc( hdr_previous, spc("wrong","\u2718"), col.eng, " - ", col.glyph, " ",
					spc("youanswered", "(you answered: ", glyph, " )") );
			}
		}

		current = Math.floor( colours.length * Math.random() );
		col = colours[current];
		hdr_current.textContent = col.eng;
		hdr_hint.textContent = col.glyph;

		hzp.Colours.Background = col.bg;
		hzp.Colours.CurrentStroke = col.fg;
		hzp.Colours.PreviousStrokes = col.fg;
		//hzp.Colours.ChessSquares = col.chk;
		hzp.Colours.ChessSquares = col.bg;
		hzp.Colours.Border = col.br;

		hzp.reset();
		hzp.redraw();

		hintStart = 0;
		requestAnimationFrame( growHint );
	};

	newChallenge();

	hzp.addEventListener( "select", function(event)
	{
		newChallenge( event.character.glyph );
	});

})();
