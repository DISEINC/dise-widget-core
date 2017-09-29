define(function () {
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
   * Essentially a copy of DS.Tool.merge.
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
});
