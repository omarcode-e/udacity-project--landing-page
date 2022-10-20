"use strict";
/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Comments should be present at the beginning of each procedure and class.
 * Great to have comments before crucial code sections within the procedure.
 */

/**
 * Define Global Variables
 *
 */
const navbarList = document.querySelector("#navbar__nav");
const sections = document.querySelectorAll("[data-nav]");

/**
 * End Global Variables
 * Start Helper Functions
 *
 */

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */
function app() {
  initNav(navbarList, sections);
  setNavHandler(navbarList);
}
// build the nav
function renderNavItem(parentEl, navLinktext, navLinkAttrValue) {
  const navItem = document.createElement("li");
  const navLink = document.createElement("a");
  parentEl.append(navItem);
  navItem.append(navLink);
  navLink.setAttribute("href", navLinkAttrValue);
  navLink.classList.add("nav__link");
  return (navLink.textContent = navLinktext);
}

function initNav(parentEl, sections) {
  if (!sections) return;

  return sections.forEach((section) => {
    const sectionHeading = section.getAttribute("data-nav");
    const sectionId = `#${section.id}`;
    renderNavItem(parentEl, sectionHeading, sectionId);
  });
}

function setNavHandler(parentEl, handler) {
  return parentEl.addEventListener("click", (e) => {
    if (e.target.className !== "nav__link") return;
    e.preventDefault();
    console.log(e.target.hash);
    const currentSection = document.querySelector(e.target.hash);
    currentSection.scrollIntoView({ behavior: "smooth", block: "end" });
    console.log("nav-item clicked");
    handler;
  });
}

function scrollToSection(e) {}

app();

// Add class 'active' to section when near top of viewport

// Scroll to anchor ID using scrollTO event

/**
 * End Main Functions
 * Begin Events
 *
 */

// Build menu

// Scroll to section on link click

// Set sections as active
