// MISSING LICENSES IN THE WEBPACK BUNDLE
/*!  @preserve canvas-particle-network Copyright (c) 2015 Julian Laval | MIT License */

// 
// IMPORT YOUR FILES OF THE JS DIRECTORY
// 

import SweetScroll from 'sweet-scroll';
require('canvas-particle-network');
require('./src/js/main.js');

document.addEventListener("DOMContentLoaded",
  () => {
    
    const scroller = new SweetScroll({
      easing: "easeInCirc",
      stopPropagation: false,
      before: () => { setTimeout( () => {document.getElementById('navbar').setAttribute('data-hide','true')}, 300); },
      complete: () => { setTimeout( () => {document.getElementById('navbar').setAttribute('data-hide','false')}, 100); }
    });
    
    var canvas = new ParticleNetwork(
      document.getElementById('particles-js'), 
      {particleColor: '#5fd3bc'}
    );
    
  },
  false,
);
