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
  var state = {};
  var api = {};

  state.rendered = 0;

  api.fetch = function () {
    return new Promise(function (resolve) {
      resolve({});
    });
  }

  api.render = function () {
    state.rendered += 1;
    this.async.parallel.call(this,
      {
        layout: this.getLayout.bind(this),
        data: this.fetch
      },
      function (results) {
        var data = results.data || {};
        data.rendered = state.rendered;
        document.querySelector("#widget").innerHTML = Mustache.render(results.layout, data);
      }
    );
  }

  api.init = function (parameters)
  {
    this.parameters = parameters;

    this.render();
  };

  return api;

})
