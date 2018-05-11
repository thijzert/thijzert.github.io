
var hzpmg;

(function()
{
	var root = document.getElementById( "doodle-main" );
	hzpmg = new HanzipadMinigame( root );

	hzpmg.words = [
		{ glyphs: "衣服", sound: "yi1 fu5", eng: "clothes", image: "assets/006b/images/clothes.png" },
		{ glyphs: "裤子", sound: "ku4 zi5", eng: "trousers", image: "assets/006b/images/trousers.png" }
	];

	hzpmg.start();

})();

/*


Chinese (pinyin)
yīfu
English
clothes
Character
衣服


Chinese (pinyin)
kùzi
English
trousers
Character
裤子


Chinese (pinyin)
niúzǎi kù
English
jeans
Literal translation
cowboy trouser
Character
牛仔裤


Chinese (pinyin)
chènshān
English
shirt
Character
衬衫


Chinese (pinyin)
t xù
English
T-shirt
Character
T恤


Chinese (pinyin)
qúnzi
English
skirt or dress
Character
裙子


Chinese (pinyin)
duǎnqún
English
skirt
Literal translation
short-dress
Character
短裙


Chinese (pinyin)
liányīqún
English
dress
Character
连衣裙


Chinese (pinyin)
duǎnkù
English
shorts
Literal translation
short-trousers
Character
短裤


Chinese (pinyin)
máoyī
English
(wool) jumper
Literal translation
hair-clothes
Character
毛衣


Chinese (pinyin)
wàitào
English
jacket
Literal translation
outside-cover
Character
外套


Chinese (pinyin)
dàyī
English
coat
Literal translation
big-clothes
Character
大衣


Chinese (pinyin)
nèikù
English
pants
Literal translation
inside-trouser
Character
内裤


Chinese (pinyin)
nèiyī
English
underwear
Literal translation
inside-clothes
Character
内衣


Chinese (pinyin)
xiézi
English
shoes
Character
鞋子


Chinese (pinyin)
tuōxié
English
slippers
Literal translation
drag-shoe
Character
拖鞋


Chinese (pinyin)
yùndòng xié
English
trainers
Literal translation
sports shoe
Character
运动鞋


Chinese (pinyin)
tàotóushān
English
jumper
Literal translation
cover-head-clothes
Character
套头衫


Chinese (pinyin)
wéijīn
English
scarf
Literal translation
surround-cloth
Character
围巾


Chinese (pinyin)
màozi
English
hat
Character
帽子


Chinese (pinyin)
wàzi
English
socks
Character
袜子


Chinese (pinyin)
sīwà
English
stockings
Literal translation
silk-sock
Character
丝袜


Chinese (pinyin)
xuēzi
English
boots
Character
靴子


Chinese (pinyin)
shǒutào
English
gloves
Literal translation
hand-cover
Character
手套


Chinese (pinyin)
xīzhuāng
English
suit
Literal translation
western-clothes
Character
西装


Chinese (pinyin)
lǐngdài
English
tie
Literal translation
neck-belt
Character
领带


Chinese (pinyin)
chuān
English
to wear (clothes or shoes)
Literal translation
cross
Character
穿


Chinese (pinyin)
chuān yīfu
English
to put on clothes
Literal translation
cross clothes
Character
穿衣服


Chinese (pinyin)
jiàn
English
measure word (for clothes)
Character
件


Chinese (pinyin)
yíjiàn chènshān
English
a shirt
Literal translation
one-"jiàn" shirt
Character
一件衬衫


Chinese (pinyin)
tiáo
English
measure word (for trousers and dresses)
Literal translation
string
Character
条


Chinese (pinyin)
yìtiáo qúnzi
English
a dress; a skirt
Literal translation
one-string dress
Character
一条裙子


Chinese (pinyin)
yìtiáo kùzi
English
a pair of trousers
Literal translation
one-string trouser
Character
一条裤子


Chinese (pinyin)
dài
English
to wear (a hat, a tie or glasses)
Character
戴


Chinese (pinyin)
dài màozi
English
to wear a hat
Literal translation
wear hat
Character
戴帽子


Chinese (pinyin)
tā xǐhuān dài màozi
English
he likes to wear a hat
Literal translation
he like wear hat
Character
他喜欢戴帽子


Chinese (pinyin)
yìshuāng wàzi
English
a pair of socks
Literal translation
one-pair sock
Character
一双袜子


Chinese (pinyin)
yìshuáng shǒutào
English
a pair of gloves
Literal translation
one-pair hand-cover
Character
一双手套


Chinese (pinyin)
sānshuāng xiézi
English
three pairs of shoes
Literal translation
three-pair shoe
Character
三双鞋子

*/

/*
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

		var t = 0.00002 * ( _now - hintStart );
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
		hdr_hint.textContent = col.glyphs;

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

*/

