(function () {
  "use strict";

  var HOME_PATH = "/";

  function isHome() {
    return window.location.pathname === HOME_PATH;
  }

  function addHeaderNav(root) {
    var nav = root.querySelector('nav[data-loc="client/src/pages/Welcome.tsx:127"]');
    if (!nav || nav.querySelector("[data-artenia-territorios-link='header']")) return;

    var legacyPrimary = nav.querySelector('button[data-loc="client/src/pages/Welcome.tsx:128"]');
    if (legacyPrimary) {
      legacyPrimary.style.display = "none";
    }

    var mapAnchor = document.createElement("a");
    mapAnchor.href = "/mapa";
    mapAnchor.className = "hidden min-h-11 rounded-full px-4 text-sm font-medium text-white/62 transition hover:text-white sm:inline-flex sm:items-center";
    mapAnchor.textContent = "MAPA";
    mapAnchor.setAttribute("data-artenia-territorios-link", "header-map");

    var oficiosAnchor = document.createElement("a");
    oficiosAnchor.href = "/oficios";
    oficiosAnchor.className = mapAnchor.className;
    oficiosAnchor.textContent = "OFICIOS";
    oficiosAnchor.setAttribute("data-artenia-territorios-link", "header-oficios");

    var historiasAnchor = document.createElement("a");
    historiasAnchor.href = "/historias";
    historiasAnchor.className = mapAnchor.className;
    historiasAnchor.textContent = "HISTORIAS";
    historiasAnchor.setAttribute("data-artenia-territorios-link", "header-historias");

    var territoriesWrap = document.createElement("div");
    territoriesWrap.className = "hidden sm:grid";
    territoriesWrap.style.gap = "2px";
    territoriesWrap.style.margin = "0 4px";

    var territoriesAnchor = document.createElement("a");
    territoriesAnchor.href = "/territorios";
    territoriesAnchor.className = "inline-flex min-h-11 items-center rounded-full border border-white/20 bg-black/25 px-4 text-sm font-medium text-white/85 backdrop-blur-md transition hover:border-cyan-200/45 hover:bg-cyan-100/10 hover:text-white";
    territoriesAnchor.textContent = "TERRITORIOS";
    territoriesAnchor.setAttribute("data-artenia-territorios-link", "header");

    var territoriesHint = document.createElement("small");
    territoriesHint.textContent = "España · El primer territorio de ARTENIA";
    territoriesHint.style.fontSize = "10px";
    territoriesHint.style.color = "rgba(255,255,255,.55)";
    territoriesHint.style.paddingLeft = "12px";

    territoriesWrap.appendChild(territoriesAnchor);
    territoriesWrap.appendChild(territoriesHint);

    var paraArtesanosAnchor = document.createElement("a");
    paraArtesanosAnchor.href = "/registro-artesano";
    paraArtesanosAnchor.className = mapAnchor.className;
    paraArtesanosAnchor.textContent = "PARA ARTESANOS";
    paraArtesanosAnchor.setAttribute("data-artenia-territorios-link", "header-artisans");

    var accessButton = nav.querySelector('button[data-loc="client/src/pages/Welcome.tsx:129"]');
    nav.insertBefore(mapAnchor, accessButton || null);
    nav.insertBefore(oficiosAnchor, accessButton || null);
    nav.insertBefore(historiasAnchor, accessButton || null);
    nav.insertBefore(territoriesWrap, accessButton || null);
    nav.insertBefore(paraArtesanosAnchor, accessButton || null);
  }

  function addMobileMenu(root) {
    var accessButton = root.querySelector('button[data-loc="client/src/pages/Welcome.tsx:129"]');
    if (!accessButton || root.querySelector("[data-artenia-territorios-link='mobile']")) return;

    var mobileWrap = document.createElement("div");
    mobileWrap.setAttribute("data-artenia-territorios-link", "mobile-wrap");
    mobileWrap.style.display = "flex";
    mobileWrap.style.flexWrap = "wrap";
    mobileWrap.style.gap = "8px";
    mobileWrap.style.marginTop = "12px";

    var mobileLinks = [
      { label: "MAPA", href: "/mapa" },
      { label: "OFICIOS", href: "/oficios" },
      { label: "HISTORIAS", href: "/historias" },
      { label: "TERRITORIOS", href: "/territorios", key: "mobile" },
      { label: "PARA ARTESANOS", href: "/registro-artesano" }
    ];

    for (var i = 0; i < mobileLinks.length; i += 1) {
      var link = document.createElement("a");
      link.href = mobileLinks[i].href;
      link.textContent = mobileLinks[i].label;
      link.style.display = "inline-flex";
      link.style.alignItems = "center";
      link.style.minHeight = "38px";
      link.style.padding = "0 12px";
      link.style.borderRadius = "999px";
      link.style.border = "1px solid rgba(255,255,255,.18)";
      link.style.color = "rgba(255,255,255,.86)";
      link.style.fontSize = "11px";
      link.style.letterSpacing = ".06em";
      link.style.textDecoration = "none";
      if (mobileLinks[i].key) {
        link.setAttribute("data-artenia-territorios-link", mobileLinks[i].key);
      }
      mobileWrap.appendChild(link);
    }

    var hero = root.querySelector('main[data-loc="client/src/pages/Welcome.tsx:112"], main');
    if (hero && hero.firstElementChild) {
      hero.firstElementChild.appendChild(mobileWrap);
      return;
    }

    accessButton.parentElement.appendChild(mobileWrap);
  }

  function addHomeInlineLink(root) {
    if (root.querySelector("[data-artenia-territorios-link='inline']")) return;

    var cta = root.querySelector('div[data-loc="client/src/pages/Welcome.tsx:185"], div');
    var anchor = document.createElement("a");
    anchor.href = "/territorios";
    anchor.setAttribute("data-artenia-territorios-link", "inline");
    anchor.style.display = "inline-flex";
    anchor.style.marginTop = "12px";
    anchor.style.fontSize = "13px";
    anchor.style.color = "rgba(152,232,239,.95)";
    anchor.style.textDecoration = "none";
    anchor.textContent = "Explora los territorios y descubre quién crea cerca de ti. · Descubrir territorios";

    var intro = root.querySelector('p[data-loc="client/src/pages/Welcome.tsx:166"], h1 + p');
    if (intro && intro.parentElement) {
      intro.parentElement.appendChild(anchor);
      return;
    }

    if (cta) {
      cta.appendChild(anchor);
    }
  }

  function addFooterLink(root) {
    var footer = root.querySelector('footer[data-loc="client/src/pages/Welcome.tsx:274"]');
    if (!footer || footer.querySelector("[data-artenia-territorios-link='footer']")) return;

    var link = document.createElement("a");
    link.href = "/territorios";
    link.textContent = "Descubrir territorios";
    link.setAttribute("data-artenia-territorios-link", "footer");
    link.style.display = "inline-flex";
    link.style.marginTop = "8px";
    link.style.color = "rgba(152,232,239,.95)";
    link.style.textDecoration = "none";
    link.style.fontSize = "12px";

    var registry = footer.querySelector("[data-artenia-registry]");
    if (registry) {
      registry.appendChild(link);
      return;
    }

    footer.appendChild(link);
  }

  function addMapContextLink(root) {
    if (!/^\/mapa(?:\/|$)/.test(window.location.pathname)) return;
    if (root.querySelector("[data-artenia-territorios-link='map-context']")) return;

    var link = document.createElement("a");
    link.href = "/territorios";
    link.textContent = "Descubrir territorios";
    link.setAttribute("data-artenia-territorios-link", "map-context");
    link.style.position = "fixed";
    link.style.left = "12px";
    link.style.bottom = "14px";
    link.style.zIndex = "1200";
    link.style.display = "inline-flex";
    link.style.alignItems = "center";
    link.style.minHeight = "38px";
    link.style.padding = "0 14px";
    link.style.borderRadius = "999px";
    link.style.border = "1px solid rgba(255,255,255,.2)";
    link.style.background = "rgba(0,0,0,.45)";
    link.style.backdropFilter = "blur(5px)";
    link.style.color = "rgba(255,255,255,.92)";
    link.style.textDecoration = "none";
    link.style.fontSize = "12px";
    root.body.appendChild(link);
  }

  function addArtisanContextLink(root) {
    if (!/^\/artesano(?:\.html)?(?:\/|$)/.test(window.location.pathname)) return;
    if (root.querySelector("[data-artenia-territorios-link='artisan-context']")) return;

    var topbar = root.querySelector(".topbar");
    if (!topbar) return;

    var link = document.createElement("a");
    link.href = "/territorios";
    link.className = "btn";
    link.textContent = "Ver territorios";
    link.setAttribute("data-artenia-territorios-link", "artisan-context");
    topbar.appendChild(link);
  }

  function enhanceHome() {
    var root = document;
    if (isHome()) {
      addHeaderNav(root);
      addMobileMenu(root);
      addHomeInlineLink(root);
      addFooterLink(root);
    }
    addMapContextLink(root);
    addArtisanContextLink(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      enhanceHome();
    });
  } else {
    enhanceHome();
  }

  var observer = new MutationObserver(function () {
    enhanceHome();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.setTimeout(function () {
    observer.disconnect();
  }, 12000);
})();
