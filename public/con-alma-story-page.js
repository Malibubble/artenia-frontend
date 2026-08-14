(function () {
  "use strict";

  function ensureStorySeo() {
    var title = "Con Alma Design | Madera y ceramica artesanal en Mallorca - ARTENIA";
    var description = "Conoce la historia de Con Alma Design, proyecto de Maria Antonia Marques y Alvaro Garriga en Binissalem, Mallorca, centrado en diseno y fabricacion artesanal en madera y ceramica.";

    document.title = title;

      function ensureMeta(attr, key, content) {
        var selector = "meta[" + attr + '="' + key + '"]';
      var node = document.head.querySelector(selector);
      if (!node) {
        node = document.createElement("meta");
        node.setAttribute(attr, key);
        document.head.appendChild(node);
      }
      node.setAttribute("content", content);
    }

    ensureMeta("name", "description", description);
    ensureMeta("property", "og:title", title);
    ensureMeta("property", "og:description", description);
    ensureMeta("name", "twitter:title", title);
    ensureMeta("name", "twitter:description", description);
  }

  function mountPage() {
    var root = document.getElementById("root");
    var data = window.ArteniaStoryData && window.ArteniaStoryData["con-alma-design"];
    var layout = window.ArteniaArtisanStoryLayout;

    if (!root || !data || !layout || typeof layout.mount !== "function") {
      return;
    }

    ensureStorySeo();
    layout.mount(root, data);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountPage, { once: true });
  } else {
    mountPage();
  }
})();
