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
 * Create and insert a new Element into inputed parent-Element with optional
 * arguments such as textContent and attributes to set to new Element.
 *
 * @param {string} tag - A String specifying the type of tag to be created.
 * @param {Element} parentElement - An HTML-element for appending created Element into.
 * @param {string} textContent - A String to be assigned to created Element.
 * @param {object} attributes - An Object of attribute-name, value to set for created Element.
 * @returns Newly appended element
 */
// prettier-ignore
function renderElement(tag, parentElement, textContent = "", attributes = {}) {
  const newElement = document.createElement(tag);
  if (textContent) {
    newElement.textContent = textContent;
  }
  
  if(attributes) {
    Object.entries(attributes).forEach(([attrName, attrValue]) =>
      newElement.setAttribute(attrName, attrValue)
    );
  }
  parentElement.append(newElement);
  return newElement;
}

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// build the nav
function renderNavItem(parentEl, navLinktext, navLinkAttrValue) {
  const navItem = renderElement("li", parentEl);
  const navLink = renderElement("a", navItem, navLinktext, {
    class: "nav__link",
    href: navLinkAttrValue,
  });
  return navLink;
}

function initNav(parentEl, sections) {
  return sections.forEach((section) => {
    const sectionHeading = section.getAttribute("data-nav");
    const sectionId = `#${section.id}`;
    renderNavItem(parentEl, sectionHeading, sectionId);
  });
}

function setNavHandler(parentEl, handler) {
  return parentEl.addEventListener("click", (e) => {
    handler(e);
  });
}

// Add class 'active' to section when near top of viewport
function isSectionInView(sections) {
  let sectionObserver;

  const observerOptions = {
    root: null,
    threshold: 0.7,
  };
  sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        return entry.target.classList.add("active-section");
      } else {
        return entry.target.classList.remove("active-section");
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));
}

// Scroll to anchor ID using scrollTO event
function scrollToSection(e) {
  if (e.target.className !== "nav__link") return;
  e.preventDefault();
  const currentSection = document.querySelector(e.target.hash);
  return currentSection.scrollIntoView({ behavior: "smooth", block: "center" });
}

/**
 * End Main Functions
 * Begin Events
 *
 */
// Build menu
initNav(navbarList, sections);

// Scroll to section on link click
setNavHandler(navbarList, scrollToSection);

// Set sections as active
isSectionInView(sections);
