
var canvas, ctx, hzp;
var width = 400, height = 400;

var strokeDescription, textBox, studioBox, studioOutput;

var penpos, lastpos, pendown;
var strokes, currentStroke;
var previewCharacter = "", foundCharacter = "", foundScore;

var setup = function()
{
	canvas = document.getElementById("canvas");
	canvas.height = height;
	canvas.width = width;


	hzp = new Hanzipad();
	hzp.canvas = canvas;
	hzp.size = width / 2;
	hzp.border = width / 4;


	previewCharacter = "";


	strokeDescription = document.createElement("PRE");
	document.getElementById("summary").appendChild(strokeDescription);
	strokeCharacter = document.createElement("DIV");
	strokeCharacter.style.fontSize = "30px";
	strokeCharacter.style.fontFamily = "serif";
	strokeCharacter.style.textAlign = "center";
	document.getElementById("summary").appendChild(strokeCharacter);

	var textcontainer = document.createElement("DIV");
	textcontainer.setAttribute( "class", "text-container" );

	textBox = document.createElement("INPUT");
	textBox.setAttribute( "type", "text" );
	textcontainer.appendChild( textBox );
	document.getElementById("summary").appendChild(textcontainer);

	strokeCharacter.addEventListener( "click", acceptChar );
	strokeDescription.addEventListener( "click", strikeThat );


	var studiocontainer = document.createElement("DIV");
	studiocontainer.setAttribute( "class", "studio-container" );
	if ( location.hash != "#create" )
		studiocontainer.style.display = "none";

	var bcc = document.createElement("DIV");
	studiocontainer.appendChild(bcc);
	bcc.innerHTML = "Create new: ";
	studioBox = document.createElement("INPUT");
	studioBox.setAttribute( "type", "text" );
	studioBox.style.width = "2em";
	studioBox.addEventListener( "change", redraw );
	bcc.appendChild( studioBox );

	bcc = document.createElement("DIV");
	studiocontainer.appendChild(bcc);
	studioOutput = document.createElement("INPUT");
	studioOutput.setAttribute( "type", "text" );
	studioOutput.style.width = "100%";
	studioOutput.style.fontFamily = "Inconsolata, monospace";
	bcc.appendChild( studioOutput );

	document.getElementById("summary").appendChild(studiocontainer);


	hzp.addEventListener( "change", function()
	{
		var glc = this.glyphCode;
		strokeDescription.textContent = this.glyphCode.join("\n");

		var character = null;
		if ( glc.length > 0 )
			character = LookupCharacter( glc );

		if ( character )
			foundCharacter = character.glyph;
		else
			foundCharacter = "";

		strokeCharacter.textContent = foundCharacter;


		if ( previewCharacter != "" )
		{
			this.BackgroundGlyph = previewCharacter;

			var pc = "\"\\u" + previewCharacter.charCodeAt(0).toString(16).toUpperCase() + "\"";
			var str = JSON.stringify( glc.join( " " ) );
			var cdd = "[{sound: \"xx\", eng: \"xx\"}]";
			studioOutput.value = "RegisterCharacter( " + pc + ", " + str + ", " + cdd + " );";
		}
		else
		{
			this.BackgroundGlyph = foundCharacter;
		}
	});


	redraw();
};


var redraw = function()
{
	previewCharacter = "";
	if ( studioBox && studioBox.value.length > 0 )
		previewCharacter = studioBox.value.substr(0,1);

	if ( previewCharacter != "" )
		hzp.BackgroundGlyph = previewCharacter;
	else
		hzp.BackgroundGlyph = foundCharacter;

	hzp.redraw();
};


var strikeThat = function()
{
	hzp.popStroke();
};

var acceptChar = function()
{
	if ( foundCharacter != "" )
	{
		console.log( "Accepted character ", foundCharacter, " with score ", foundScore );
		textBox.value += foundCharacter;
		foundCharacter = "";

		hzp.reset();
	}
};

window.addEventListener( "keydown", function(e)
{
	if ( e.defaultPrevented )
		return;

	switch ( e.key )
	{
		case "Escape":
			strikeThat();
			break;
		case "Enter":
			acceptChar();
			break;
	};
});


document.getElementById("sizeSlider").addEventListener("change", function(e)
{
	var s = parseFloat( this.value )
	if ( s >= 5 && s <= 300 )
		hzp.size = s;
});
document.getElementById("borderSlider").addEventListener("change", function(e)
{
	var s = parseFloat( this.value )
	if ( s >= 0 && s <= 100 )
		hzp.border = s;
});


var characterDatabase = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
var RegisterCharacter = function( glyph, stroke, descriptions )
{
	stroke = stroke.trim().split(/ +/);
	characterDatabase[stroke.length].push({
		glyph: glyph,
		stroke: stroke,
		descriptions: descriptions
	});
};

var LookupCharacter = (function()
{
	// Difference in starting square
	var sqdif = function( a, b )
	{
		var dx = a.charCodeAt(0) - b.charCodeAt(0);
		var dy = a.charCodeAt(1) - b.charCodeAt(1);

		if ( dx == 0 )  return dy;
		if ( dy == 0 )  return dx;

		return Math.sqrt( dx*dx + dy*dy );
	};

	// Difference in direction
	var dirdif = function( a, b )
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

		var s1a = dirdif( a.substr(1), b.substr(1) );
		var s1b = s1a;
		if ( a.length > b.length )
			s1b = dirdif( a.substr(1), b );
		else if ( b.length < a.length )
			s1b = dirdif( a, b.substr(1) );

		if ( s1b < s1a )
			return s0 + s1b;
		return s0 + s1a;
	};


	var sqrt = new Array(20);
	for ( var i = 0; i < 20; i++ )
		sqrt[i] = Math.sqrt(i);

	var sdif = function( a, b )
	{
		var d0 = sqdif( a, b );
		var d1 = dirdif( a.substr(2), b.substr(2) );
		d1 /= sqrt[a.length];

		return d0*0.2 + d1*0.9;
	};

	return (function( stroke )
	{
		//stroke = stroke.trim().split(/ +/);
		var jstr = stroke.join("");

		if ( ! stroke.length in characterDatabase )
			return null;

		var wiener = null;
		var dmax = 1000.0;

		for ( var i = 0; i < characterDatabase[stroke.length].length; i++ )
		{
			var d = 0.0;
			for ( var j = 0; j < stroke.length; j++ )
			{
				d += sdif( characterDatabase[stroke.length][i].stroke[j], stroke[j] );

				if ( d > dmax )  break;
			}

			if ( d < dmax )
			{
				wiener = characterDatabase[stroke.length][i];
				dmax = d;
			}
		}

		foundScore = dmax;

		return wiener;
	});
})();


(function()
{
	setup();
})();


