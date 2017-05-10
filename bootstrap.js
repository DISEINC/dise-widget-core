define(function () {
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

  requirejs(["widget"], function (Widget) {
    Widget.init(parameters);
    window.setInterval(Widget.render, parameters.tick * 1000 || 20000);
  });
});
