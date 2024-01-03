varying vec2 vUv;
varying vec3 vNormal;

uniform sampler2D texture2;

void main() {
  vUv = uv;
  vec4 color = texture2D(texture2, uv);
  float luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
  vec3 pos = position + normal * luminance;
  vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}