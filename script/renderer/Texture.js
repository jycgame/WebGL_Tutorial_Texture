define(['../core/defineProperties',
    './ImageCache',
    ], function(
        defineProperties,
        ImageCache,
    ) 
{

    function createTexture(image, gl) {
        var tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        return tex;
    }

    function init(texture, callback) {
        const image = new Image();
        image.onload = function(event) {
            ImageCache[texture._path] = image;
            var gl = texture._gl;
            texture._texture = createTexture(image, gl);
            texture._ready = true;
            if (callback != null) {
                callback(texture._texture);
            }
        }
        image.src = texture._path;
    }



    /**
     * class of texture
     *
     * @param {Object} [options] Object with the following properties:
     * @param {WebGL context} [options.gl] gl context of webgl
     *
     * @exception 
     *
     * @example
     *
     * @private
     */
    function Texture(path, options, callback) {
        this._ready = false;
        this._image = null;
        this._path = path;
        this._gl = options.gl;
        this._texture = null;

        if (ImageCache[path] != null) {
            this._image = ImageCache[path];
            this._texture = createTexture(this._image, this._gl);
            this._ready = true;
            if (callback != null) {
                callback();
            }
            return;
        }
        else {
            init(this, callback);
        }
    }

    defineProperties(Texture.prototype, {
        ready: {
            get: function() {
                return this._ready;
            }
        },
    });

    return Texture;
});