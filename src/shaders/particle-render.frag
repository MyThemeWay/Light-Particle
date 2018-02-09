uniform sampler2D t_img;
varying vec3 vColor;
void main(){
  gl_FragColor = vec4(vColor * texture2D(t_img,gl_PointCoord).rgb, 1.);
}
