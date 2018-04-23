
var fs = require("fs");
var assert = require("chai").assert;

var ffsrequire = function()
{
	var filename = arguments[0];
	var module = "module.exports = ";

	for ( var i = 0; i < arguments.length; i++ )
	{
		module += fs.readFileSync( arguments[i], "utf8" );
	}

	fs.writeFileSync( "ffs-" + filename, module );
	var rv = require( "../ffs-" + filename );
	fs.unlinkSync( "ffs-" + filename );

	return rv;
};

var Hanzipad = ffsrequire( "006-hanzipad.js" );
eval( fs.readFileSync( "006-database.js" ) );

describe( "Hanzipad", function()
{
	it("should exist", function()
	{
		var sq = new Hanzipad();
		assert.exists(sq);
	});

	describe( "#fromAbs()", function()
	{
		var sq = new Hanzipad();

		sq.size = 300;
		sq.border = 100;

		it("should be the inverse of toAbs", function()
		{
			for ( var i = 0; i < 100; i++ )
			{
				var v1 = [
					(2*sq.border + sq.size)*Math.random(),
					(2*sq.border + sq.size)*Math.random()
				];
				var v2 = sq.toAbs(v1);
				var v3 = sq.fromAbs(v2);

				assert.closeTo( v3[0], v1[0], 0.1 );
				assert.closeTo( v3[1], v1[1], 0.1 );
			}
		});

		describe( "coordinates within the board", function()
		{
			it("should be within the unit square",function()
			{
				for ( var i = 0; i < 100; i++ )
				{
					var x = sq.border + sq.size*Math.random()
					var y = sq.border + sq.size*Math.random()

					var c = sq.fromAbs([x,y]);

					assert( c[0] >= 0 && c[0] <= 1 );
					assert( c[1] >= 0 && c[1] <= 1 );
				}
			});
		});
		describe( "coordinates outside the board", function()
		{
			it("should not be within the unit square",function()
			{
				for ( var i = 0; i < 100; i++ )
				{
					var x = (2*sq.border + sq.size)*Math.random()
					var y = (2*sq.border + sq.size)*Math.random()

					if ( (x > sq.border && (x-sq.border) <= sq.size)
						|| (y > sq.border && (y-sq.border) <= sq.size ) )
						continue;

					var c = sq.fromAbs([x,y]);
					assert( c[0] < 0 || c[0] > 1  ||  c[1] < 0 || c[1] > 1 );
				}
			});
		});
	});

	describe( "#toAbs()", function()
	{
		var sq = new Hanzipad();

		sq.size = 300;
		sq.border = 100;

		it("should be the inverse of fromAbs", function()
		{
			for ( var i = 0; i < 100; i++ )
			{
				var v1 = [
					5*Math.random() - 2,
					5*Math.random() - 2
				];
				var v2 = sq.toAbs(v1);
				var v3 = sq.fromAbs(v2);

				assert.closeTo( v3[0], v1[0], 0.001 );
				assert.closeTo( v3[1], v1[1], 0.001 );
			}
		});

		describe( "coordinates within the unit square", function()
		{
			it("should be within the board's coordinates",function()
			{
				for ( var i = 0; i < 100; i++ )
				{
					var x = Math.random()
					var y = Math.random()

					var c = sq.toAbs([x,y]);
					assert( c[0] >= sq.border && (c[0]-sq.border) <= sq.size
						&& c[1] >= sq.border && (c[1]-sq.border) <= sq.size )
				}
			});
		});
		describe( "coordinates outside the unit square", function()
		{
			it("should not be within the board",function()
			{
				for ( var i = 0; i < 100; i++ )
				{
					var x = 5*Math.random() - 2;
					var y = 5*Math.random() - 2;

					if ( ( x >= 0 && x <= 1 ) || ( y >= 0 && y <= 1 ) )
						continue;

					var c = sq.fromAbs([x,y]);
					assert( c[0] < 0 || c[0] > 1  ||  c[1] < 0 || c[1] > 1 );
				}
			});
		});
	});

	describe( "#chessSquare", function()
	{
		var sq = new Hanzipad();

		it("should return a valid square for points on the board", function()
		{
			for ( var i = 0; i < 10; i++ )
			{
				var x = Math.random();
				var y = Math.random();

				var s = sq.chessSquare(x, y);
				assert.exists(s);

				var s1 = s.substr(0,1);
				assert.oneOf( s1, ["A","B","C","D","E","F","G","H"] );

				var s2 = parseInt(s.substr(1),10);
				assert.isNumber(s2);
				assert.oneOf( s2, [1,2,3,4,5,6,7,8] );
			}
		});
		it("should not return suares for points not on the board",function()
		{
			for ( var i = 0; i < 100; i++ )
			{
				var x = 5*Math.random() - 2;
				var y = 5*Math.random() - 2;

				if ( ( x >= 0 && x <= 1 ) || ( y >= 0 && y <= 1 ) )
					continue;

				assert.notExists( sq.chessSquare( x, y ) );
			}
		});
	});


	describe( "#clockDirection", function()
	{
		describe( "cardinal directions should work", function()
		{
			var sq = new Hanzipad();

			// Unit circle in positive orientation will start at the right (3 o'clock) and move counterclockwise.
			var directions = ["c","b","a","l","k","j","i","h","g","f","e","d"]

			it("in the ideal case", function()
			{
				for ( var i = 0; i < 12; i++ )
				{
					var t = i * Math.PI/6;
					var x = Math.cos(t);
					var y = Math.sin(t);

					assert.equal( sq.clockDirection([0,0], [x,y]), directions[i] );
				}
			});

			it("even when it's a bit fuzzy", function()
			{
				for ( var i = 0; i < 144; i++ )
				{
					var t = i * Math.PI/6 + (Math.random()-0.5)*Math.PI/6;
					var x = Math.cos(t);
					var y = Math.sin(t);

					assert.equal( sq.clockDirection([0,0], [x,y]), directions[i % 12] );
				}
			});
		});
	});


	describe("#getStrokeCode()", function()
	{
		// Might want to turn off text wrapping
		var hao3abs = [
			{ "code": "B8gd", "paint": [[136.7,123.3],[138.1,124.6],[138.1,128.7],[138.1,136.0],[138.1,145.4],[136.0,156.2],[126.0,185.0],[119.3,200.4],[111.9,213.8],[107.2,224.5],[101.9,233.9],[97.8,242.0],[95.8,246.0],[96.5,246.7],[99.8,247.3],[110.6,249.3],[113.2,250.0],[123.3,253.4],[128.0,256.0],[134.0,259.4],[138.1,262.1],[140.1,263.4],[142.1,264.8],[146.8,268.1],[148.1,269.5],[148.8,270.1]] },
			{ "code": "C4g", "paint": [[171.6,204.4],[171.6,206.4],[169.6,212.5],[166.9,218.5],[163.5,225.9],[157.5,234.6],[150.8,244.0],[138.7,258.7],[132.0,266.8],[127.3,274.8],[123.3,279.5],[120.0,282.9],[117.3,285.5],[115.3,287.6]] },
			{ "code": "A5c", "paint": [[101.9,194.4],[103.2,194.4],[107.2,194.4],[119.3,194.4],[130.7,194.4],[143.4,194.4],[154.8,194.4],[163.5,194.4],[166.2,194.4]] },
			{ "code": "D8ch", "paint": [[191.7,123.3],[192.4,123.3],[195.7,123.3],[205.1,123.3],[218.5,125.3],[229.9,126.7],[242.0,129.3],[250.7,130.0],[257.4,130.0],[260.1,130.0],[264.8,130.0],[266.1,130.0],[266.8,130.0],[268.1,130.0],[269.5,130.0],[270.8,130.7],[271.5,130.7],[272.1,131.3],[270.1,134.0],[267.4,136.7],[263.4,140.1],[256.7,146.8],[254.7,149.4],[252.7,151.5],[250.0,154.8],[249.3,155.5],[248.0,156.8],[247.3,157.5],[246.0,158.8],[244.6,159.5],[241.3,160.8],[238.6,162.9],[237.3,163.5],[235.3,164.9],[233.9,166.2]] },
			{ "code": "F6fi", "paint": [[234.6,168.9],[234.6,174.3],[234.6,180.3],[234.6,193.7],[234.6,200.4],[234.6,209.8],[233.3,229.2],[231.9,239.3],[231.2,248.0],[231.2,254.7],[231.9,269.5],[232.6,274.1],[233.9,276.2],[234.6,278.8],[235.3,280.8],[235.3,282.2],[235.3,282.9],[235.3,284.2],[235.3,284.9],[234.6,285.5],[231.2,285.5],[227.9,285.5],[221.2,285.5],[217.8,285.5],[213.8,284.9],[210.5,284.2],[209.1,284.2],[208.4,284.2]] },
			{ "code": "D5c", "paint": [[192.4,193.0],[193.0,193.0],[198.4,193.0],[207.1,193.0],[231.9,193.0],[242.6,193.0],[256.7,193.0],[268.1,193.0],[272.1,193.0],[276.2,193.0],[284.2,193.0],[286.2,193.7]] }
		];

		var ni3abs = [
			{"code":"C8g","paint":[[158.2,114.6],[157.5,118.6],[154.8,123.3],[152.8,128.7],[150.1,136.0],[145.4,144.1],[134.0,158.8],[123.3,172.9],[118.6,177.6],[115.3,179.6],[111.2,182.3],[109.2,183.0],[108.6,183.6]]},
			{"code":"B6f","paint":[[142.1,155.5],[141.4,155.5],[140.7,158.2],[140.1,164.9],[139.4,171.6],[137.4,181.6],[136.0,193.7],[132.7,215.8],[131.3,227.2],[130.7,238.6],[129.3,254.7],[129.3,267.4],[129.3,270.8],[128.7,274.8],[128.7,276.8],[128.0,278.2]]},
			{"code":"D8g","paint":[[185.0,109.2],[183.6,114.6],[182.3,121.3],[178.3,131.3],[175.6,140.7],[170.9,156.2],[169.6,162.2],[166.9,169.6],[166.9,170.9],[166.2,171.6]]},
			{"code":"D7cg","paint":[[176.3,136.0],[178.3,136.0],[183.0,136.0],[187.7,136.0],[194.4,136.0],[204.4,136.0],[218.5,136.0],[249.3,139.4],[270.1,139.4],[280.2,139.4],[288.2,139.4],[292.2,139.4],[293.6,139.4],[294.9,139.4],[296.9,139.4],[298.9,139.4],[300.3,139.4],[301.0,140.1],[301.0,142.1],[300.3,144.1],[299.6,146.1],[298.3,150.8],[296.3,155.5],[294.9,158.8],[292.9,162.9],[290.9,165.5],[289.6,168.2],[288.2,170.2],[286.9,172.2],[286.9,172.9],[286.2,173.6]]},
			{"code":"F6fi","paint":[[235.3,158.2],[236.6,158.8],[237.3,165.5],[237.3,181.0],[237.3,222.5],[237.3,240.6],[237.3,255.4],[237.3,262.1],[239.3,276.8],[239.3,285.5],[239.3,288.2],[239.3,294.9],[239.3,296.3],[238.6,296.9],[238.6,297.6],[237.9,298.3],[237.3,298.3],[235.9,298.3],[233.3,298.3],[229.9,297.6],[225.2,296.9],[221.2,296.3],[220.5,296.3],[217.2,295.6],[215.8,294.9],[214.5,294.9],[213.8,294.9]]},
			{"code":"D5g","paint":[[190.3,189.7],[191.0,192.4],[191.0,195.7],[191.0,199.7],[191.0,203.1],[188.3,207.8],[182.3,217.2],[178.9,221.9],[174.9,225.9],[172.9,227.9],[170.2,231.9],[169.6,232.6],[168.9,233.3],[168.9,233.9]]},
			{"code":"G5e","paint":[[257.4,193.0],[257.4,193.0],[260.7,199.1],[262.7,205.8],[266.8,218.5],[270.1,227.9],[273.5,235.9],[275.5,241.3],[278.2,244.0],[278.8,246.7]]}
		];

		var absverify = function( testcases )
		{
			return (function()
			{
				var sq = new Hanzipad();
				sq.size = 200;
				sq.border = 100;

				for ( var i = 0; i < testcases.length; i++ )
				{
					var tc = testcases[i];

					// These paint strokes still have absolute coordinates
					for ( var j = 0; j < tc.paint.length; j++ )
						tc.paint[j] = sq.fromAbs(tc.paint[j]);

					assert.equal( sq.getStrokeCode( tc.paint ), tc.code );
				}
			});
		};

		it("should classify the strokes in '你'", absverify(ni3abs) );
		it("should classify the strokes in '好'", absverify(hao3abs) );
	});


	describe( "#RegisterCharacter", function()
	{
		describe("smiley", function()
		{
			Hanzipad.RegisterCharacter( "\xf0\x9f\x98\x8a", "C6 F6 A4dcb", [] );

			it("should find a smiley on an exact match", function()
			{
				var sg = Hanzipad.LookupCharacter(["C6", "F6", "A4dcb"]);

				assert.isNotEmpty( sg );
				assert.exists( sg[0].character.glyph );
				assert.equal( sg[0].character.glyph, "\xf0\x9f\x98\x8a" );
			});

			it("should find a smiley on an inexact match", function()
			{
				var sg = Hanzipad.LookupCharacter(["C6", "F7", "A4dcb"]);

				assert.isNotEmpty( sg );
				assert.exists( sg[0].character.glyph );
				assert.equal( sg[0].character.glyph, "\xf0\x9f\x98\x8a" );
			});
		});
	});
});

