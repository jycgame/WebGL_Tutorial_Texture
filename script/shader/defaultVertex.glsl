attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
varying highp vec2 vTextureCoord;
uniform mat4 modelTransform;
uniform mat4 viewTransform;
uniform mat4 projectionTransform;

void main(void) {
    gl_Position = projectionTransform * viewTransform * modelTransform * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;
}