var fbo = function(exports) {
  var scene,
  orthographicCamera,
  rtt;
  exports.init = function(width, height, renderer, simMaterial, renderMaterial){
    gl = renderer.getContext();
    //verify OpenGL supports necessary features for fbo
    if(!gl.getExtension("OES_texture_float")){
      throw new Error("OpenGL error: no support for float textures");
    }
    if(gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)==0){
      throw new Error("OpenGL error: no support for vertex shader texture read");
    }
    //setup rtt, render texture target
    scene = new THREE.Scene();
    orthographicCamera = new THREE.OrthographicCamera(
      -1, 1, 1,
      -1, 1/Math.pow(2, 53),1
    );
    //set options for render target
    var options = {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBFormat, //RGB = 3 floats per particle, RGBA for 4
      type: THREE.FloatType
    };
    rtt = new THREE.WebGLRenderTarget(width,
      height,
      options
    );
    //create simulation geometry
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array([
          -1, -1, 0,
          1, -1, 0,
          1, 1, 0,
          -1, -1, 0,
          1, 1, 0,
          -1, 1, 0]),
        3));
    geometry.addAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array([
          0, 1, 1,
          1, 1, 0,
          0, 1, 1,
          0, 0, 0]),
        2));
    var simParticles = new THREE.Mesh(geometry, simMaterial);
    scene.add(simParticles);
    //create particles
    var size = (height * width);
    var vertices = new Float32Array(size * 3);
    for(var i = 0; i < size; i++){
      var index = i * 3;
      vertices[index] = (i % width) / width;
      vertices[index + 1] = (i/width)/height;
    }
    //now merge to create particle geometry
    var particleGeometry = new THREE.BufferGeometry();
    particleGeometry.addAttribute('position', new THREE.BufferAttribute(
      vertices,
      3
    ));
    exports.particles = new THREE.Points(particleGeometry, renderMaterial);
    exports.renderer = renderer;
  };
  exports.update = function(){
    //update simulation and render into texture
    exports.renderer.render(scene, orthographicCamera, rtt, true);
    //use render target to update particle positions
    exports.particles.material.uniforms.positions.value = rtt.texture;
  };
  exports.updateUniforms = function(n,m){
    exports.particles.material.uniforms.nval.value = n;
    exports.particles.material.uniforms.mval.value = m;
  };
  return exports;
}({});
