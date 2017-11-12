
var canvas, gl, shaderProgram, programInfo, buffers;
var width = 800, height = 480;

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
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation( shaderProgram, 'uProjectionMatrix' ),
			modelViewMatrix: gl.getUniformLocation( shaderProgram, 'uModelViewMatrix' ),
		},
	};
	buffers = initBuffers( gl );
};

var draw = function()
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

	{
		const numComponents = 2;
		const type = gl.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;

		gl.bindBuffer( gl.ARRAY_BUFFER, buffers.position );
		gl.vertexAttribPointer( programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset );
		gl.enableVertexAttribArray( programInfo.attribLocations.vertexPosition );
	}

	gl.useProgram( programInfo.program );

	gl.uniformMatrix4fv( programInfo.uniformLocations.projectionMatrix, false, projectionMatrix );

	gl.uniformMatrix4fv( programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix );

	{
		const offset = 0;
		const vertexCount = 4;
		gl.drawArrays( gl.TRIANGLE_STRIP, offset, vertexCount );
	}
};




// Vertex shader
const vsSource = `
	attribute vec4 aVertexPosition;

	uniform mat4 uModelViewMatrix;
	uniform mat4 uProjectionMatrix;

	void main() {
		gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
	}
`;

// Fragment shader
const fsSource = `
	void main() {
		gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );
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
	const positionBuffer = gl.createBuffer();

	gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );

	const positions = [
		1.0, 1.0,
		-1.0, 1.0,
		1.0, -1.0,
		-1.0, -1.0,
	];

	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW );

	return {
		position: positionBuffer,
	};
};



(function()
{
	setup();
	var nextFrame = null;

	nextFrame = function()
	{
		draw();
		window.setTimeout( nextFrame, 1000/100 );
	};
	nextFrame();
})();



