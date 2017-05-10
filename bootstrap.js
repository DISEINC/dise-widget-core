define(function () {
  console.log("Bootstrapper");

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

  console.log("Loading widget");
  requirejs(["widget"], function (Widget) {
    console.log("Initializing widget");
    Widget.init(parameters);
    window.setInterval(Widget.render, parameters.tick * 1000 || 20000);
  });
});
