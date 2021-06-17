// MISSING LICENSES IN THE WEBPACK BUNDLE
/*!  @preserve canvas-particle-network Copyright (c) 2015 Julian Laval | MIT License */

// IMPORT YOUR FILES OF THE IMG DIRECTORY
import './src/img/Project1.jpg';
import './src/img/Project2.jpg';
import './src/img/User_picture.png';
import './src/img/texture/particle.png';
import './src/img/texture/sphere-purp.png';
import './src/img/icon/android-chrome-512x512.png';
import './src/img/icon/android-chrome-256x256.png';
import './src/img/icon/apple-touch-icon.png';
import './src/img/icon/android-chrome-192x192.png';
import './src/img/icon/mstile-150x150.png';
import './src/img/icon/480px-Cyclohexane_simple.svg.png';
import './src/img/icon/favicon.ico';
import './src/img/icon/favicon-48x48.png';
import './src/img/icon/favicon-32x32.png';
import './src/img/icon/favicon-16x16.png';
import './src/img/icon/safari-pinned-tab.svg';
import './src/img/icon/osafari-pinned-tab.svg';
import './src/img/icon/manifest.json';
import './src/img/icon/browserconfig.xml';

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
