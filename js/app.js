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
const scrollToTopButton = document.querySelector("#btn-scroll-to-top");
const section2 = document.querySelector("#section2");
const navbar = document.querySelector(".navbar");

/**
 * End Global Variables
 * Start Helper Functions
 *
 */
/**
 * Create and insert a new Element into inputed parent-Element with optional
 * arguments such as textContent and attributes to set to new Element.
 *
 * @param {string} tag String specifying the type of tag to be created.
 * @param {Element} parentElement HTML-element for appending created Element into.
 * @param {string} textContent String to be assigned to created Element.
 * @param {object} attributes Object of attribute-name, value to set for created Element.
 * @returns {Element} Newly appended element
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
 * Slows down the firing of Scroll events by adding a delay
 * between each execution to passed callback function.
 *
 * First time the callback function will execute, Then
 * return a function to be assigned to variable, Then
 * check if is delay is active if true, Then
 * delay the execution the next time the function is called if false, Then
 * execute the callback function with passed arguments, Finally
 * set the delay to true.
 *
 * @param {function} cb Callback function to execute.
 * @param {number} delay Set time to delay the execution of callback function.
 * @returns {function} Function that accept a list of arguments to be passed to the callback function.
 */
function throttle(cb, delay = 1000) {
  // first time the callback function will execute immediately
  let isWaiting = false;
  // return a function to be assigned to variable
  return function (...arg) {
    // check if is delay is active
    if (isWaiting) return;
    // Delay the execution the next time the function is called
    isWaiting = true;
    // Execute the callback function function with passed arguments
    cb(...arg);
    // after x amount of time, callback function can be executed again
    setTimeout(() => {
      isWaiting = false;
    }, delay);
  };
}

/**
 * Wait for the event to finish the execute the callback function,
 * If the event keeps firing then the callback function will never execute.
 *
 * @param {function} cb
 * @param {number} delay
 * @returns {function} Anonymous function
 */
function debounce(cb, delay = 1000) {
  let timeout;
  return (...arg) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...arg);
    }, delay);
  };
}

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */
// build the nav
/**
 * Render Navigation element and inserted to
 * the parent element.
 *
 * @param {Element} parentEl Parent element to which navigation item would be appended to.
 * @param {string} navLinktext Set text for navigation link.
 * @param {object} navLinkAttrValue Object of attribute name and value pairs to set on navigation link.
 * @returns {Element} Navigtion item.
 */
function renderNavItem(parentEl, navLinktext, navLinkAttrValue) {
  const navItem = renderElement("li", parentEl);
  const navLink = renderElement("a", navItem, navLinktext, navLinkAttrValue);
}

/**
 * Dynamicly render Navigation items based on the number of Section elements.
 *
 * @param {Element} parentEl Parent element to which navigation item would be appended to.
 * @param {NodeListOf<Element>} sections Array of section elements.
 * @return {undefined} undefined.
 */
function initNavFromSections(parentEl, sections) {
  const docFragment = document.createDocumentFragment();
  // if sections array is empty, bail.
  if (!sections) return;
  // loop over each section element.
  sections.forEach((section) => {
    /**
     * Get section attribute value and use it as text
     * for the navigation link.
     */
    const sectionHeading = section.getAttribute("data-nav");
    // Get section id value and use it as reference for navigation link.
    const sectionId = `#${section.id}`;
    // if parent element is empty, bail.
    if (!parentEl) return;
    /**
     * render navigation item from each section, pass section's
     * attribute value as text and section's id value as reference.
     */
    renderNavItem(docFragment, sectionHeading, {
      class: "nav__link",
      href: sectionId,
    });
  });
  parentEl.append(docFragment);
}

/**
 * Set click event listener on navigation container
 * and handle it with callback function.
 *
 * @param {Element} navContainer Navigation container to attach the event listener to.
 * @param {function} handler Callback function to handle the click event.
 * @returns {undefined} undefined.
 */
function setNavHandler(navContainer, handler) {
  return navContainer.addEventListener("click", (e) => {
    handler(e);
  });
}

// Add class 'active' to section when near top of viewport
/**
 * Check if any of sections is in viewport, update state of section in viewport
 * by toggling the class selector.
 *
 * @param {NodeListOf<Element>} sections List of section elements.
 * @return {undefined} undefined.
 */
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
/**
 * Scroll to section element.
 * @param {Event} e Event object to get the target element.
 * @return {undefined} undefined.
 */
function goToSection(e) {
  if (e.target.className !== "nav__link") return;
  e.preventDefault();
  const currentSection = document.querySelector(e.target.hash);
  currentSection.scrollIntoView({ behavior: "smooth", block: "center" });
}

/****************************************
 * Start Scroll-to-top Main function
 */
/**
 * Toggle button visiblity if the number of pixels that the document
 * is larger then a certain number of pixels.
 *
 * @param {Element} element Element to toggle "class selector".
 * @param {number} pixels Number of pixels to check against "window.scrollY"
 * @return {undefined}
 */
function showGoTopButton(element, pixels) {
  if (window.scrollY > pixels) {
    return element.classList.remove("hidden");
  } else {
    return element.classList.add("hidden");
  }
}

// Takes an element and pass it to the returned function
const updateWindowScrollTop = throttle(showGoTopButton, 500);

/**
 * Scroll to the top of the document.
 * @return {undefined} Undefined.
 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Adds event listener to Button element for handling click events
 * by passing a variable containing the element or the element itself.
 *
 * @param {Element} element Button element to attach event listener to.
 * @param {function} handler Callback function to handle the event.
 * @return {undefined}
 */
function setGoTopButtonClickHandler(element, handler) {
  return element.addEventListener("click", () => {
    handler();
  });
}

/**
 * Adds event listener to window for handling scroll events.
 *
 * @param {function} handler Callback function to handle the event.
 * @return {undefined}
 */
function setGoTopButtonOpacityHandler(handler, ...arg) {
  return window.addEventListener("scroll", () => {
    handler(...arg);
  });
}

/*
 * End Scroll-to-top Main functions
 * Start Navbar Main functions
 */
const hideNavbar = throttle((element) => element.classList.add("hidden"), 500);
const showNavbar = debounce(
  (element) => element.classList.remove("hidden"),
  200
);

/**
 * Toggle the visibility of navbar when scrolling.
 * The order of passing the handler doesn't matter.
 *
 * @param {function} handler1 Callback function to handle hidding or showing navbar
 * @param {function} handler2 Callback function to handle hidding or showing navbar
 * @param  {...any} arg Argument to be passed to the callback function.
 * @returns {undefined} undefined.
 */
function setNavbarOpacityHandler(handler1, handler2, ...arg) {
  return window.addEventListener("scroll", () => {
    handler1(...arg);
    handler2(...arg);
  });
}

/**
 * End Main Functions
 * Begin Events
 *
 */
// Build menu
initNavFromSections(navbarList, sections);

// Scroll to section on link click
setNavHandler(navbarList, goToSection);

// Set sections as active
isSectionInView(sections);

// Scroll to top of document on button click
setGoTopButtonClickHandler(scrollToTopButton, scrollToTop);

// Toggle button as visible at certain threshold
setGoTopButtonOpacityHandler(updateWindowScrollTop, scrollToTopButton, 700);

// Toggle navbar as visible at certain threshold
setNavbarOpacityHandler(hideNavbar, showNavbar, navbar);
