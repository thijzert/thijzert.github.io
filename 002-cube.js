
var canvas, gl, shaderProgram, programInfo, buffers;
var width = 800, height = 480;

var squareRotation = 0.0;
var mengerLevel;

var setup = function()
{
	canvas = document.getElementById("canvas");
	canvas.height = height;
	canvas.width = width;

	gl = canvas.getContext("webgl");

	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
	gl.clear( gl.COLOR_BUFFER_BIT );

	shaderProgram = initShaderProgram( gl, vsSource, fsSource );
	programInfo = {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation( shaderProgram, 'aVertexPosition' ),
			vertexColour: gl.getAttribLocation( shaderProgram, 'aVertexColour' ),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation( shaderProgram, 'uProjectionMatrix' ),
			modelViewMatrix: gl.getUniformLocation( shaderProgram, 'uModelViewMatrix' ),
		},
	};
	buffers = initBuffers( gl );
};

var draw = function( deltaTime )
{
	var newMengerLevel = Number.parseInt( document.getElementById("MengerLevel").value, 10 );
	if ( newMengerLevel != mengerLevel )
	{
		mengerLevel = newMengerLevel;
		buffers = initBuffers( gl );
	}

	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
	gl.clearDepth( 1.0 );
	gl.enable( gl.DEPTH_TEST );
	gl.depthFunc( gl.LEQUAL );

	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

	const projectionMatrix = mat4.create();
	const fieldOfView = 45 * Math.PI / 180;
	const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear = 0.1;
	const zFar = 100.0;
	mat4.perspective( projectionMatrix, fieldOfView, aspect, zNear, zFar );

	const modelViewMatrix = mat4.create();
	mat4.translate( modelViewMatrix, modelViewMatrix, [ 0.0, 0.0, -6.0 ] );
	mat4.rotate( modelViewMatrix, modelViewMatrix, squareRotation, [ 0.0, 0.0, 1.0 ] );
	mat4.rotate( modelViewMatrix, modelViewMatrix, squareRotation * 0.7, [ 1.0, 0.0, 0.0 ] );
	mat4.rotate( modelViewMatrix, modelViewMatrix, squareRotation * 0.2, [ 0.0, 1.0, 0.0 ] );

	{
		const numComponents = 3;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;

		gl.bindBuffer( gl.ARRAY_BUFFER, buffers.position );
		gl.vertexAttribPointer( programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset );
		gl.enableVertexAttribArray( programInfo.attribLocations.vertexPosition );
	}
	{
		const numComponents = 4;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;

		gl.bindBuffer( gl.ARRAY_BUFFER, buffers.colour );
		gl.vertexAttribPointer( programInfo.attribLocations.vertexColour, numComponents, type, normalize, stride, offset );
		gl.enableVertexAttribArray( programInfo.attribLocations.vertexColour );
	}

	gl.useProgram( programInfo.program );

	gl.uniformMatrix4fv( programInfo.uniformLocations.projectionMatrix, false, projectionMatrix );

	gl.uniformMatrix4fv( programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix );


	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, buffers.indices );

	{
		const offset = 0;
		const vertexCount = buffers.vertexCount;
		const type = gl.UNSIGNED_SHORT;

		gl.drawElements( gl.TRIANGLES, vertexCount, type, offset );
	}

	squareRotation += deltaTime;
};




// Vertex shader
const vsSource = `
	attribute vec4 aVertexPosition;
	attribute vec4 aVertexColour;

	uniform mat4 uModelViewMatrix;
	uniform mat4 uProjectionMatrix;

	varying lowp vec4 vColour;

	void main() {
		gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
		vColour = aVertexColour;
	}
`;

// Fragment shader
const fsSource = `
	varying lowp vec4 vColour;

	void main() {
		gl_FragColor = vColour;
	}
`;

var initShaderProgram = function( gl, vsSource, fsSource )
{
	const vertexShader = loadShader( gl, gl.VERTEX_SHADER, vsSource );
	const fragmentShader = loadShader( gl, gl.FRAGMENT_SHADER, fsSource );

	const shaderProgram = gl.createProgram();
	gl.attachShader( shaderProgram, vertexShader );
	gl.attachShader( shaderProgram, fragmentShader );
	gl.linkProgram( shaderProgram );

	if ( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) )
	{
		alert( "unable to initialize shader program: " + gl.getProgramInfoLog(shaderProgram) );
		return null;
	}

	return shaderProgram;
};

