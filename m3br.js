function M3br (canvas) {
  this.gl = canvas.getContext('webgl');
}

M3br.prototype.createShader = function (source, type) {
  var gl = this.gl;
  var shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    var error = new Error(gl.getShaderInfoLog(shader));

    gl.deleteShader(shader);

    throw error;
  }

  return shader;
}

M3br.prototype.createVertexShader = function (source) {
  return this.createShader(source, this.gl.VERTEX_SHADER);
}

M3br.prototype.createFragmentShader = function (source) {
  return this.createShader(source, this.gl.FRAGMENT_SHADER);
}

M3br.prototype.createProgram = function () {
  var program = this.gl.createProgram();

  for (var index = 0 ; index < arguments.length ; ++index) {
    this.gl.attachShader(program, arguments[index]);
  }

  this.gl.linkProgram(program);

  if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
    throw new Error(this.gl.getProgramInfoLog(program));
  }

  return program;
}

M3br.prototype.createStaticArrayBuffer = function (array) {
  var buffer = this.gl.createBuffer();

  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
  this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(array), this.gl.STATIC_DRAW);

  return buffer;
}

M3br.prototype.setup = function (options) {
  if (options.clearColor instanceof Array) {
    this.gl.clearColor(
      options.clearColor[0] || 0.0,
      options.clearColor[1] || 0.0,
      options.clearColor[2] || 0.0,
      options.clearColor[3] || 0.0
    );
  }

  if (options.clearDepth !== undefined) {
    this.gl.clearDepth(options.clearDepth);
  }

  if (options.enable) {
    this.gl.enable(
      options.enable.blend ? this.gl.BLEND : 0 |
      options.enable.cullFace ? this.gl.CULL_FACE : 0 |
      options.enable.depthTest ? this.gl.DEPTH_TEST : 0 |
      options.enable.dither ? this.gl.DITHER : 0 |
      options.enable.polygonOffset ? this.gl.POLYGON_OFFSET_FILL : 0 |
      options.enable.sampleAlphaToCoverege ? this.gl.SAMPLE_ALPHA_TO_COVEREGE : 0 |
      options.enable.sampleCoverege ? this.gl.SAMPLE_COVEREGE : 0 |
      options.enable.scissor ? this.gl.SCISSOR_TEST : 0 |
      options.enable.stencil ? this.gl.STENCIL_TEST : 0
    );

    options.enable.blend && this.gl.blendFunc.apply(this.gl, options.enable.blend);
    options.enable.cullFace && this.gl.cullFace(options.enable.cullFace);
    options.enable.depthTest && this.gl.depthFunc(options.enable.depthTest);
    options.enable.polygonOffset && this.gl.polygonOffset.apply(this.gl, options.enable.polygonOffset);
    options.enable.sampleCoverege && this.gl.sampleCoverege.apply(this.gl, options.enable.sampleCoverege);
    options.enable.scissor && this.gl.scissor.apply(this.gl, options.enable.scissor);
    options.enable.stencil && this.gl.stencilFunc.apply(this.gl, options.enable.stencil);
  }

  this.clearBit = options.clear && (
    options.clear.color ? this.gl.COLOR_BUFFER_BIT : 0 |
    options.clear.depth ? this.gl.DEPTH_BUFFER_BIT : 0 |
    options.clear.stencil ? this.gl.STENCIL_BUFFER_BIT : 0
  );

  return this;
}

M3br.prototype.clear = function (bit) {
  this.gl.clear(bit || this.clearBit);
}

M3br.prototype.matrix = {
  translate: function (x, y, z) {
    return [
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 0
    ];
  },
  scale: function (x, y, z) {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1
    ];
  },
  rotateZ: function (rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);

    return [
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1
    ];
  },
  rotateY: function (rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);

    return [
      c, 0, -s, 0,
      0, 1,  0, 0,
      s, 0,  c, 0,
      0, 0,  0, 1
    ];
  },
  rotateX: function (rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);

    return [
      1,  0, 0, 0,
      0,  c, s, 0,
      0, -s, c, 0,
      0,  0, 0, 1
    ];
  }
}
