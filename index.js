define(function () {
  "use strict";

  requirejs([
    "widget",
    "dise-widget-core/tool",
    "dise-widget-core/async",
    "dise-widget-core/core",
    "dise-widget-core/settings",
    "dise-widget-core/event",
  ], function (Widget, Tool, Async, Core, Settings, Event) {
    /**
     * By merging all these,
     * the Widget will have access to all public methods on `this`.
     *
     * I.e. Widget.init can access Tools.merge as `this.merge`.
     */

    window.DS = {
      Widget: Widget,
      Tool: Tool,
      Async: Async,
      Core: Core,
      Settings: Settings,
      Event: Event
    };

    DS.Core.start();
  });
});
