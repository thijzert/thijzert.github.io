
var canvas, ctx, hzp;
var width = 400, height = 400;

var strokeDescription, textBox, studioBox, soundInput, engInput, studioOutput, stu;

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
	hzp.size = 220;
	hzp.border = 30;


	previewCharacter = "";


	strokeDescription = document.createElement("PRE");
	strokeDescription.style.minHeight = "2em";
	document.getElementById("summary").appendChild(strokeDescription);

	var otrg = document.createElement("UL");
	otrg.id = "optionTarget";
	hzp.optionTarget = otrg;
	document.getElementById("summary").appendChild(otrg);

	var cb = document.createElement("DIV");
	cb.style.clear = "both";
	cb.style.marginBottom = "1em";
	document.getElementById("summary").appendChild(cb);


	var textcontainer = document.createElement("DIV");
	textcontainer.setAttribute( "class", "text-container" );

	textBox = document.createElement("INPUT");
	textBox.setAttribute( "type", "text" );
	textcontainer.appendChild( textBox );
	document.getElementById("summary").appendChild(textcontainer);


	var studiocontainer = document.createElement("DIV");
	studiocontainer.setAttribute( "class", "studio-container" );
	if ( location.hash != "#create" )
	{
		studiocontainer.style.display = "none";
	}
	else
	{
		hzp.Colours.ChessSquares = "#fefefe";
	}

	var bcc = document.createElement("DIV");
	studiocontainer.appendChild(bcc);
	bcc.innerHTML = "Create new: ";
	studioBox = document.createElement("INPUT");
	studioBox.setAttribute( "type", "text" );
	studioBox.addEventListener( "change", redraw );
	bcc.appendChild( studioBox );


	bcc = document.createElement("DIV");
	studiocontainer.appendChild(bcc);
	var lbl = document.createElement("LABEL");
	lbl.textContent = " Sound: ";
	soundInput = document.createElement("INPUT");
	soundInput.setAttribute( "type", "text" );
	soundInput.addEventListener( "change", redraw );
	soundInput.style.width = "45px";
	lbl.appendChild(soundInput);
	bcc.appendChild(lbl);

	lbl = document.createElement("LABEL");
	lbl.textContent = " English: ";
	engInput = document.createElement("INPUT");
	engInput.setAttribute( "type", "text" );
	engInput.addEventListener( "change", redraw );
	lbl.appendChild(engInput);
	bcc.appendChild(lbl);


	bcc = document.createElement("DIV");
	studiocontainer.appendChild(bcc);
	studioOutput = document.createElement("INPUT");
	studioOutput.setAttribute( "type", "text" );
	studioOutput.style.width = "100%";
	studioOutput.style.fontFamily = "\"Fira Code\", FiraCode, Inconsolata, monospace";
	bcc.appendChild( studioOutput );


	stu = document.createElement("TEXTAREA");
	stu.style.fontFamily = "\"Fira Code\", FiraCode, Inconsolata, monospace";
	stu.style.width = "100%";
	stu.style.height = "40em";
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
			update_studio();
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
	});


	hzp.addEventListener( "select", function( event )
	{
		console.log( "Accepted character ", event.character.glyph, " with score ", event.score );
		textBox.value += event.character.glyph;
	});


	redraw();
};


var update_studio = function()
{
	var pc = "\"\\u" + previewCharacter.charCodeAt(0).toString(16).toUpperCase() + "\"";
	var str = JSON.stringify( hzp.glyphCode.join( " " ) );
	var cdd = "[{sound: " + JSON.stringify(soundInput.value) + ", eng: " + JSON.stringify(engInput.value) + "}]";
	studioOutput.value = "Hanzipad.RegisterCharacter( " + pc + ", " + str + ", " + cdd + " ); // " + previewCharacter;
};

var redraw = function()
{
	previewCharacter = "";
	if ( studioBox && studioBox.value.length > 0 )
	{
		previewCharacter = studioBox.value.substr(0,1);
		update_studio();
	}


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

				engInput.value = "";
				soundInput.value = "";
				redraw();
				let l = studioOutput.value.length;
				if ( l > 2 )
				{
					studioOutput.focus();
					studioOutput.setSelectionRange( l-1, l );
				}

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


(function()
{
	setup();
})();


