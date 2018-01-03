define(function () {
  "use strict";

  requirejs([
    "widget",
    "dise-widget-core/lib/tool",
    "dise-widget-core/lib/async",
    "dise-widget-core/lib/core",
    "dise-widget-core/lib/settings",
    "dise-widget-core/lib/cache",
  ], function (Widget, Tool, Async, Core, Settings, Cache) {

    window.DS = {
      Widget: Widget,
      Tool: Tool,
      Async: Async,
      Core: Core,
      Settings: Settings,
      Cache: Cache
    };

    DS.Core.start();
  });
});
