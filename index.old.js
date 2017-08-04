
//requires sylvester and glUtils;

var gl;

window.addEventListener('load', function() {
    initGl();
    initShaders();
    initBuffers();

    var step = function() {
        drawScene();
        window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
});

function initGl() {
    gl = document.querySelector('canvas').getContext('webgl');

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTCH_BUFFER_BIT);
}

function initShaders() {
    var fragmentShader = getShader('fragmentShader');
    var vertexShader = getShader('vertexShader');

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    }

    gl.useProgram(shaderProgram);

    vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'vPosition');
    gl.enableVertexAttribArray(vertexPositionAttribute);
}

var horizAspect = 480.0 / 640.0;
var vertAspect = 640.0 / 480.0;
function initBuffers() {
    squareVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

    var vertices = [
        1.0,  1.0,  0.0,
        -1.0, 1.0,  0.0,
        1.0,  -1.0, 0.0,
        -1.0, -1.0, 0.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function drawScene() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    perspectiveMatrix = makePerspective(45, vertAspect, 0.1, 100.0);

    loadIdentity();
    mvTranslate([-0.0, 0.0, -6.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function getGlShaderType(type) {
    return {
        'x-shader/x-fragment': gl.FRAGMENT_SHADER,
        'x-shader/x-vertex': gl.VERTEX_SHADER
    }[type];
}
function getShader(id) {
    var shaderScript = document.getElementById(id);

    if(!shaderScript) return null;

    var sourceCode = shaderScript.text;

    var shader = gl.createShader(getGlShaderType(shaderScript.type));

    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.log('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
    }

    return shader;
}

function loadIdentity() {
    mvMatrix = Matrix.I(4);
}

function mvTranslate(v) {
    multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function multMatrix(m) {
    mvMatrix = mvMatrix.x(m);
}

function setMatrixUniforms() {
    var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

    var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}

function log(msg) {
    document.querySelector('pre').appendText(msg + "\n");
}
