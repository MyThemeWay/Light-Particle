varying vec2 vUv;
varying float displacement;
varying float noise;
uniform sampler2D t_ramp;
uniform float time;

float rand (vec3 scale, float seed) {
  return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

void main() {
 
  float r = .1 * rand(vec3(12.9898, 78.23, 151.7182), 1.);
  
  vec2 tLookup = vec2(0, 1.3 * (displacement + noise) + r );
  vec4 color = texture2D(t_ramp, tLookup);
  color *= .7;
  gl_FragColor = vec4(color.rgb, 1.);
}
