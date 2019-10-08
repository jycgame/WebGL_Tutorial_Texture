define(function() {
    'use strict';

return "attribute vec3 aVertexPosition;\n\
attribute vec2 aTextureCoord;\n\
varying highp vec2 vTextureCoord;\n\
uniform mat4 modelTransform;\n\
uniform mat4 viewTransform;\n\
uniform mat4 projectionTransform;\n\
\n\
void main(void) {\n\
    gl_Position = projectionTransform * viewTransform * modelTransform * vec4(aVertexPosition, 1.0);\n\
    vTextureCoord = aTextureCoord;\n\
}";
});
