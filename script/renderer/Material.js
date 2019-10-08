define(['../core/defineProperties'], function(defineProperties) {

    /**
     * To initialize a material instance.
     *
     * @param {Material} [material] The material to initialize
     *
     * @private
     */
    function init(material) {
        var error;
        var gl = material._gl;

        var vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, material.vertexSource);
        gl.compileShader(vertShader);
        error = gl.getError();
        if (error != gl.NO_ERROR) {
            console.log("compile vertex shader error. Error code: " + error);
        }

        var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, material.fragmentSource);
        gl.compileShader(fragShader);
        error = gl.getError();
        if (error != gl.NO_ERROR) {
            console.log("compile fragment shader error. Error code: " + error);
        }

        var program = gl.createProgram();
        gl.attachShader(program, vertShader); 
        gl.attachShader(program, fragShader);
        gl.linkProgram(program);
        error = gl.getError();
        if (error != gl.NO_ERROR) {
            console.log("link shader error. Error code: " + error);
        }

        material._shaderProgram = program;
    }

    /**
     * class of material
     *
     * @param {Object} [options] Object with the following properties:
     * @param {WebGL context} [options.gl] gl context of webgl
     * @param {String} [options.vertexShader] string contetnt of vertext shader
     * @param {String} [options.fragShader] string content of fragment shader
     *
     * @exception 
     *
     * @example
     *
     * @private
     */
    function Material(options) {
        this._shaderProgram = null;
        this._gl = options.gl;
        this._vertexSource = options.vertexShader;
        this._fragmentSource = options.fragShader;

        init(this);
    }

    Material.prototype.setMatrix = function (name, matrix) {
        var gl = this._gl;

        var loc = gl.getUniformLocation(this._shaderProgram, name);
        gl.uniformMatrix4fv(loc, false, matrix);
    }

    Material.prototype.setTexture = function(name, texture) {
        var gl = this._gl;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        var uSampler = gl.getUniformLocation(this._shaderProgram, name);
        gl.uniform1i(uSampler, 0);
    }

    defineProperties(Material.prototype, {
        shaderProgram: {
            get: function() {
                return this._shaderProgram;
            }
        },
        vertexSource: {
            get: function() {
                return this._vertexSource;
            }
        },
        fragmentSource: {
            get: function() {
                return this._fragmentSource;
            }
        },

    });

    return Material;
});