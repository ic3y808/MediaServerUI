// Plucked from http://davidwalsh.name/javascript-debounce-function
// If you do use this in production, you should probably minify it

var debounce = function (func, wait, immediate) {
  var timeout = null;
  return function () {
    var context = this;
    var args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !(timeout === null);
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
};

// Load the script in browser/node/commonJS environments
this.debounce = debounce;

// Slightly more defensive than tyepof module !== 'undefined'; this won't error if module === null.
if (typeof module !== "undefined" && module !== null && module.exports) {
  module.exports = debounce;
}