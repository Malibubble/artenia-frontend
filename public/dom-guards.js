(function () {
  if (typeof Node === "undefined" || !Node.prototype || typeof Node.prototype.removeChild !== "function") {
    return;
  }

  const nativeRemoveChild = Node.prototype.removeChild;

  Node.prototype.removeChild = function (child) {
    if (!child || child.parentNode !== this) {
      return child;
    }

    try {
      return nativeRemoveChild.call(this, child);
    } catch (error) {
      if (error && error.name === "NotFoundError") {
        return child;
      }
      throw error;
    }
  };
})();