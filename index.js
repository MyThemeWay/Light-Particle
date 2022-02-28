// 
// IMPORT YOUR FILES OF THE JS DIRECTORY
// 

import SweetScroll from 'sweet-scroll';
require('./src/js/main.js');

document.addEventListener("DOMContentLoaded",
  () => {
    
    const scroller = new SweetScroll({
      easing: "easeInCirc",
      stopPropagation: false,
      before: () => setTimeout(() => document.getElementById('navbar').setAttribute('data-hide','true'), 300),
      complete: () => setTimeout(() => document.getElementById('navbar').setAttribute('data-hide','false'), 100) 
    });
    
  },
  false,
);
