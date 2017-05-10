define(function () {
  "use strict";
  /**
   * ?layout=card&tick=5 -> {layout: "card", tick: "5"}
   */
  const parameters = location.search
    .replace(/^\?/, "")
    .split("&")
    .map(function (p) {
      var param = p.split("=");
      var pair = {};
      pair[param[0]] = param[1];
      return pair;
    })
    .reduce(function (m, n) { return Object.assign(m, n); });

  requirejs(["widget", "tools", "base"], function (Widget, Tools, Base) {
    console.log(Tools);
    /**
     * By merging all these,
     * the Widget will have access to all public methods on `this`.
     *
     * I.e. Widget.init can access Tools.merge as `this.merge`.
     */
    var wgt = Tools.merge(Tools, Base, Widget);
    wgt.init(parameters);
    /**
     * Gör den här hanteringen internt.
     */
    window.setInterval(wgt.render.bind(wgt), parameters.tick * 1000 || 20000);
  });
});
