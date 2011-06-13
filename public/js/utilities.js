var confab = {};

confab.utilities = {};

confab.utilities.load = function(callback) {
  if (window.attachEvent) {
    window.attachEvent('onload', callback);
  }
  else {
    if (window.onload) {
      var old = window.onload;
      window.onload = function() {
        old();
        callback();
      };
    }
    else {
      window.onload = callback;
    }
  }
};