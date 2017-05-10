define(function Tools() {
  "use strict";

  /**
   * Tools contain helper methods, such as `merge` or `format`.
   *
   * Chiefly polyfills or workarounds for poor ES6 support.
   * Should not contain application code.
   */
  return {
    merge: function () {
      console.log("Merged", this)
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
    },
    format: function (str, params) {
      var keys = Object.keys(params);
      keys.forEach(function (key) {
        str = str.replace("%" + key, params[key]);
      });
      return str;
    },
    async: {
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

        keys.forEach((function (key) {
          tasks[key].bind(this)().then((function (result) {
            cache.results[key] = result;
            cache.count += 1;

            if (cache.count == keys.length) {
              final.bind(this)(cache.results);
            }
          }).bind(this));
        }).bind(this))
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
        var next = (function (n) {
          console.log("Am next", this)
          return (function (acc) {
            tasks[n].bind(this)(acc).then((function (r) {
              if (n == tasks.length - 1) {
                final.bind(this)(r);
              }
              else {
                next(n + 1)(r);
              }
            }).bind(this));
          }).bind(this);
        }).bind(this);
        // Initialize the chain - Call the first task.
        next(0)();
      }
    }
  }
});
