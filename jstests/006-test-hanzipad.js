
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
});

