
var canvas, ctx, hzp;
var width = 400, height = 400;

var strokeDescription, textBox, studioBox, studioOutput, stu;

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
	strokeDescription.style.minHeight = "2em";
	document.getElementById("summary").appendChild(strokeDescription);

	strokeCharacter = document.createElement("DIV");
	strokeCharacter.style.fontSize = "30px";
	strokeCharacter.style.fontFamily = "serif";
	strokeCharacter.style.textAlign = "center";
	//document.getElementById("summary").appendChild(strokeCharacter);

	var otrg = document.createElement("UL");
	otrg.id = "optionTarget";
	hzp.optionTarget = otrg;
	document.getElementById("summary").appendChild(otrg);

	var cb = document.createElement("DIV");
	cb.style.clear = "both";
	document.getElementById("summary").appendChild(cb);


	var textcontainer = document.createElement("DIV");
	textcontainer.setAttribute( "class", "text-container" );

	textBox = document.createElement("INPUT");
	textBox.setAttribute( "type", "text" );
	textcontainer.appendChild( textBox );
	document.getElementById("summary").appendChild(textcontainer);

	//strokeCharacter.addEventListener( "click", acceptChar );
	//strokeDescription.addEventListener( "click", strikeThat );


	var studiocontainer = document.createElement("DIV");
	studiocontainer.setAttribute( "class", "studio-container" );
	if ( location.hash != "#create" )
		studiocontainer.style.display = "none";

	var bcc = document.createElement("DIV");
	studiocontainer.appendChild(bcc);
	bcc.innerHTML = "Create new: ";
	studioBox = document.createElement("INPUT");
	studioBox.setAttribute( "type", "text" );
	studioBox.addEventListener( "change", redraw );
	bcc.appendChild( studioBox );

	bcc = document.createElement("DIV");
	studiocontainer.appendChild(bcc);
	studioOutput = document.createElement("INPUT");
	studioOutput.setAttribute( "type", "text" );
	studioOutput.style.width = "100%";
	studioOutput.style.fontFamily = "Inconsolata, monospace";
	bcc.appendChild( studioOutput );

	stu = document.createElement("TEXTAREA");
	stu.style.fontFamily = "Inconsolata, monospace";
	stu.style.width = "100%";
	stu.style.height = "30em";
	studiocontainer.appendChild(stu);

	bcc.appendChild( studioOutput );

	document.getElementById("summary").appendChild(studiocontainer);


	hzp.addEventListener( "change", function()
	{
		var glc = this.glyphCode;
		strokeDescription.textContent = glc.join(" ");

		if ( previewCharacter != "" )
		{
			this.BackgroundGlyph = previewCharacter;

			var pc = "\"\\u" + previewCharacter.charCodeAt(0).toString(16).toUpperCase() + "\"";
			var str = JSON.stringify( glc.join( " " ) );
			var cdd = "[{sound: \"xx\", eng: \"xx\"}]";
			studioOutput.value = "Hanzipad.RegisterCharacter( " + pc + ", " + str + ", " + cdd + " ); // " + previewCharacter;
		}
		else
		{
			this.BackgroundGlyph = foundCharacter;
		}
	});


	hzp.addEventListener( "options", function( event )
	{
		foundCharacter = "";
		foundScore = Infinity;
		if ( event.characterOptions.length == 0 )
			return;

		foundCharacter = event.characterOptions[0].character.glyph;
		foundScore = event.characterOptions[0].score;

		strokeCharacter.textContent = foundCharacter;
	});


	hzp.addEventListener( "select", function( event )
	{
		console.log( "Accepted character ", event.character.glyph, " with score ", event.score );
		textBox.value += event.character.glyph;
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


window.addEventListener( "keydown", function(e)
{
	if ( e.target != document.body )
		return;

	if ( e.defaultPrevented )
		return;

	switch ( e.key )
	{
		case "Escape":
			strikeThat();
			break;
		case "Enter":
			if ( previewCharacter != "" )
			{
				stu.value += studioOutput.value + "\n";

				studioBox.value = studioBox.value.substr(1);
				previewCharacter = studioBox.value.substr(0,1);

				hzp.reset();
			}
			else
			{
				hzp.accept();
			}
			break;
		case "ArrowLeft":
		case "ArrowUp":
			hzp.activeIndex--;
			e.preventDefault();
			break;
		case "ArrowRight":
		case "ArrowDown":
			hzp.activeIndex++;
			e.preventDefault();
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


(function()
{
	setup();
})();


