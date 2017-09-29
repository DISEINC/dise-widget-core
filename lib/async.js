define(function () {
  "use strict";
  return {
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
        var fn = tasks[key];
        if (typeof tasks[key] != "function") {
          fn = function () {
            return tasks[key];
          }
        }

        fn().then(function (result) {
          cache.results[key] = result;
          cache.count += 1;

          if (cache.count == keys.length) {
            final(cache.results);
          }
        });
      })
    },
    waterfall: function (tasks, final) {
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
});
