
var canvas, gl, shaderProgram, programInfo, buffers;
var width = 800, height = 480;

var squareRotation = 0.0;

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
		const vertexCount = 36;
		const type = gl.UNSIGNED_SHORT;

		//gl.drawArrays( gl.TRIANGLE_STRIP, offset, vertexCount );
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

var initBuffers = function( gl )
{
	const positions = [
		// Front face
		-1.0, -1.0,  1.0,
		 1.0, -1.0,  1.0,
		 1.0,  1.0,  1.0,
		-1.0,  1.0,  1.0,
		// Back face
		-1.0, -1.0, -1.0,
		-1.0,  1.0, -1.0,
		 1.0,  1.0, -1.0,
		 1.0, -1.0, -1.0,
		// Top face
		-1.0,  1.0, -1.0,
		-1.0,  1.0,  1.0,
		 1.0,  1.0,  1.0,
		 1.0,  1.0, -1.0,
		// Bottom face
		-1.0, -1.0, -1.0,
		 1.0, -1.0, -1.0,
		 1.0, -1.0,  1.0,
		-1.0, -1.0,  1.0,
		// Right face
		 1.0, -1.0, -1.0,
		 1.0,  1.0, -1.0,
		 1.0,  1.0,  1.0,
		 1.0, -1.0,  1.0,
		// Left face
		-1.0, -1.0, -1.0,
		-1.0, -1.0,  1.0,
		-1.0,  1.0,  1.0,
		-1.0,  1.0, -1.0,
	];

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW );

	const faceColours = [
		[ 1.0, 1.0, 1.0, 1.0 ],
		[ 1.0, 0.0, 0.0, 1.0 ],
		[ 0.0, 1.0, 0.0, 1.0 ],
		[ 0.0, 0.0, 1.0, 1.0 ],
		[ 1.0, 1.0, 0.0, 1.0 ],
		[ 1.0, 0.0, 1.0, 1.0 ],
	];

	var colours = [];
	for ( var j = 0; j < faceColours.length; j++ )
	{
		var c = faceColours[j];
		colours = colours.concat( c, c, c, c );
	}

	const colourBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, colourBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(colours), gl.STATIC_DRAW );


	const indices = [
		0,  1,  2,     0,  2,  3,
		4,  5,  6,     4,  6,  7,
		8,  9,  10,    8,  10, 11,
		12, 13, 14,    12, 14, 15,
		16, 17, 18,    16, 18, 19,
		20, 21, 22,    20, 22, 23,
	];

	const indexBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBuffer );
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW );

	return {
		position: positionBuffer,
		colour: colourBuffer,
		indices: indexBuffer,
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



