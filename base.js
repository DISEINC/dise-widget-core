define(function Base() {
  "use strict";
  /**
   * Base contains non-specific application code
   */
  var api = {
    getLayout: function () {
      return new Promise((function (resolve, reject) {

        var include = "text!layouts/%layout.mustache";
        requirejs(
          [this.format(include, this.parameters)],
          (function (layout) {
            resolve(layout);
          }).bind(this)
        );
      }).bind(this));
    }
  };

  return api;
})
