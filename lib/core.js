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
    var themeClass;
    var themeClasses = []; 
    var themeOptions = [];
    /**
     * Set theme and themeOptions, if we have those.
     */
    if (DS.Settings.theme) {
      themeClass = 'theme-' + DS.Settings.theme;
      themeClasses.push(themeClass);

      if (DS.Settings.themeOptions.length) {
        themeOptions = DS.Settings.themeOptions
          .map(function (opt) {
            return themeClass + '--' + opt;
          });

        themeClasses = themeClasses.concat(themeOptions);
      }
      document.querySelector('#widget').classList.add.apply(this, themeClasses);
    }


    /**
     * Auto-bind init, if possible.
     */
    if (DS.Widget.init) {
      this.on(DS.Core.Event.INIT, function () {
        DS.Widget.init();
      });
    }

    this.emit(DS.Core.Event.INIT);

    /**
     * Auto-perform the initial render, if possible.
     */
    if (DS.Widget.update) {
      DS.Widget.update();
    }

    /**
     * Set up the tick emitter.
     */
    if (DS.Settings.tick > 0) {
      window.setInterval(
        (function () { this.emit(DS.Core.Event.TICK); }).bind(this),
        DS.Settings.tick * 1000
      );
    }
  };

  return api;
})
