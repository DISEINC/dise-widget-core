/**
 *
 * DISE Weather Widget Prototype
 *
 * Vendors/Dependencies used:
 * - https://github.com/ForbesLindesay/ajax
 * - https://github.com/janl/mustache.js
 *
 * Should the WidgetModule provide a framework? Browserify, AJAX, templating?
 *
 * This widget has some bootstrapping functions that should be generalized and provided by the environment
 * if possible, notably a method for retrieving parameters from the URL and an interface for localStorage
 * as well as setting up the tick.
 */

define(function Widget() {
  /**
   * Using this pattern, `this` refers to the publicly exposed API, also available internally as "api". .
   */
  var api = {};

  /**
   * `widget` refers to private properties.
   */
  var widget = {};
  widget.merge = function () {
    var merged = Object.create({});
    Array.prototype.slice.call(arguments)
    .forEach(function (obj) {
      Object.keys(obj).forEach(function (k) {
        if (obj.hasOwnProperty(k))
        {
          merged[k] = obj[k];
        }
      });
    });
    return merged;
  };
  widget.async = {
    /**
     * Similar to async.parallel: https://github.com/caolan/async,
     * but smaller and simpler.
     * Currently no error handling.
     * Promise-based.
     *
     * @param  {function{}} tasks An object or an array with functions that are executed parallel to each other.
     *                             tasks should return a Promise.
     * @param  {function} final Called when all tasks have executed. Receives a hash of all the results.
     * @return {void}
     */
    parallel: function (tasks, final) {
      var cache = { count: 0, results: {} };
      var keys = Object.keys(tasks);

      keys.forEach(function (key) {
        tasks[key]().then(function (result) {
          cache.results[key] = result;
          cache.count += 1;

          if (cache.count == keys.length) {
            final(cache.results);
          }
        });
      })
    },
    series: function (tasks, final) {
      /**
       * `next` is a function which takes an index and returns a function.
       * The returned function takes a parameter, `acc` (for "accumulated").
       *
       * The returned function calls a third function, which is the *n*th
       * task in the tasklist, calls the function with the accumulated result
       *  of the previous tasks, receives a Promise in return, and waits for
       *  said Promise.
       *
       * when the Promise resolves, it checks whether we've tasks left: If we do,
       * we call `next` again and start over. If not, we call `final`.
       */
      var next = function (n) {
        return function (acc) {
          tasks[n](acc).then(function (r) {
            if (n == tasks.length - 1) {
              final(r);
            }
            else {
              next(n + 1)(r);
            }
          });
        };
      };
      // Initialize the chain - Call the first task.
      next(0)();
    }
  }

  widget.format = function (str, params) {
    var keys = Object.keys(params);
    keys.forEach(function (key) {
      str = str.replace("%" + key, params[key]);
    });
    return str;
  }

  widget.fetch = function () {

    return new Promise(function (resolve) {
      resolve({});
    });
  }

  /**
   * PUBLIC API STARTS HERE
   */

  api.render = function () {
    widget.async.parallel(
      {
        layout: function () {
          return new Promise(function (resolve, reject) {
            var include = "text!layouts/%layout.mustache";
            requirejs(
              [widget.format(include, widget.parameters)],
              function (layout) {
                resolve(layout);
              }
            );
          });
        },
        data: function () {
          return widget.fetch();
        }
      },
      function (results) {
        document.querySelector("#widget").innerHTML = Mustache.render(results.layout, results.data);
      }
    );
  }
  api.init = function (parameters)
  {
    widget.parameters = parameters;


    api.render();
  };

  return api;
})
