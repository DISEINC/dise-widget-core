/**
 *
 * DISE Widget
 * This file should contain specific application code.
 */

define(function() {
  "use strict";

  var api = {};

  api.fetch = function () {}

  api.update = function () {
    DS.Async.parallel(
      {
        layout: DS.Core.layout
      },
      function (results) {
        DS.Core.render(results.layout, {});
      }
    );
  }


  api.init = function () {
    DS.Core.listen(DS.Event.INIT, this.update.bind(this));
    DS.Core.listen(DS.Event.TICK, this.update.bind(this));
  }

  return api;
});
