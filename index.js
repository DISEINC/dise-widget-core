define(function () {
  "use strict";

  requirejs(["widget", "dise-widget-core/tools", "dise-widget-core/core"], function (Widget, Tools, Core) {
    /**
     * By merging all these,
     * the Widget will have access to all public methods on `this`.
     *
     * I.e. Widget.init can access Tools.merge as `this.merge`.
     */
    Tools.merge(Tools, Core, Widget).setup();
  });
});
