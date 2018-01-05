define(function () {
  /**
   * Wrappers around LocalStorage and SessionStorage,
   * with safe, sane and — possibly — Redis-like methods
   * for data storage and retrieval.
   *
   * Cache.Local wraps LocalStorage,
   * Cache.Session wraps SessionStorage.
   *
   * Otherwise similar.
   */
  var StorageWrapper = function (storage) {

    return {
      get: function (key) {
        return storage.getItem(key);
      },
      set: function (key, value) {
        storage.setItem(key, value);
        return this.get(key);
      },
      remove: function (key) {
        return storage.removeItem(key);
      },
      clear: function () {
        return storage.clear();
      },
      /**
       * Hash functions — Get, Set and Patch objects, arrays, hashes and more.
       *
       * Uses JSON.parse and JSON.stringify.
       */
      hget: function (key) {
        return JSON.parse(storage.getItem(key));
      },
      hset: function (key, value) {
        storage.setItem(key, JSON.stringify(value));
        return this.hget(key);
      },
      /**
       * Only works for keyed structures — not arrays.
       */
      hpatch: function (key, value) {
        var cached = this.hget(key);
        var patched = DS.Util.merge({}, cached, value);

        return storage.setItem(key, JSON.stringify(patched));
      },
      /**
       * List functions
       */
      lget: function (key) {
        return this.hget(key);
      },
      lset: function (key, value) {
        return this.hset(key, value);
      },
      lappend: function (key, value) {
        var cached = this.lget(key);
        var appended = cached.concat(value);

        return this.lset(key, appended);
      },
      lprepend: function (key, value) {
        var cached = this.lget(key);
        var prepended = value.concat(cached);

        return this.lset(key, prepended);
      },
      lhead: function (key) {
        return this.lget(key).slice(0, 1);
      },
      ltail: function (key) {
        return this.lget(key).slice(1);
      },
      incr: function (key, amount) {
        var current = parseInt(this.get(key), 10);

        if (isNaN(current)) {
          throw new RangeError('Cannot increment or decrement NaN');
        }
        amount = amount || 1;
        current = current || 0;

        return this.set(key, current + amount);
      },
      decr: function (key, amount) {
        amount = amount || 1;
      return this.incr(key, amount * -1);
      }
    };
  };

  return {
    Local: StorageWrapper(localStorage),
    Session: StorageWrapper(sessionStorage)
  };
});
