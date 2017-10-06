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
        return storage.setItem(key, value);
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
       * Uses JSON.parse and JSON.serialize.
       */
      hget: function (key) {
        return JSON.parse(storage.getItem(key));
      },
      hset: function (key, value) {
        return storage.setItem(key, JSON.serialize(value));
      },
      hpatch: function (key, value) {
      }
    };
  };

  return {
    Local: StorageWrapper(localStorage),
    Session: StorageWrapper(sessionStorage)
  };
});
