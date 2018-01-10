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
      return new Promise(function (resolve) {
        requirejs(["text!layouts/" + DS.Settings.layout + ".mustache"], resolve);
      });
    }
  });

  Object.defineProperty(api, 'Event', {
    enumerable: true,
    get: function () {
      return Object.freeze({
        INIT: 'init',
        UPDATE: 'update',
        TICK: 'tick'
      });
    }
  })

  /**
   * Render the template and update the DOM.
   */
  api.update = function (template, data) {
    this.$el.innerHTML = Mustache.render(template, data);
    this.emit(DS.Core.Event.UPDATE, this.$el);
  }

  api.emit = function (type, detail) {
    this.$el.dispatchEvent(new CustomEvent(type, {
      detail: detail
    }));
  }

  api.on = function (type, fn) {
    this.$el.addEventListener(type, fn);
  }

  api.start = function ()
  {
    if (DS.Widget.init) {
      this.on(DS.Core.Event.INIT, function () {
        DS.Widget.init();
      });
    }

    this.emit(DS.Core.Event.INIT);

    if (DS.Settings.tick > 0) {
      window.setInterval(
        (function () { this.emit(DS.Core.Event.TICK); }).bind(this),
        DS.Settings.tick * 1000
      );
    }
  };

  return api;
})
