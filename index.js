define(function () {
  "use strict";

  requirejs([
    "widget",
    "dise-widget-core/tools",
    "dise-widget-core/async",
    "dise-widget-core/core"
  ], function (Widget, Tools, Async, Core) {
    /**
     * By merging all these,
     * the Widget will have access to all public methods on `this`.
     *
     * I.e. Widget.init can access Tools.merge as `this.merge`.
     */

    window.DS = {
      Widget: Widget,
      Tools: Tools,
      Async: Async,
      Core: Core
    };

    DS.Core.setup();
  });
});
