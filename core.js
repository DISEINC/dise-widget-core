define(function () {
  "use strict";
  /**
   * Core contains non-specific application code.
   * When using `defineProperty`, we *don't* have access to Tools or Widget.
   * We're on our own.
   */
  var api = {
    update: function () {
      console.log("Update");
    }
  };

  Object.defineProperty(api, '$el', {
    enumerable: true,
    get: function () {
      return document.querySelector("#widget");
    }
  })

  Object.defineProperty(api, 'layout', {
    enumerable: true,
    get: function () {
      return new Promise((function (resolve, reject) {
        requirejs(
          ["text!layouts/" + this.parameters.layout + ".mustache"],
          (function (layout) {
            resolve(layout);
          }).bind(this)
        );
      }).bind(this));
    }
  });


  Object.defineProperty(api, 'parameters', {
    enumerable: true,
    get: function () {
      var removeEmpty = function (p) {
        return p[1] != undefined && p[1] != ""
      };
      var toObject = function (m, n) {
        m[n[0]] = n[1];
        return m;
      };

      /**
       * Retrieve parameters from the URL
       */
      var parameters =  location.search.replace(/^\?/, "").split("&")
        .map(function (p) { return p.split("="); })
        .filter(removeEmpty)
        .reduce(toObject, {});

      /**
       * And default parameters from the body.
       */
      var defaults = Array.prototype.slice.call(document.querySelectorAll('meta[name^="widget-"]'))
        .map(function (tag) { return [tag.name.replace("widget-", ""), tag.content.trim()]; })
        .filter(removeEmpty)
        .reduce(toObject, {});

      /**
       * Essentially a copy of Tools.merge.
       */
      var merged = Object.create({});
      [defaults, parameters]
      .map(function (obj) {
        Object.keys(obj).forEach(function (key) {
          if (obj.hasOwnProperty(key))
          {
            merged[key] = obj[key];
          }
        });
      });

      return merged;
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

    this.emit('render');

    if (this.parameters.tick > 0) {
      window.setInterval(
        (function () { this.emit('tick'); }).bind(this),
        this.parameters.tick * 1000
      );
    }

    this.emit('init');
  };

  return api;
})
