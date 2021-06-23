// MISSING LICENSES IN THE WEBPACK BUNDLE
/*!  @preserve canvas-particle-network Copyright (c) 2015 Julian Laval | MIT License */

// IMPORT YOUR FILES OF THE IMG DIRECTORY
import './src/img/Project1.jpg';
import './src/img/Project2.jpg';
import './src/img/User_picture.png';
import './src/img/particle.png';
import './src/img/sphere-purp.png';
import './src/img/android-chrome-512x512.png';
import './src/img/android-chrome-256x256.png';
import './src/img/apple-touch-icon.png';
import './src/img/android-chrome-192x192.png';
import './src/img/mstile-150x150.png';
import './src/img/480px-Cyclohexane_simple.svg.png';
import './src/img/favicon.ico';
import './src/img/favicon-48x48.png';
import './src/img/favicon-32x32.png';
import './src/img/favicon-16x16.png';
import './src/img/safari-pinned-tab.svg';
import './src/img/osafari-pinned-tab.svg';
import './src/img/manifest.json';
import './src/img/browserconfig.xml';

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
      before: () => { setTimeout(function (){document.getElementById('navbar').setAttribute('data-hide','true')}, 300); },
      complete: () => { setTimeout(function (){document.getElementById('navbar').setAttribute('data-hide','false')}, 100); }
    });
    
    var canvas = new ParticleNetwork(
      document.getElementById('particles-js'), 
      {particleColor: '#5fd3bc'}
    );
    
  },
  false,
);
