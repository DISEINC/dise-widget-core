define(function Tools() {
  "use strict";

  /**
   * Tools contain helper methods, such as `merge` or `format`.
   *
   * Chiefly polyfills or workarounds for poor ES6 support.
   * Should not contain application code.
   */
  return {
    /**
     * This should not be bound to `this`.
     *
     * It returns a new object.
     */
    merge: function () {
      var merged = Object.create({});
      Array.prototype.slice.call(arguments)
      .filter(function (obj) { return !!obj; })
      .forEach(function (obj) {
        Object.keys(obj).forEach(function (k) {
          if (obj.hasOwnProperty(k))
          {
            merged[k] = obj[k];
          }
        });
      });

      return merged;
    },
    format: function (str, params) {
      var keys = Object.keys(params);
      keys.forEach(function (key) {
        str = str.replace("%" + key, params[key]);
      });
      return str;
    },
  }
});
