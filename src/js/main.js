/*! LIGHT-PARTICLE: MAIN.JS
 * 
 * Author: sitdisch
 * Source: https://sitdisch.github.io/#mythemeway
 * License: MIT
 * Copyright © 2020 sitdisch
 */

//
// VARIABLES:
//

// OTHER VARIABLES
var firstIteration = true;

// NAVBAR VARIABLES
var nav = document.getElementById('navbar');
var collapseElementListNavbar = [].slice.call(document.querySelectorAll('.navbar-collapse'));

// SCROLL-SPYING VARIABLES
var prevScrollPos = window.pageYOffset;
var headEndPos = document.getElementById("header-end").offsetTop - 150;
var scrollSpyAnchors = {};
Array.prototype.forEach.call(document.querySelectorAll(".scroll-spy"), (e) => {
        scrollSpyAnchors[e.id] = e.offsetTop - 100;
});

// HIGHLIGHTING OF NAVBAR ITEMS ON SHORT-HEADER PAGES
if ( $('#header').hasClass('short') ) {
        var dropdownToggler = /[^\/]*(?=\/\d{4}\/(?:\d\d?\/){2}.*$)/.exec(location.pathname);
        var navbarArrow = document.getElementsByClassName('navbar-arrow-'+dropdownToggler);
        for ( var i=0, len = navbarArrow.length; i < len; i++ ) {
                navbarArrow[i].style.color="orange";
        }
        // highlighting of navbarLink, if it is the only one on the current page
        var navbarLink = document.getElementsByClassName('navbar-link-' + /[^\/]*(?=\.html$)/.exec(location.pathname));
        navbarLink[0].style.color="orange";
}

// DISTINCTION WHETHER TOUCH IS POSSIBLE
if ( window.matchMedia("(pointer: coarse)").matches )  {
        // pressSimulationTime for touch devices
        var pressSimulationTime = 400;
        // fix mobile viewport bug
        // source: https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        // adaption after orientation change
        window
            .matchMedia('(orientation: portrait)')
            .addListener(() => {
                    setTimeout( () => { location.reload() }, 100);
            });
} else {
        // pressSimulationTime for notouch devices
        var pressSimulationTime = 175;
        // adaption after resize only for notouch devices
        window.addEventListener('resize', () => {
                setTimeout( () => { location.reload() }, 100);
        })
}

// CHECK IF FULL-SIZE CANVAS IS REASONABLE
var header = document.getElementById('header');
if ( (header.offsetHeight+header.offsetWidth ) < 1578) {
        document.getElementById('header-canvas').classList.add("full-size");
}

// 
// HELP FUNCTIONS:
// 

function setupHashPage() {
        var hashOffset = sessionStorage.getItem("hashOffset");
        window.scrollBy(0, hashOffset);
        var hrefReplaceHash = location.href.replace(location.hash,"");
        history.pushState({},'reset_hash', hrefReplaceHash);
        setTimeout( () => {nav.setAttribute('data-hide','false')}, 700);
};

function disNavbar() {
        nav.style.position = "absolute";
        nav.style.top = "-100px";
        nav.style.opacity = 0;
        if ( $('.navbar-collapse').hasClass('show') ) {
                var collapseList = collapseElementListNavbar.map(function (collapseEl) {
                  return new bootstrap.Collapse(collapseEl);
                });
        }
};

window.pressSimulation = function(element,time) {
        element.classList.add("pressed");
        setTimeout( () => {
                element.classList.remove("pressed");
        }, time);
}

function pressDelay(ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        ev.stopPropagation();
        setTimeout(  () => {
                ev.target.click();
        }, 400);
        firstIteration = false;
}

//
// FUNCTIONS:
//

// RESET PAGES WITH HASHES:
window.addEventListener('load', () => {
        if ( location.hash ) {
                setTimeout(setupHashPage, 100);
        } else {
                setTimeout( () => {nav.setAttribute('data-hide','false')}, 500);
        }
});

// ADAPTIONS DURING SCROLLING:
window.addEventListener('scroll', () => {
        var currentScrollPos = window.pageYOffset;
        var j = "";
        // scroll-spying
        for ( var i in scrollSpyAnchors ) {
                var navbarLink = document.getElementsByClassName('navbar-link-' + i);
                var navbarLinkLength = navbarLink.length;
                if ( scrollSpyAnchors[i] <= currentScrollPos ) {
                        for ( var k=0; k < navbarLinkLength; k++ ) {
                                navbarLink[k].style.color="orange";
                        }
                        if ( j != "" ) {
                                var navbarLink = document.getElementsByClassName('navbar-link-' + j);
                                var navbarLinkLength = navbarLink.length;
                                for ( var k=0; k < navbarLinkLength; k++ ) {
                                        navbarLink[k].style.color="#eeeeee";
                                }
                        }
                        var j = i;
                } else {
                        for ( var k=0; k < navbarLinkLength; k++ ) {
                                navbarLink[k].style.color="#eeeeee";
                        }
                }
        }
        // disappearing of the navbar
        if ( ( nav.getAttribute('data-hide') == "true" ) || ( prevScrollPos < currentScrollPos ) || ( headEndPos > currentScrollPos )) {
                disNavbar();
        } else {
                nav.style.top = 0;
                nav.style.position = "fixed";
                nav.style.opacity = 1;
                if ( $('.navbar-collapse').hasClass('show') ) {
                        var collapseList = collapseElementListNavbar.map(function (collapseEl) {
                          return new bootstrap.Collapse(collapseEl);
                        });
                }
                if ( $('.dropdown-toggle').attr("aria-expanded") ) {
                        $('.dropdown-toggle').removeClass('show');
                        $('.dropdown-menu').removeClass('show');
                        $('.dropdown-menu').removeAttr('data-bs-popper');
                        $('.dropdown-toggle').attr("aria-expanded","false");
                }
        }
        prevScrollPos = currentScrollPos;
});

// ADAPTION AFTER A ONCLICK AND DISTINCT BETWEEN TOUCH AND NOTOUCH:
window.addEventListener('click', (ev) => {
        if ( firstIteration ) {
                pressSimulation(ev.target, pressSimulationTime);
                if ( ev.target.hasAttribute('data-press-delay') ) {
                        pressDelay(ev);
                        return;
                }
        }
        if ( ev.target.hash ) {
                var targetHash = ev.target.hash.substring(1);
                if ( document.getElementById(targetHash) != null ) {
                        setTimeout(disNavbar,1050);
                } else {
                        if ( firstIteration ) {
                                pressDelay(ev);
                                return;
                        }
                        var hashPrefix = ev.target.getAttribute("data-hash-prefix");
                        var hashOffset = JSON.parse(ev.target.getAttribute("data-scroll-options"))["offset"];
                        sessionStorage.setItem("hashOffset", hashOffset);
                        if ( hashPrefix ) {
                                location.assign(location.protocol+'//'+location.host+hashPrefix+"#"+targetHash);
                        } else {
                                location.assign(location.protocol+'//'+location.host+"/#"+targetHash);
                        }
                }
        } else if ( !ev.target.classList.contains('navbar-click-stay') ) {
                // consider the ! (if not true then do this)
                disNavbar();
        }
        firstIteration = true;
});
$(document).on('click', '.dropdown-menu', function (ev) {
        if ( firstIteration ) {
                pressSimulation(ev.target, pressSimulationTime);
                pressDelay(ev);
                return;
        }
});
$(document).on('click', '.press-simulation-parent', function (ev) {
        if ( firstIteration ) {
                pressSimulation(ev.target.parentElement, 400);
                return;
        }
});
