define(function () {
  "use strict";

  requirejs(["widget", "dise-widget-core/tools", "dise-widget-core/base"], function (Widget, Tools, Base) {
    /**
     * By merging all these,
     * the Widget will have access to all public methods on `this`.
     *
     * I.e. Widget.init can access Tools.merge as `this.merge`.
     */
    Tools.merge(Tools, Base, Widget).init();
  });
});
