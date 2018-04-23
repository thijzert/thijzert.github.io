
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
			studioOutput.value = "Hanzipad.RegisterCharacter( " + pc + ", " + str + ", " + cdd + " );";
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

var LookupCharacter = function( stroke )
{
	var res = Hanzipad.LookupCharacter( stroke );
	if ( res.length > 0 )
		return res[0].character;

	return null;
};


(function()
{
	setup();
})();


