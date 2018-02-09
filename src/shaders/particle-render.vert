uniform sampler2D t_pos;
varying vec3 vColor;
void main(){
  vec4 pos = texture2D(t_pos, position.xy);
  //velocity is 4th coordinate
  float vel = pos.w;
  //higher velocity = more color
  vColor = vec3(.2 + color.r * vel/8., .35 + color.g * vel/6., .2 + color.b * vel/2.);
  vec3 dif = cameraPosition - pos.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.xyz, 1.0);
  gl_PointSize = min(10., 150. / length(dif));
}
