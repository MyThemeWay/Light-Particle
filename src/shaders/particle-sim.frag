uniform sampler2D t_pos;
uniform sampler2D t_oPos;
uniform vec2 resolution;
uniform float time;
uniform float rM;
uniform float thetaM;
uniform float phiM;
uniform float scale;
uniform float fft[128];
uniform float baseFreq;
uniform float freqM;
uniform float bounds;

highp float rand(vec2 co) {
  highp float a = 12.9898;
  highp float b = 78.233;
  highp float c = 43758.5453;
  highp float dt = dot(co.xy, vec2(a,b));
  highp float sn = mod(dt, 3.14);
  return fract(sin(sn) * c);
}

void main(){
 //lookup current(previous) position
 vec2 uv = gl_FragCoord.xy / resolution;
 vec3 oldPos = texture2D(t_oPos, uv).xyz;
 vec3 pos = texture2D(t_pos, uv).xyz;
 vec3 vel = pos - oldPos;
 //"gravity" force (in Z direction)
 vec3 force = vec3(0., 0., -0.5);
 
 float counter = 1.0;
 float currFreq = baseFreq;

 float r = rM * sqrt(dot(pos,pos));
 float theta = thetaM * acos(pos.z / r);
 float phi = phiM * atan(pos.y, pos.x);

 //calculate force for each FFT frequency
 for(int i = 0; i < 128; i++){
    force.x = force.x + (fft[i]*scale*(cos(phi*currFreq)*sin(theta))*sin(r-currFreq*time));
    force.y = force.y + (fft[i]*scale*(sin(phi*currFreq)*sin(theta))*sin(r-currFreq*time));
    force.z = force.z + (fft[i]*(scale/4.0)*cos(theta)*sin(r-currFreq*time)/r);
    
    //exponential mode
    if(freqM > 0.) {
      currFreq *= freqM;
    } else { //linear mode
      currFreq = baseFreq * counter;
      counter += 1.;
    }   
 }
 //keep z particles from going too far
 force.z = min(15., force.z);
 pos = pos + force + (vel * 0.35);
 //keep particles above plate - but modulate plate height based on Z force
 pos.z = max(pos.z, sin(force.z));

 //respawn if over bounds
 if(abs(pos.x) > bounds) {
   pos.x = 2. * bounds * (rand(vec2(pos.x, pos.y + pos.z))-.5);
   pos.y = 2. * bounds * (rand(vec2(pos.y, pos.x + pos.z))-.5);
   vel = vec3(0.01);
 } else if (abs(pos.y) > bounds) {
   pos.x = 2. * bounds * (rand(vec2(pos.x, pos.y + pos.z))-.5);
   pos.y = 2. * bounds * (rand(vec2(pos.y, pos.x + pos.z))-.5); 
   vel = vec3(0.01);
 }
 gl_FragColor = vec4(pos.xyz, length(vel));
}
