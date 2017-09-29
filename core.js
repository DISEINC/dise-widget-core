define(function () {
  "use strict";
  /**
   * Core contains non-specific application code.
   * When using `defineProperty`, we *don't* have access to Tools or Widget.
   * We're on our own.
   */
  var api = {};

  Object.defineProperty(api, '$el', {
    enumerable: true,
    get: function () {
      return document.querySelector("#widget");
    }
  });


  Object.defineProperty(api, 'layout', {
    enumerable: true,
    get: function () {
      return new Promise((function (resolve, reject) {
        requirejs(
          ["text!layouts/" + DS.Settings.layout + ".mustache"],
          (function (layout) {
            resolve(layout);
          }).bind(this)
        );
      }).bind(this));
    }
  });

  /**
   * Render the template and update the DOM.
   */
  api.update = function (template, data) {
    this.$el.innerHTML = Mustache.render(template, data);
  }

  api.emit = function (type, detail) {
    this.$el.dispatchEvent(new CustomEvent(type, {
      detail: detail
    }));
  }

  api.listen = function (type, fn) {
    this.$el.addEventListener(type, fn);
  }

  api.setup = function ()
  {
    if (DS.Widget.init) DS.Widget.init();

    this.emit(DS.Event.RENDER);

    if (DS.Settings.tick > 0) {
      window.setInterval(
        (function () { this.emit(DS.Event.TICK); }).bind(this),
        DS.Settings.tick * 1000
      );
    }

    this.emit(DS.Event.INIT);
  };

  return api;
})
