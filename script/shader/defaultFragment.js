define(function() {
    'use strict';

return "varying highp vec2 vTextureCoord;\n\
uniform sampler2D uSampler;\n\
\n\
void main(void) {\n\
    gl_FragColor = texture2D(uSampler, vTextureCoord);\n\
}";
});
