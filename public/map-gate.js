(function () {
  "use strict";

  var SUPPORTED_LANGS = ["es", "en", "fr"];
  var MAP_GATE_KEYS = {
    brandPrivateCircle: "mapGate.brandPrivateCircle",
    privateAccessKicker: "mapGate.privateAccessKicker",
    enterTitle: "mapGate.enterTitle",
    intro: "mapGate.intro",
    codePlaceholder: "mapGate.codePlaceholder",
    enterMapButton: "mapGate.enterMapButton",
    requestAccessButton: "mapGate.requestAccessButton",
    accessNotConfigured: "mapGate.accessNotConfigured",
    requestSectionTitle: "mapGate.requestSectionTitle",
    requestSectionIntro: "mapGate.requestSectionIntro",
    namePlaceholder: "mapGate.namePlaceholder",
    emailPlaceholder: "mapGate.emailPlaceholder",
    reasonPlaceholder: "mapGate.reasonPlaceholder",
    sendRequestButton: "mapGate.sendRequestButton",
    backToHome: "mapGate.backToHome",
    artisanCta: "mapGate.artisanCta",
    checkingCode: "mapGate.checkingCode",
    accessGranted: "mapGate.accessGranted",
    invalidCode: "mapGate.invalidCode",
    sendingRequest: "mapGate.sendingRequest",
    requestSentSuccess: "mapGate.requestSentSuccess",
    requestFailed: "mapGate.requestFailed",
    genericRequestError: "mapGate.genericRequestError"
  };
  var SCRIPT_BY_LANG = {
    es: "/i18n/lang-es.js",
    en: "/i18n/lang-en.js",
    fr: "/i18n/lang-fr.js"
  };

  function normalizeLang(lang) {
    var candidate = String(lang || "").toLowerCase();
    return SUPPORTED_LANGS.indexOf(candidate) !== -1 ? candidate : "es";
  }

  function getLangFromQuery() {
    try {
      var url = new URL(window.location.href);
      return normalizeLang(url.searchParams.get("lang"));
    } catch (_) {
      return "es";
    }
  }

  function getSavedLang() {
    try {
      return normalizeLang(localStorage.getItem("artenia_lang"));
    } catch (_) {
      return "es";
    }
  }

  function getActiveLang() {
    var query = getLangFromQuery();
    if (query && query !== "es") return query;
    var saved = getSavedLang();
    if (saved && saved !== "es") return saved;
    return normalizeLang(document.documentElement.getAttribute("lang"));
  }

  function loadLanguageCatalog(lang) {
    var src = SCRIPT_BY_LANG[lang];
    if (!src) return Promise.resolve();
    var catalogs = window.ARTENIA_I18N_MAP_GATE || {};
    if (catalogs[lang]) return Promise.resolve();

    var existing = document.querySelector('script[data-i18n-map-gate-lang="' + lang + '"]');
    if (existing) {
      return new Promise(function (resolve) {
        existing.addEventListener("load", function () { resolve(); }, { once: true });
        existing.addEventListener("error", function () { resolve(); }, { once: true });
      });
    }

    return new Promise(function (resolve) {
      var script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.setAttribute("data-i18n-map-gate-lang", lang);
      script.onload = function () { resolve(); };
      script.onerror = function () { resolve(); };
      document.head.appendChild(script);
    });
  }

  async function ensureLabelsLoaded(lang) {
    await loadLanguageCatalog("es");
    if (lang !== "es") {
      await loadLanguageCatalog(lang);
    }
  }

  function getLabels(lang) {
    var catalogs = window.ARTENIA_I18N_MAP_GATE || {};
    var fallback = catalogs.es || {};
    var selected = catalogs[lang] || {};
    var labels = {};
    var keys = Object.keys(MAP_GATE_KEYS);
    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      var token = MAP_GATE_KEYS[key];
      labels[key] = selected[key] || fallback[key] || token;
    }
    return labels;
  }

  async function api(url, options) {
    var response = await fetch(url, Object.assign({
      credentials: "same-origin",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    }, options || {}));
    var payload = await response.json().catch(function () {
      return {};
    });
    if (!response.ok) {
      var labels = getLabels(getActiveLang());
      throw new Error(payload.error || labels.genericRequestError);
    }
    return payload;
  }

  function ready(callback) {
    if (document.body && document.getElementById("root")) {
      callback();
      return;
    }
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  }

  function mountStyles() {
    if (document.getElementById("artenia-map-gate-style")) return;
    var style = document.createElement("style");
    style.id = "artenia-map-gate-style";
    style.textContent = [
      "body{margin:0;background:#071116;color:#f3fbfc;font-family:ui-sans-serif,system-ui,-apple-system,\"Segoe UI\",sans-serif}",
      "#seo-indexable-content{display:none!important}",
      ".amg{min-height:100svh;display:grid;place-items:center;padding:22px;box-sizing:border-box;background:radial-gradient(circle at 25% -5%,rgba(160,225,232,.17),transparent 34rem),linear-gradient(155deg,#061015,#0a1b22 48%,#050b0e)}",
      ".amg-card{width:min(560px,100%);border:1px solid rgba(255,255,255,.13);border-radius:28px;background:rgba(8,22,28,.89);padding:clamp(22px,6vw,42px);box-sizing:border-box;box-shadow:0 26px 90px rgba(0,0,0,.42)}",
      ".amg-brand{display:flex;align-items:center;gap:12px;margin-bottom:26px}.amg-brand img{width:44px;height:44px}.amg-brand strong{display:block;letter-spacing:.16em}.amg-brand span{display:block;margin-top:3px;color:rgba(255,255,255,.46);font-size:10px;text-transform:uppercase;letter-spacing:.12em}",
      ".amg-kicker{color:#98e8ef;font-size:11px;text-transform:uppercase;letter-spacing:.2em;font-weight:800}.amg h1{font-size:clamp(32px,7vw,54px);line-height:.98;letter-spacing:-.045em;margin:11px 0 14px}.amg-intro{color:rgba(255,255,255,.62);line-height:1.62;margin:0 0 24px}",
      ".amg-form{display:grid;gap:11px}.amg-input,.amg-textarea{width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.15);background:rgba(0,0,0,.24);color:#fff;border-radius:14px;padding:13px 14px;font:inherit;outline:none}.amg-input:focus,.amg-textarea:focus{border-color:#98e8ef;box-shadow:0 0 0 3px rgba(152,232,239,.12)}.amg-textarea{min-height:100px;resize:vertical}",
      ".amg-btn{border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:13px 18px;background:transparent;color:#fff;font-weight:800;cursor:pointer}.amg-btn-primary{background:#98e8ef;border-color:#98e8ef;color:#061016}.amg-btn:hover{filter:brightness(1.08)}.amg-btn:disabled{opacity:.45;cursor:wait}",
      ".amg-row{display:flex;gap:9px;flex-wrap:wrap}.amg-row>*{flex:1}.amg-message{min-height:20px;margin:12px 0 0;color:#fecaca;font-size:13px;line-height:1.5}.amg-success{color:#a7f3d0}.amg-request{display:none;margin-top:22px;padding-top:22px;border-top:1px solid rgba(255,255,255,.11)}.amg-request.is-open{display:block}.amg-request h2{font-size:19px;margin:0 0 6px}.amg-request p{color:rgba(255,255,255,.54);font-size:13px;line-height:1.5;margin:0 0 14px}",
      ".amg-links{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:24px}.amg-back,.amg-artisan{color:rgba(255,255,255,.54);font-size:12px;text-decoration:none}.amg-artisan{color:#a9f3f7;font-weight:760}.amg-back:hover,.amg-artisan:hover{color:#fff}"
    ].join("");
    document.head.appendChild(style);
  }

  function renderGate(configured) {
    ready(async function () {
      var activeLang = getActiveLang();
      await ensureLabelsLoaded(activeLang);
      var labels = getLabels(activeLang);
      mountStyles();
      var root = document.getElementById("root");
      if (!root) return;

      root.innerHTML = [
        '<main class="amg"><section class="amg-card">',
        '<div class="amg-brand"><img src="/artenia-mark.svg" alt=""><div><strong>ARTENIA</strong><span>' + labels.brandPrivateCircle + '</span></div></div>',
        '<p class="amg-kicker">' + labels.privateAccessKicker + '</p><h1>' + labels.enterTitle + '</h1>',
        '<p class="amg-intro">' + labels.intro + '</p>',
        '<form class="amg-form" id="amg-code-form"><input class="amg-input" name="code" type="password" autocomplete="one-time-code" placeholder="' + labels.codePlaceholder + '" required ' + (configured ? "" : "disabled") + '>',
        '<div class="amg-row"><button class="amg-btn amg-btn-primary" type="submit" ' + (configured ? "" : "disabled") + '>' + labels.enterMapButton + '</button><button class="amg-btn" type="button" id="amg-request-toggle">' + labels.requestAccessButton + '</button></div></form>',
        '<p class="amg-message" id="amg-message">' + (configured ? "" : labels.accessNotConfigured) + '</p>',
        '<section class="amg-request" id="amg-request"><h2>' + labels.requestSectionTitle + '</h2><p>' + labels.requestSectionIntro + '</p>',
        '<form class="amg-form" id="amg-request-form"><input class="amg-input" name="name" autocomplete="name" placeholder="' + labels.namePlaceholder + '" required><input class="amg-input" name="email" type="email" autocomplete="email" placeholder="' + labels.emailPlaceholder + '" required><textarea class="amg-textarea" name="reason" placeholder="' + labels.reasonPlaceholder + '"></textarea><button class="amg-btn amg-btn-primary" type="submit">' + labels.sendRequestButton + '</button></form></section>',
        '<div class="amg-links"><a class="amg-back" href="/">' + labels.backToHome + '</a><a class="amg-artisan" href="/registro-artesano">' + labels.artisanCta + '</a></div>',
        '</section></main>'
      ].join("");

      var message = document.getElementById("amg-message");
      var requestSection = document.getElementById("amg-request");
      var requestToggle = document.getElementById("amg-request-toggle");
      var codeForm = document.getElementById("amg-code-form");
      var requestForm = document.getElementById("amg-request-form");

      requestToggle.addEventListener("click", function () {
        requestSection.classList.toggle("is-open");
        if (requestSection.classList.contains("is-open")) {
          var firstInput = requestSection.querySelector("input");
          if (firstInput) firstInput.focus();
        }
      });

      codeForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        var submitButton = codeForm.querySelector("button[type=submit]");
        if (submitButton.disabled) return;
        submitButton.disabled = true;
        message.className = "amg-message";
        message.textContent = labels.checkingCode;

        try {
          await api("/api/map-access.php", {
            method: "POST",
            body: JSON.stringify({ code: codeForm.code.value })
          });
          message.className = "amg-message amg-success";
          message.textContent = labels.accessGranted;
          window.__arteniaPrivateAccessGranted = true;
          window.location.reload();
        } catch (error) {
          message.textContent = error && error.message ? error.message : labels.invalidCode;
          submitButton.disabled = false;
          codeForm.code.focus();
          codeForm.code.select();
        }
      });

      var requestSubmitting = false;
      requestForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        var submitButton = requestForm.querySelector("button[type=submit]");
        if (requestSubmitting || submitButton.disabled) return;
        requestSubmitting = true;
        submitButton.disabled = true;
        message.className = "amg-message";
        message.textContent = labels.sendingRequest;

        try {
          var result = await api("/api/access-request.php", {
            method: "POST",
            body: JSON.stringify({
              name: requestForm.name.value,
              email: requestForm.email.value,
              reason: requestForm.reason.value
            })
          });
          requestForm.reset();
          requestSection.classList.remove("is-open");
          message.className = "amg-message amg-success";
          message.textContent = result.message || labels.requestSentSuccess;
        } catch (error) {
          message.textContent = error && error.message ? error.message : labels.requestFailed;
        } finally {
          requestSubmitting = false;
          submitButton.disabled = false;
        }
      });
    });
  }

  window.arteniaMapGate = {
    check: async function () {
      var pathname = String(window.location.pathname || "").replace(/\/+$/, "") || "/";
      if (pathname === "/historias/con-alma-design") {
        return true;
      }

      try {
        var result = await api("/api/map-access.php", { method: "GET" });
        if (result && result.allowed) {
          return true;
        }
        renderGate(Boolean(result && result.configured));
        return false;
      } catch (_) {
        renderGate(false);
        return false;
      }
    }
  };
})();
