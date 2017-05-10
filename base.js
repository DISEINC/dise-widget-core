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

  Object.defineProperty(api, 'parameters', {
    enumerable: true,
    get: function () {
      return location.search
        .replace(/^\?/, "")
        .split("&")
        .map(function (p) {
          var param = p.split("=");
          var pair = {};
          pair[param[0]] = param[1];
          return pair;
        })
        .reduce(function (m, n) { return Object.assign(m, n); });
    }
  });

  return api;
})
