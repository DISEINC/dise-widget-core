/**
 *
 * DISE Widget
 * This file should contain specific application code.
 */

define(function Widget() {
  "use strict";
  /**
   * Using this pattern, `this` refers to the publicly exposed API, also available internally as "api". .
   *
   * `Inherited` properties, such as `async` functions, should be called with:
   * this.async.parallel.call(this, ...)
   * instead of `this.async.parallel(...)`
   *
   * If they are bound, you'll have access to `this` in all of the functions.
   */
  var state = {
    rendered: 0
  };

  var api = {};
  api.fetch = function () {
    return new Promise(function (resolve) {
      resolve({});
    });
  }

  api.render = function () {
    state.rendered += 1;
    this.async.parallel.call(this,
      {
        layout: this.layout,
        data: this.fetch
      },
      function (results) {
        this.update(
          results.layout,
          this.merge(results.data, state, { dt: Date.now() })
        );
      }
    );
  }

  api.init = function ()
  {
    this.render();
    window.setInterval(
      this.render.bind(this),
      this.parameters.tick * 1000
    );
  };

  return api;

})
