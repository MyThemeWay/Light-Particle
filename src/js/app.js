/* sweetScroll load */
document.addEventListener("DOMContentLoaded", function () {
  const sweetScroll = new SweetScroll({/* some options */});

  /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
  particlesJS('particles-js', {
    "particles": {
      "number": {
        "value": 65,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#9be3d5"
      },
      "shape": {
        "type": "polygon",
        "stroke": {
          "width": 0,
          "color": "#37C8AB"
        },
        "polygon": {
          "nb_sides": 6
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.9,
        "random": false,
        "anim": {
          "enable": true,
          "speed": 1.5,
          "opacity_min": 0.33,
          "sync": false
        }
      },
      "size": {
        "value": 2.3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 23.18081918081918,
          "size_min": 0.23,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 230,
        "color": "#5fd3bc",
        "opacity": 0.57,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 3.5,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": true,
          "rotateX": 123,
          "rotateY": 67
        }
      },
      nb: 100
    },
    "interactivity": {
      "detect_on": "window",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 130,
          "line_linked": {
            "opacity": 0.3
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 3
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });

}, false);
