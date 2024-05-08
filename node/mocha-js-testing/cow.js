// cow.js
(function(exports) {
  "use strict";

  function Cow(name) {
    this.name = name || "Anon cow";
  }
  exports.Cow = Cow;

  Cow.prototype = {
    greets: function(target) {
      if (!target)
        throw new Error("missing target");
      return this.name + " greets " + target;
    },
    goodbye: function(target) {
      if (!target)
        throw new Error("missing target");
      return this.name + " goodbyes " + target;
    },
    adder: function(x,y) {
      if (!x)
        throw new Error("missing x");
      return x + y;
    }      
  };
})(this);