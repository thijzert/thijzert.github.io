
var canvas, ctx, hzp;
var width = 400, height = 400;

var strokeDescription, textBox, studioBox, soundInput, engInput, countInput, countLabel, studioOutput, stu;
var unihandBase, unihandInput, unihandStatus;

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

	unihandBase = localStorage.getItem( "unihand-base-URI" );


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
	textBox.style.width = "100%";
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

	studiocontainer.innerHTML = "<h3>Create new</h3>";

	var bcc = document.createElement("DIV");
	studiocontainer.appendChild(bcc);
	studioBox = document.createElement("INPUT");
	studioBox.setAttribute( "type", "text" );
	studioBox.style.width = "100%";
	studioBox.addEventListener( "change", redraw );
	bcc.appendChild( studioBox );


	bcc = document.createElement("DIV");
	bcc.id = "unihan-status";
	studiocontainer.appendChild(bcc);
	var lbl = document.createElement("LABEL");
	lbl.textContent = "Base URL to UNIHANd instance: ";
	unihandInput = document.createElement("INPUT");
	unihandInput.setAttribute( "type", "text" );
	unihandInput.value = unihandBase || "";
	unihandInput.addEventListener( "change", unihandChanged );
	lbl.appendChild(unihandInput);
	bcc.appendChild(lbl);
	unihandStatus = document.createElement("SPAN");
	bcc.appendChild(document.createTextNode(" "));
	bcc.appendChild(unihandStatus);

	if ( unihandBase )
		unihandChanged.apply( unihandInput );


	bcc = document.createElement("DIV");
	bcc.style.clear = "both";
	studiocontainer.appendChild(bcc);

	lbl = document.createElement("LABEL");
	lbl.textContent = " Strokes: ";
	countInput = document.createElement("INPUT");
	countInput.setAttribute( "type", "text" );
	countInput.style.width = "25px";
	countInput.addEventListener( "keydown", handleEnter );
	lbl.appendChild(countInput);
	lbl.appendChild(document.createTextNode(" "));
	countLabel = document.createElement("SPAN");
	lbl.appendChild(countLabel);
	bcc.appendChild(lbl);

	lbl = document.createElement("LABEL");
	lbl.textContent = " Sound: ";
	soundInput = document.createElement("INPUT");
	soundInput.setAttribute( "type", "text" );
	soundInput.addEventListener( "change", redraw );
	soundInput.style.width = "50px";
	soundInput.addEventListener( "keydown", handleEnter );
	lbl.appendChild(soundInput);
	bcc.appendChild(lbl);

	lbl = document.createElement("LABEL");
	lbl.textContent = " English: ";
	engInput = document.createElement("INPUT");
	engInput.setAttribute( "type", "text" );
	engInput.addEventListener( "change", redraw );
	engInput.addEventListener( "keydown", handleEnter );
	lbl.appendChild(engInput);
	bcc.appendChild(lbl);


	bcc = document.createElement("DIV");
	studiocontainer.appendChild(bcc);
	studioOutput = document.createElement("INPUT");
	studioOutput.setAttribute( "type", "text" );
	studioOutput.style.width = "100%";
	studioOutput.style.fontFamily = "\"Fira Code\", FiraCode, Inconsolata, monospace";
	studioOutput.addEventListener( "keydown", handleEnter );
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
	var glyphCode = hzp.glyphCode;

	if ( glyphCode.length == 0 && previewCharacter.length == 0 )
	{
		studioOutput.value = "";
	}
	else
	{
		countLabel.textContent = "(" + glyphCode.length + ")";

		var code = previewCharacter.charCodeAt(0);
		unihandFill( code );

		var pc = "\"\\u" + code.toString(16).toUpperCase() + "\"";
		var str = JSON.stringify( glyphCode.join( " " ) );
		var cdd = "[{sound: " + JSON.stringify(soundInput.value) + ", eng: " + JSON.stringify(engInput.value) + "}]";
		studioOutput.value = "Hanzipad.RegisterCharacter( " + pc + ", " + str + ", " + cdd + " ); // " + previewCharacter;
	}
};


var unihandFill = (function()
{
	var lastSent = 0;

	return (function( codepoint )
	{
		if ( !unihandBase )  return;
		if ( lastSent == codepoint )  return;
		lastSent = codepoint;

		cphex = codepoint.toString(16).toUpperCase();
		fetch(unihandBase + "/char/" + cphex).then(async function(response)
		{
			if ( lastSent != codepoint )  return;
			if ( !response.ok )  return;

			ch = await response.json();
			if ( ch.Unicode != codepoint )
			{
				console.log( codepoint, ch );
				return;
			}

			countInput.value = ( ch.Strokes || "" );
			soundInput.value = ( ch.Pinyin || "" );
			engInput.value = ( ch.English || "" );
			update_studio();
		});
	});
})();

var unihandChanged = function()
{
	var newURI = this.value;
	if ( !newURI )  return;

	fetch(newURI + "/status").then(async function(response)
	{
		unihandStatus.textContent = "";
		unihandStatus.setAttribute( "class", "error" );

		if ( !response.ok )
		{
			unihandStatus.textContent = response.statusText;
			return;
		}

		var bj = {};
		try
		{
			bj = await response.json();
		}
		catch ( r )
		{
			console.log( r );
			unihandStatus.textContent = r.message;
			return;
		}

		if ( !bj.CharactersLoaded )
		{
			unihandStatus.textContent = "Invalid status response";
		}

		unihandBase = newURI;
		unihandStatus.setAttribute( "class", "ok" );
		unihandStatus.textContent = "\u2713";

		localStorage.setItem( "unihand-base-URI", newURI );
	});
};

var redraw = function()
{
	previewCharacter = "";
	if ( studioBox && studioBox.value.length > 0 )
	{
		previewCharacter = studioBox.value.substr(0,1);
	}
	update_studio();


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


var handleEnter = function(e)
{
	if ( e.defaultPrevented )
		return;

	if ( e.key == "Enter" )
	{
		if ( previewCharacter != "" )
		{
			if ( countInput.value != "" )
			{
				if ( countInput.value != hzp.glyphCode.length )
					return false;
			}

			stu.value += studioOutput.value + "\n";

			studioBox.value = studioBox.value.substr(1);
			previewCharacter = studioBox.value.substr(0,1);

			countInput.value = "";
			engInput.value = "";
			soundInput.value = "";
			hzp.reset();
			redraw();

			let l = studioOutput.value.length;
			if ( l > 2 )
			{
				studioOutput.focus();
				studioOutput.setSelectionRange( l-1, l );
			}
		}
		else
		{
			hzp.accept();
		}

		return false;
	}

	return true;
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
			return handleEnter(e);
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


