(function () {
  "use strict";

  if (window.location.pathname !== "/") {
    return;
  }

  function addRegistryData() {
    var footer = document.querySelector(
      'footer[data-loc="client/src/pages/Welcome.tsx:274"]'
    );
    if (!footer || footer.querySelector("[data-artenia-registry]")) {
      return Boolean(footer);
    }

    var previousStatement = footer.querySelector(
      '[data-loc="client/src/pages/Welcome.tsx:279"]'
    );
    if (previousStatement) {
      previousStatement.remove();
    }

    var block = document.createElement("div");
    block.setAttribute("data-artenia-registry", "");
    block.className = "text-left sm:text-right";
    block.style.maxWidth = "30rem";
    block.style.fontSize = "0.875rem";
    block.style.lineHeight = "1.5rem";
    block.style.color = "rgba(255,255,255,.65)";

    var mark = document.createElement("strong");
    mark.style.display = "block";
    mark.style.color = "rgba(255,255,255,.92)";
    mark.style.letterSpacing = ".08em";
    mark.textContent = "ARTENIA™";

    var statement = document.createElement("span");
    statement.style.display = "block";
    statement.textContent =
      "Preserving Human Handwork in the Age of Digital Expansion";

    var registration = document.createElement("span");
    registration.style.display = "block";
    registration.textContent =
      "Conceived in 2024 · System registered in 2025";

    var copyright = document.createElement("span");
    copyright.style.display = "block";
    copyright.style.marginTop = ".15rem";
    copyright.style.color = "rgba(255,255,255,.78)";
    copyright.textContent = "© 2024–2026 ARTENIA";

    block.append(mark, statement, registration, copyright);
    footer.appendChild(block);
    return true;
  }

  if (addRegistryData()) {
    return;
  }

  var observer = new MutationObserver(function () {
    if (addRegistryData()) {
      observer.disconnect();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  window.setTimeout(function () {
    observer.disconnect();
  }, 10000);
})();
