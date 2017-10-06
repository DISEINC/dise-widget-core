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
      }
    };
  };

  return {
    Local: StorageWrapper(localStorage),
    Session: StorageWrapper(sessionStorage)
  };
});