var loadShader = function( gl, type, source )
{
	const shader = gl.createShader(type);

	gl.shaderSource( shader, source );
	gl.compileShader( shader );

	if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) )
	{
		alert( "compilation error: " + gl.getShaderInfoLog(shader) );
		return null;
	}

	return shader;
};

var decide = function( face, min, max )
{
	var rv = ( face % 2 ? min : max );
	if ( face <= 1 )
		return { a:0, b:1, x:2, v:rv };
	if ( face <= 3 )
		return { a:0, b:2, x:1, v:rv };

	return { a:1, b:2, x:0, v:rv };
};

var cubemesh = function( size, position, indexOffset )
{
	const faceColours = [
		1.0, 0.0, 0.0, 1.0,
		0.0, 1.0, 1.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		1.0, 0.0, 1.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		1.0, 1.0, 0.0, 1.0,
	];

	var min = -1.0 * size, max = size;
	var points = Array(72), indices = Array(36), colours = Array(96);
	var o = 0;
	for ( var face = 0; face < 6; face++ )
	{
		var d = decide(face, min, max);

		var io = indexOffset + face * 4;
		var oo = face * 6;
		indices[oo+0] = io; indices[oo+1] = io + 1; indices[oo+2] = io + 3;
		indices[oo+3] = io; indices[oo+4] = io + 2; indices[oo+5] = io + 3;

		points[o+d.a] = min;  points[o+d.b] = min;  points[o+d.x] = d.v;  o += 3;
		points[o+d.a] = max;  points[o+d.b] = min;  points[o+d.x] = d.v;  o += 3;
		points[o+d.a] = min;  points[o+d.b] = max;  points[o+d.x] = d.v;  o += 3;
		points[o+d.a] = max;  points[o+d.b] = max;  points[o+d.x] = d.v;  o += 3;

		for ( var i = 0; i < 4; i++ )
		{
			for ( var j = 0; j < 4; j++ )
			{
				colours[16*face + 4*i + j] = faceColours[face*4 + j];
			}
		}
	}

	for ( var i = 0; i < 72; i+= 3 )
	{
		for ( var j = 0; j < 3; j++ )
		{
			points[i+j] += position[j];
		}
	}

	return { named: [ "a cube offset to " + indexOffset ], positions: points, indices: indices, colours: colours };
};

var mengermesh = function( level, size, position, indexOffset )
{
	if ( level <= 0 || isNaN(level) )
	{
		return cubemesh( size, position, indexOffset );
	}

	var named = [];
	var points = [];
	var indices = [];
	var colours = [];

	var newSize = size / 3.0;

	for ( var i = -1; i < 2; i++ )
	{
		for ( var j = -1; j < 2; j++ )
		{
			for ( var k = -1; k < 2; k++ )
			{
				if (( i == 0 && j == 0 ) || ( i == 0 && k == 0 ) || ( j == 0 && k == 0 ))
					continue;

				var newpos = [
					position[0] + 2*newSize*i,
					position[1] + 2*newSize*j,
					position[2] + 2*newSize*k,
				]
				newmesh = mengermesh( level - 1, newSize, newpos, indexOffset + (points.length/3) );

				named = named.concat( newmesh.named );
				points = points.concat( newmesh.positions );
				indices = indices.concat( newmesh.indices );
				colours = colours.concat( newmesh.colours );
			}
		}
	}

	return { named: named, positions: points, indices: indices, colours: colours };
};

var initBuffers = function( gl )
{
	var positions = [];
	var indices = [];
	var colours = [];

	var mesh = mengermesh( mengerLevel, 1.0, [0.0, 0.0, 0.0], positions.length / 3 );
	positions = positions.concat( mesh.positions );
	indices = indices.concat( mesh.indices );
	colours = colours.concat( mesh.colours );

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW );

	const indexBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBuffer );
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW );


	const colourBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, colourBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW );



	return {
		position: positionBuffer,
		colour: colourBuffer,
		indices: indexBuffer,
		vertexCount: indices.length,
	};
};



(function()
{
	setup();
	var nextFrame = null;
	var then = 0;

	nextFrame = function( now )
	{
		var deltaT = (now - then) * 0.001;
		draw( deltaT );
		then = now;

		requestAnimationFrame( nextFrame );
	};
	requestAnimationFrame( nextFrame );
})();



