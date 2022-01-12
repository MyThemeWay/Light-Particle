/*! MTW-CANVAS-MALACHITE: MAIN.JS
 * 
 * Author: sitdisch
 * Source: https://sitdisch.github.io/#mythemeway
 * License: CC BY 3.0
 * Copyright: © 2021 sitdisch
 *
 * FRAGMENT SHADER IS BASED ON:
 * 
 * Shadertoy: Glare of water
 * 
 * Original Author: Jan Mróz (jaszunio15)
 * Source: https://www.shadertoy.com/view/ttSGz3
 * License: CC BY 3.0
 * Copyright: © 2019 Jan Mróz
 * Changes: made
 */

import { createProgramInfo, createBufferInfoFromArrays, resizeCanvasToDisplaySize, setBuffersAndAttributes, setUniforms, drawBufferInfo } from '../../../node_modules/twgl.js/dist/4.x/twgl-full.module.js';
import { GLSLX_SOURCE_FRAGMENT_SHADER, GLSLX_SOURCE_VERTEX_SHADER, GLSLX_NAME_I_TIME, GLSLX_NAME_I_RESOLUTION, GLSLX_NAME_POSITION } from './shaders.glslx.min.js';

window.addEventListener("load",
  () => {
    const gl = document.getElementById("header-canvas").getContext("webgl");
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // FIX: adding "\n" is a workaround for twgl.js error:'no element with id:...'
    const vs = "\n"+GLSLX_SOURCE_VERTEX_SHADER;
    const fs = "\n#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n"+GLSLX_SOURCE_FRAGMENT_SHADER;
    const programInfo = createProgramInfo(gl, [vs, fs]);
    gl.useProgram(programInfo.program);
    const arrays = {
      [GLSLX_NAME_POSITION]: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
    };
    const bufferInfo = createBufferInfoFromArrays(gl, arrays);
    setBuffersAndAttributes(gl, programInfo, bufferInfo);
    const uniforms = {
      [GLSLX_NAME_I_RESOLUTION]: [gl.canvas.width, gl.canvas.height, 1],
      [GLSLX_NAME_I_TIME]: 0,
    };
    const randomStart = Math.floor(Math.random() * 100);
    function render() {
      uniforms[GLSLX_NAME_I_TIME] = randomStart + performance.now() / 4500;
      setUniforms(programInfo, uniforms);
      drawBufferInfo(gl, bufferInfo);
    };
    const canvasOvershadow = document.getElementById("header-canvas-overshadow");
    const headerEnd = document.getElementById("header-end").offsetTop;
    var overshadow = true;
    window.setInterval(() => {
      if ( headerEnd > window.pageYOffset ) {
        requestAnimationFrame(render);
        if ( overshadow ) {
          canvasOvershadow.style.display="none";
          overshadow = false;
        }
      } else if ( !(overshadow) ) {
        canvasOvershadow.style.display="inline";
        overshadow = true;
      }
    }, 100);
  },
);
