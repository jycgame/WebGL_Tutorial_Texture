define(['../core/defineProperties',
    'core/createGuid',
    ], function(
        defineProperties,
        createGuid) {
    'use strict';

    function Context(canvas, options) {
        // members
        this._guid = createGuid();

        // functions
        this.originalCanvas = canvas;
    }

    defineProperties(Context.prototype, {
        id : {
            get : function() {
                return this._guid;
            }
        }
    });

    return Context;
});