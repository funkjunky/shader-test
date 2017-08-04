var canvas = document.querySelector('canvas');
var gl = canvas.getContext('webgl');

var program = webglUtils.createProgramFromScripts(gl, ['vertexShader', 'fragmentShader']);
gl.useProgram(program);

var positionLocation = gl.getAttribLocation(program, 'vPosition');

//create rectangle
var buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0]),
    gl.STATIC_DRAW
);
gl.enableVertexAttribArray(positionLocation);   //sets the global for the shader to use! The position of pixel (special).
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// draw
gl.drawArrays(gl.TRIANGLES, 0, 6);
