/*!
 * MAIN SCRIPT OF LIGHT-PARTICLE
 * 
 * Author: sitdisch
 * Source: https://sitdisch.github.io/#mythemeway
 * License: MIT
 * Copyright (c) 2020 sitdisch
 *
 */

//
// VARIABLES:
//

// OTHER VARIABLES
var firstIteration = "1";

// NAVBAR VARIABLES
var nav = document.getElementById('navbar');
var collapseElementListNavbar = [].slice.call(document.querySelectorAll('.navbar-collapse'));

// fix mobile viewport bug
// source: https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

// SCROLL-SPYING VARIABLES
var prevScrollpos = window.pageYOffset;
var scrollSpyAnchors = {};
Array.prototype.forEach.call(document.querySelectorAll(".scroll-spy"), function(e) {
        scrollSpyAnchors[e.id] = e.offsetTop - 100;
});
var currentPath = location.pathname.substring(1).replace(/^Light-Particle\//,''); 
if ( /\//.test(currentPath) ) {
        // highlight dropdownTogglers too if you are there
        var dropdownToggler = /[^\/]*/.exec(currentPath);
        var navbarArrow = document.getElementsByClassName('navbar-arrow-'+dropdownToggler);
        for ( var i=0, len = navbarArrow.length; i < len; i++ ) {
                navbarArrow[i].style.color="orange";
        }
        // highlight the navbarLink, if it is the only one on the current page
        var navbarLink = document.getElementsByClassName('navbar-link-' + /[^\/]*(?=\.html$)/.exec(location.pathname));
        navbarLink[0].style.color="orange";
} else {
        var navbarLinkAbout = document.getElementsByClassName('navbar-link-about');
        navbarLinkAbout[0].style.color="rgba(71, 104, 110, 1.0)";
        var navbarLinkProjects = document.getElementsByClassName('navbar-link-projects');
        for ( var i=0, len = navbarLinkProjects.length; i < len; i++ ) {
                navbarLinkProjects[i].style.color="rgba(71, 104, 110, 1.0)";
        }
}

// DISTINCTION WHETHER TOUCH IS POSSIBLE
if ( window.matchMedia("(pointer: coarse)").matches )  {
        // pressSimulationTime for touch devices
        var pressSimulationTime = 400;
} else {
        // pressSimulationTime for notouch devices
        var pressSimulationTime = 175;
        // adaption after resize only for notouch devices
        window.onresize = function () {
                setTimeout(function () { location.reload() }, 100);
        }
}

// 
// HELP FUNCTIONS:
// 

function setupHashPage() {
        var hashOffset = sessionStorage.getItem("hashOffset");
        window.scrollBy(0, hashOffset);
        var hrefReplaceHash = location.href.replace(location.hash,"");
        history.pushState({},'reset_hash', hrefReplaceHash);
        setTimeout(function (){nav.setAttribute('data-hide','false')}, 700);
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
        setTimeout(function () {
                element.classList.remove("pressed");
        }, time);
}

function pressDelay(ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        ev.stopPropagation();
        setTimeout( function() {
                ev.target.click();
        }, 400);
        firstIteration = "0";
}

//
// FUNCTIONS:
//

// RESET PAGES WITH HASHES:
window.onload = function () {
        // detect color changes from other sources and adapt specific ones (e.g. borders of Dark Reader)
        if ( $("#particles-js").css('color') != "rgb(85, 85, 85)") {
                document.documentElement.style.setProperty('--border-2', `white`);
        }
        if ( location.hash ) {
                setTimeout(setupHashPage, 100);
        } else {
                setTimeout(function (){nav.setAttribute('data-hide','false')}, 500);
        }
};

// ADAPTIONS DURING SCROLLING:
window.onscroll = function () {
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
                                if ( navbarLink[k].classList.contains("header-link") ) {
                                        navbarLink[k].style.color="rgba(71, 104, 110, 1.0)";
                                } else {
                                        navbarLink[k].style.color="#eeeeee";
                                }
                        }
                }
        }
        // disappearing of the navbar
        if ( ( nav.getAttribute('data-hide') == "true" ) || ( prevScrollpos < currentScrollPos )) {
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
        prevScrollpos = currentScrollPos;
};

// ADAPTION AFTER A ONCLICK AND DISTINCT BETWEEN TOUCH AND NOTOUCH:
window.onclick = function(ev) {
        if ( firstIteration == "1" ) {
                pressSimulation(ev.target, pressSimulationTime);
                if ( ev.target.hasAttribute('data-press-delay') == true ) {
                        pressDelay(ev);
                        return;
                }
        }
        if ( ev.target.hash ) {
                var targetHash = ev.target.hash.substring(1);
                if ( document.getElementById(targetHash) != null ) {
                        setTimeout(disNavbar,1050);
                } else if ( !/hex\d*/.test(targetHash) ) {
                        if ( firstIteration == "1" ) {
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
        firstIteration = "1";
};
$(document).on('click', '.dropdown-menu', function (ev) {
        if ( firstIteration == "1" ) {
                pressSimulation(ev.target, pressSimulationTime);
                pressDelay(ev);
                return;
        }
});
$(document).on('click', '.press-simulation-parent', function (ev) {
        if ( firstIteration == "1" ) {
                pressSimulation(ev.target.parentElement, 400);
                return;
        }
});
