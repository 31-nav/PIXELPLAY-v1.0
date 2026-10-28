/**
 * PixelPlay - DOM Helpers & Safe Element Builders
 */

/**
 * Shorthand for querySelector
 * @param {string} selector 
 * @param {Element|Document} [parent=document] 
 * @returns {Element|null}
 */
export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Shorthand for querySelectorAll
 * @param {string} selector 
 * @param {Element|Document} [parent=document] 
 * @returns {Element[]}
 */
export function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

/**
 * Create a DOM element with attributes, dataset, classes, and children safely
 * @param {string} tag 
 * @param {object} [attrs={}] 
 * @param {Array<string|Node>} [children=[]] 
 * @returns {HTMLElement}
 */
export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'className' || key === 'class') {
      el.className = value;
    } else if (key === 'dataset' && typeof value === 'object') {
      for (const [dataKey, dataVal] of Object.entries(value)) {
        el.dataset[dataKey] = dataVal;
      }
    } else if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.slice(2).toLowerCase();
      el.addEventListener(eventName, value);
    } else if (key === 'text') {
      el.textContent = value;
    } else if (key === 'html') {
      // Used strictly for trusted static SVG markup
      el.innerHTML = value;
    } else if (value !== false && value !== null && value !== undefined) {
      el.setAttribute(key, value === true ? '' : value);
    }
  }

  for (const child of children) {
    if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(String(child)));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  }

  return el;
}

/**
 * Remove all child nodes from an element
 * @param {Element} element 
 */
export function empty(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Escape HTML special characters for safe string rendering
 * @param {string} str 
 * @returns {string}
 */
export function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
