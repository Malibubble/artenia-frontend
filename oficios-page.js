(function () {
  "use strict";

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function normalizeText(value) {
    return String(value == null ? "" : value).trim();
  }

  function slugify(value) {
    var text = normalizeText(value).toLowerCase();
    var map = {
      "a": /[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5]/g,
      "e": /[\u00e8\u00e9\u00ea\u00eb]/g,
      "i": /[\u00ec\u00ed\u00ee\u00ef]/g,
      "o": /[\u00f2\u00f3\u00f4\u00f5\u00f6]/g,
      "u": /[\u00f9\u00fa\u00fb\u00fc]/g,
      "n": /\u00f1/g,
      "c": /\u00e7/g
    };

    Object.keys(map).forEach(function (letter) {
      text = text.replace(map[letter], letter);
    });

    text = text.replace(/[^a-z0-9]+/g, "-");
    text = text.replace(/^-+|-+$/g, "");
    return text;
  }

  function ensureStyle() {
    if (document.getElementById("oficios-page-style")) return;

    var style = document.createElement("style");
    style.id = "oficios-page-style";
    style.textContent = [
      ".of-shell{position:relative;overflow:clip;color:#eaf6f8;background:radial-gradient(circle at 16% 2%,rgba(95,206,226,.16),transparent 28%),radial-gradient(circle at 88% 8%,rgba(22,96,112,.2),transparent 24%),radial-gradient(circle at 46% 120%,rgba(18,62,75,.35),transparent 30%),linear-gradient(180deg,#02090c 0%,#031116 54%,#020d11 100%)}",
      ".of-shell:before,.of-shell:after{content:\"\";position:absolute;pointer-events:none}",
      ".of-shell:before{inset:0;background:repeating-linear-gradient(115deg,rgba(255,255,255,.015) 0 2px,transparent 2px 56px);mix-blend-mode:soft-light;opacity:.38}",
      ".of-shell:after{inset:-30% -14% auto auto;width:52vw;height:52vw;border-radius:999px;background:radial-gradient(circle,rgba(127,233,246,.12),transparent 66%);filter:blur(8px)}",
      ".of-wrap{position:relative;z-index:1;max-width:1480px;margin:0 auto;padding:20px 18px 88px}",
      ".of-topbar{position:sticky;top:12px;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:24px;padding:14px 16px;border-radius:24px;background:rgba(3,17,23,.82);backdrop-filter:blur(20px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08),0 14px 36px rgba(0,0,0,.22)}",
      ".of-brand{display:flex;align-items:center;gap:12px;min-width:0;text-decoration:none;color:#effcff}",
      ".of-brand-mark{width:40px;height:40px;display:grid;place-items:center;overflow:hidden;border-radius:13px;background:rgba(255,255,255,.04);box-shadow:0 0 0 1px rgba(255,255,255,.12),0 16px 30px rgba(0,0,0,.22)}",
      ".of-brand-mark img{display:block;width:100%;height:100%;object-fit:contain}",
      ".of-brand-copy{min-width:0}",
      ".of-brand-copy strong{display:block;font-size:12px;letter-spacing:.24em;text-transform:uppercase}",
      ".of-brand-copy span{display:block;margin-top:2px;color:rgba(234,246,248,.72);font-size:12px}",
      ".of-nav{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end}",
      ".of-nav a{display:inline-flex;align-items:center;min-height:34px;padding:8px 12px;border-radius:999px;background:rgba(255,255,255,.03);color:#dff8fb;text-decoration:none;font-size:12px;letter-spacing:.02em;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)}",
      ".of-nav a:hover,.of-nav a:focus-visible{background:rgba(126,232,244,.1);outline:none}",
      ".of-panel{position:relative;padding:28px 0 0}",
      ".of-kicker{margin:0 0 10px;color:#95ebf4;font-size:11px;text-transform:uppercase;letter-spacing:.22em;font-weight:800}",
      ".of-title{margin:0;font-size:clamp(38px,6vw,78px);line-height:.94;letter-spacing:-.05em;max-width:12ch}",
      ".of-hero{position:relative;display:flex;align-items:flex-end;min-height:clamp(72vh,80vh,84vh);padding:34px;border-radius:34px;overflow:hidden;background:linear-gradient(180deg,rgba(2,9,12,.12) 0%,rgba(2,9,12,.3) 42%,rgba(2,9,12,.94) 100%),url('/artenia-oficio-vivo.avif') center 38%/cover no-repeat,#061319}",
      ".of-hero:before{content:\"\";position:absolute;inset:-15%;background:radial-gradient(circle at 18% 16%,rgba(126,232,244,.14),transparent 22%),radial-gradient(circle at 84% 58%,rgba(153,141,98,.1),transparent 22%);mix-blend-mode:screen;filter:blur(2px);opacity:.7}",
      ".of-hero:after{content:\"\";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.08) 0%,rgba(0,0,0,.58) 88%),radial-gradient(circle at 56% 74%,transparent 0 36%,rgba(0,0,0,.66) 100%)}",
      ".of-hero-copy{position:relative;z-index:1;display:flex;flex-direction:column;justify-content:flex-end;max-width:860px;margin-top:auto;padding:6px 0 0}",
      ".of-sub{max-width:18ch;margin:18px 0 0;color:rgba(234,246,248,.82);font-size:clamp(18px,2vw,24px);line-height:1.18;letter-spacing:-.02em}",
      ".of-hero-cta{display:inline-flex;align-items:center;gap:10px;width:max-content;margin-top:32px;padding:12px 18px;border-radius:999px;background:rgba(126,232,244,.1);color:#effcff;text-decoration:none;font-size:13px;font-weight:800;letter-spacing:.06em;box-shadow:inset 0 0 0 1px rgba(126,232,244,.3);backdrop-filter:blur(12px)}",
      ".of-hero-cta:hover,.of-hero-cta:focus-visible{background:rgba(126,232,244,.18);outline:none;transform:translateY(-1px)}",
      ".of-section{position:relative;margin-top:72px;padding-top:18px}",
      ".of-section:before{content:\"\";position:absolute;left:0;right:0;top:0;height:1px;background:linear-gradient(90deg,rgba(126,232,244,.28),rgba(126,232,244,.04) 62%,transparent)}",
      ".of-section-head{display:flex;justify-content:space-between;align-items:end;gap:12px;margin-bottom:14px}",
      ".of-section-head p{margin:0;color:rgba(234,246,248,.62);font-size:13px;line-height:1.5;max-width:52ch}",
      ".of-rail{position:relative}",
      ".of-rail-track{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(320px,36vw);gap:16px;overflow-x:auto;overflow-y:hidden;padding-bottom:10px;scroll-snap-type:x mandatory;scrollbar-width:thin;scrollbar-color:rgba(126,232,244,.4) transparent;-webkit-overflow-scrolling:touch}",
      ".of-rail-track > *{scroll-snap-align:start;scroll-snap-stop:always}",
      ".of-rail-track::-webkit-scrollbar{height:10px}",
      ".of-rail-track::-webkit-scrollbar-thumb{background:rgba(126,232,244,.34);border-radius:999px}",
      ".of-rail-track::-webkit-scrollbar-track{background:transparent}",
      ".of-series-card{position:relative;display:flex;align-items:flex-end;min-height:460px;padding:20px;border-radius:28px;overflow:hidden;text-decoration:none;color:inherit;background:linear-gradient(160deg,#061319,#0a2128);box-shadow:0 34px 56px rgba(0,0,0,.32),inset 0 0 0 1px rgba(126,232,244,.08);transition:transform .28s ease,box-shadow .28s ease,filter .28s ease;will-change:transform}",
      ".of-series-card:hover,.of-series-card:focus-visible{transform:translateY(-8px) translateZ(0);box-shadow:0 48px 80px rgba(0,0,0,.48),inset 0 0 0 1px rgba(126,232,244,.14);outline:none;filter:drop-shadow(0 0 20px rgba(126,232,244,.12))}",
      ".of-series-bg{position:absolute;inset:0;background-size:cover;background-position:center center;transform:scale(1.02);transition:transform .5s cubic-bezier(.16,.1,.3,1),filter .5s ease;filter:saturate(.85) contrast(1.08) brightness(.76)}",
      ".of-series-card:hover .of-series-bg,.of-series-card:focus-visible .of-series-bg{transform:scale(1.1) translateZ(0);filter:saturate(1.05) contrast(1.12) brightness(.88)}",
      ".of-series-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(2,7,10,.08) 16%,rgba(2,8,10,.62) 68%,rgba(2,8,10,.92) 100%)}",
      ".of-series-meta{position:relative;z-index:1;display:block}",
      ".of-series-kicker{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;background:rgba(11,31,38,.58);box-shadow:inset 0 0 0 1px rgba(255,255,255,.12);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#9beff8}",
      ".of-series-title{display:block;margin-top:12px;font-size:clamp(26px,2.6vw,36px);line-height:1.02;letter-spacing:-.03em;max-width:13ch}",
      ".of-series-credit{display:block;margin-top:12px;color:rgba(234,246,248,.7);font-size:11px;line-height:1.35;max-width:42ch;text-decoration:none}",
      ".of-rail-cue{display:flex;align-items:center;justify-content:flex-end;gap:8px;margin:8px 2px 0;color:rgba(234,246,248,.58);font-size:11px;letter-spacing:.12em;text-transform:uppercase}",
      ".of-series-discover{position:absolute;right:18px;bottom:16px;z-index:2;opacity:0;transform:translateY(6px);transition:opacity .24s ease,transform .24s ease;padding:9px 12px;border-radius:999px;background:rgba(126,232,244,.16);box-shadow:inset 0 0 0 1px rgba(126,232,244,.36);font-size:12px;font-weight:700}",
      ".of-series-card:hover .of-series-discover,.of-series-card:focus-visible .of-series-discover{opacity:1;transform:translateY(0)}",
      ".of-series-card.is-static,.of-insight-card.is-static{cursor:default}",
      ".of-series-card.is-static:hover,.of-series-card.is-static:focus-visible,.of-insight-card.is-static:hover{transform:none}",
      ".of-routes{margin-top:42px}",
      ".of-route-card{position:relative;display:flex;align-items:flex-end;min-height:280px;padding:18px;border-radius:24px;overflow:hidden;text-decoration:none;color:inherit;background:linear-gradient(160deg,#061218,#0b2129);box-shadow:0 24px 44px rgba(0,0,0,.28);transition:transform .22s ease}",
      ".of-route-card:hover,.of-route-card:focus-visible{transform:translateY(-5px);outline:none}",
      ".of-route-bg{position:absolute;inset:0;background-size:cover;background-position:center;filter:brightness(.62) contrast(1.08)}",
      ".of-route-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(3,9,13,.24) 30%,rgba(3,9,13,.85) 100%)}",
      ".of-route-meta{position:relative;z-index:1}",
      ".of-route-meta h3{margin:0;font-size:28px;line-height:1.05;letter-spacing:-.03em}",
      ".of-route-meta p{margin:8px 0 0;color:rgba(234,246,248,.72);font-size:13px;max-width:30ch}",
      ".of-grid-title{display:flex;align-items:end;justify-content:space-between;gap:12px;margin-bottom:14px}",
      ".of-grid-title p{margin:0;color:rgba(234,246,248,.62);font-size:13px;line-height:1.5;max-width:44ch}",
      ".of-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}",
      ".of-card{position:relative;display:flex;flex-direction:column;justify-content:space-between;min-height:210px;padding:16px;border-radius:22px;background:rgba(10,24,30,.85);box-shadow:inset 0 0 0 1px rgba(255,255,255,.06),0 2px 8px rgba(0,0,0,.12);backdrop-filter:blur(4px);transition:background .24s ease,box-shadow .24s ease}",
      ".of-card:hover{box-shadow:inset 0 0 0 1px rgba(126,232,244,.15),0 6px 16px rgba(126,232,244,.1);background:rgba(12,28,35,.92)}",
      ".of-card h3{margin:0 0 8px;font-size:18px;line-height:1.2}",
      ".of-muted{margin:0;color:rgba(255,255,255,.72);font-size:13px;line-height:1.45}",
      ".of-btn{display:inline-flex;align-items:center;gap:8px;margin-top:12px;padding:8px 12px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(126,232,244,.45);color:#7ee8f4;text-decoration:none;font-size:12px;font-weight:700;width:max-content}",
      ".of-btn:hover,.of-btn:focus-visible{background:rgba(126,232,244,.12);outline:none}",
      ".of-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:18px 0}",
      ".of-stat{padding:10px 12px;border-radius:12px;background:rgba(8,32,44,.62);border:1px solid rgba(255,255,255,.1)}",
      ".of-stat strong{display:block;font-size:12px;color:#9cc4d1;text-transform:uppercase;letter-spacing:.08em}",
      ".of-stat span{display:block;margin-top:4px;font-size:15px}",
      ".of-insights{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-top:20px}",
      ".of-insight-card{position:relative;display:flex;flex-direction:column;justify-content:space-between;min-height:260px;padding:24px;border-radius:24px;background:linear-gradient(135deg,rgba(12,28,35,.6),rgba(8,22,28,.5)),radial-gradient(ellipse at 80% 20%,rgba(126,232,244,.06),transparent 50%);border:1px solid rgba(126,232,244,.12);text-decoration:none;color:inherit;backdrop-filter:blur(8px);transition:all .28s cubic-bezier(.16,.1,.3,1);overflow:hidden}",
      ".of-insight-card:before{content:\"\";position:absolute;inset:0;background:linear-gradient(135deg,rgba(126,232,244,.0) 0%,rgba(126,232,244,.08) 100%);opacity:0;transition:opacity .28s ease;pointer-events:none}",
      ".of-insight-card:hover,.of-insight-card:focus-visible{transform:translateY(-8px);border-color:rgba(126,232,244,.24);box-shadow:0 12px 28px rgba(126,232,244,.1),inset 0 0 0 1px rgba(126,232,244,.16);outline:none}",
      ".of-insight-card:hover:before{opacity:1}",
      ".of-insight-header{position:relative;z-index:1;margin-bottom:16px}",
      ".of-insight-header h3{margin:0 0 6px;font-size:clamp(20px,2.2vw,28px);line-height:1.1;letter-spacing:-.02em}",
      ".of-insight-sub{margin:0;color:#95ebf4;font-size:12px;text-transform:uppercase;letter-spacing:.12em;font-weight:700}",
      ".of-insight-arrow{position:relative;z-index:1;display:inline-block;margin-top:16px;color:#7ee8f4;font-weight:800;transition:transform .28s ease;transform:translateX(0)}",
      ".of-insight-card:hover .of-insight-arrow{transform:translateX(4px)}",
      ".of-breadcrumb{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 14px;font-size:12px;color:#9cc4d1}",
      ".of-breadcrumb a{color:#7ee8f4;text-decoration:none}",
      ".of-related{margin-top:24px}",
      ".of-related ul{margin:14px 0 0;padding-left:18px}",
      ".of-related li{margin:6px 0}",
      ".of-archive{margin-top:112px;padding:28px;border-radius:28px;background:rgba(2,11,14,.2);border:1px solid rgba(126,232,244,.07)}",
      ".of-archive-toggle{display:flex;width:100%;justify-content:space-between;align-items:center;gap:18px;padding:16px;background:rgba(3,17,23,.4);color:inherit;text-align:left;font:inherit;border-radius:16px;cursor:pointer;user-select:none;border:1px solid rgba(255,255,255,.06);transition:background .24s ease,border-color .24s ease}",
      ".of-archive-toggle:hover,.of-archive-toggle:focus-visible{background:rgba(3,17,23,.55);border-color:rgba(126,232,244,.18);outline:none}",
      ".of-archive-label{color:#7ee8f4;font-size:12px;font-weight:700;white-space:nowrap}",
      ".of-archive-content{padding-top:18px}",
      ".of-archive-content[hidden]{display:none}",
      ".of-archive-note{margin:0 0 20px;color:rgba(234,246,248,.62);font-size:13px;line-height:1.5}",
      "@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}",
      ".of-final-head{display:flex;justify-content:space-between;gap:12px;align-items:end;margin-bottom:16px}",
      ".of-final-head p{margin:0;color:rgba(234,246,248,.54);font-size:13px;line-height:1.5;max-width:52ch}",
      ".of-empty{padding:18px;border-radius:18px;background:rgba(255,255,255,.04);border:1px dashed rgba(255,255,255,.12);color:rgba(234,246,248,.7)}",
      ".of-detail-block{margin-top:20px;padding:18px;border-radius:24px;border:1px solid rgba(255,255,255,.08);background:rgba(4,18,22,.72)}",
      ".of-capsule{display:inline-flex;align-items:center;gap:8px;padding:7px 10px;border-radius:999px;background:rgba(126,232,244,.1);color:#92f1fa;font-size:11px;letter-spacing:.16em;text-transform:uppercase}",
      "@media (max-width:1100px){.of-rail-track{grid-auto-columns:minmax(280px,52vw)}.of-series-card{min-height:420px}}",
      "@media (max-width:760px){.of-wrap{padding:14px 12px 62px}.of-topbar{top:8px;align-items:flex-start;flex-wrap:wrap;padding:12px;border-radius:20px}.of-brand-copy span{display:none}.of-nav{width:100%;justify-content:flex-start;flex-wrap:nowrap;overflow-x:auto;padding-bottom:2px}.of-hero{min-height:68vh;padding:24px 20px;border-radius:24px}.of-title{max-width:100%}.of-sub{font-size:16px}.of-rail-track{grid-auto-columns:minmax(82vw,1fr);scroll-padding-inline:2px}.of-series-card{min-height:400px;border-radius:24px}.of-series-meta{padding-bottom:42px}.of-section-head,.of-grid-title,.of-final-head{flex-direction:column;align-items:flex-start}.of-insights{grid-template-columns:1fr;gap:12px}.of-insight-card{min-height:190px}.of-archive{margin-top:82px;padding:14px}.of-archive-toggle{padding:14px}.of-grid{grid-template-columns:1fr}}",
      "@media (hover:none),(pointer:coarse){.of-series-discover{opacity:1;transform:none}.of-rail-track{scrollbar-width:auto}}",
      "@media (prefers-reduced-motion:reduce){.of-shell *{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}.of-series-card:hover,.of-series-card:focus-visible,.of-insight-card:hover,.of-insight-card:focus-visible{transform:none}.of-series-card:hover .of-series-bg,.of-series-card:focus-visible .of-series-bg{transform:scale(1.02)}}"
    ].join("");

    document.head.appendChild(style);
  }

  function fetchJson(url) {
    return fetch(url, { credentials: "same-origin" }).then(function (response) {
      if (!response.ok) {
        throw new Error("No se pudo cargar " + url);
      }
      return response.json();
    });
  }

  function toArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function toTextList(values) {
    var list = toArray(values).map(function (item) {
      return normalizeText(item);
    }).filter(Boolean);
    return list.join(" · ");
  }

  function pickBest(row, keys) {
    for (var i = 0; i < keys.length; i += 1) {
      var value = normalizeText(row[keys[i]]);
      if (value) return value;
    }
    return "";
  }

  function formatCategory(value) {
    var text = normalizeText(value);
    return text || "Sin categoria";
  }

  function getMenuLinks() {
    return [
      { label: "Inicio", href: "/" },
      { label: "Mapa", href: "/mapa" },
      { label: "Oficios", href: "/oficios" },
      { label: "Historias", href: "/historias" }
    ];
  }

  function buildMenuHtml() {
    return [
      '<header class="of-topbar">',
      '<a class="of-brand" href="/">',
      '<span class="of-brand-mark" aria-hidden="true"><img src="/artenia-logo-192.png" alt="" loading="eager" decoding="async"></span>',
      '<span class="of-brand-copy"><strong>ARTENIA</strong><span>Universo de oficios, memoria y territorio</span></span>',
      '</a>',
      '<nav class="of-nav" aria-label="Menú principal">',
      getMenuLinks().map(function (item) {
        return '<a href="' + esc(item.href) + '">' + esc(item.label) + '</a>';
      }).join(""),
      '</nav>',
      '</header>'
    ].join("");
  }

  function getFeaturedStories() {
    return [
      { title: "Posidonia", kicker: "Serie 01", description: "Materia viva, litoral y trabajo que protege el borde entre mar y territorio.", slug: "posidonia" },
      { title: "Nevaters", kicker: "Serie 02", description: "Oficio de clima extremo, oficio de pausa y de resistencia silenciosa.", slug: "nevaters" },
      { title: "Esparto", kicker: "Serie 03", description: "Fibra seca, trenzado útil y una inteligencia antigua para construir con poco.", slug: "esparto" },
      { title: "Agranaor", kicker: "Serie 04", description: "Recogida, selección y oficio del detalle en la economía de manos.", slug: "agranaor" },
      { title: "Calero", kicker: "Serie 05", description: "Cal, fuego y materia mineral convertidos en abrigo, textura y arquitectura.", slug: "calero" },
      { title: "Salinero", kicker: "Serie 06", description: "Cristal, humedad y paciencia para ordenar el paisaje productivo.", slug: "salinero" },
      { title: "Caña", kicker: "Serie 07", description: "Ligereza, repetición y estructura hecha desde el gesto continuo.", slug: "cana" },
      { title: "Cestería", kicker: "Serie 08", description: "Entrelazado de utilidad y belleza para contener, transportar y habitar.", slug: "cesteria" },
      { title: "Redes y remiendo", kicker: "Serie 09", description: "Reparar es también crear continuidad, cuidado y conocimiento compartido.", slug: "redes-y-remiendo" },
      { title: "Piedra seca", kicker: "Serie 10", description: "Arquitectura sin mortero, equilibrio y memoria aplicada al territorio.", slug: "piedra-seca" }
    ];
  }

  function getStoryHistoricalMedia() {
    return {
      posidonia: {
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Posidonia_oceanica_%28L%29.jpg/1280px-Posidonia_oceanica_%28L%29.jpg",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Posidonia_oceanica_(L).jpg",
        archive: "Wikimedia Commons",
        author: "Frédéric Ducarme",
        license: "CC BY-SA 4.0"
      },
      nevaters: {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Y%C3%A1tova.%20Pozo%20de%20la%20Nieve%201.jpg?width=1280",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Y%C3%A1tova._Pozo_de_la_Nieve_1.jpg",
        archive: "Wikimedia Commons",
        author: "Joanbanjo",
        license: "CC BY-SA 3.0"
      },
      esparto: {
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Weaving_esparto.jpg/1920px-Weaving_esparto.jpg",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Weaving_esparto.jpg",
        archive: "Wikimedia Commons",
        author: "Panbujeros",
        license: "CC BY-SA 4.0"
      },
      agranaor: {
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Agranar_el_terrat.jpg/1280px-Agranar_el_terrat.jpg",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Agranar_el_terrat.jpg",
        archive: "Wikimedia Commons",
        author: "Carolina Latorre Canet",
        license: "CC BY-SA 3.0"
      },
      calero: {
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Historic_lime_kiln_on_Twiston_Lane_-_geograph.org.uk_-_8086395.jpg/1920px-Historic_lime_kiln_on_Twiston_Lane_-_geograph.org.uk_-_8086395.jpg",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Historic_lime_kiln_on_Twiston_Lane_-_geograph.org.uk_-_8086395.jpg",
        archive: "Geograph / Wikimedia Commons",
        author: "Kevin Waterhouse",
        license: "CC BY-SA 2.0"
      },
      salinero: {
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Photo_Aerial_view_of_the_salt_pans_of_Margherita_di_Savoia_1930_-_Touring_Club_Italiano_s05952-01.jpg",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Photo_Aerial_view_of_the_salt_pans_of_Margherita_di_Savoia_1930_-_Touring_Club_Italiano_s05952-01.jpg",
        archive: "Touring Club Italiano / Wikimedia Commons",
        author: "Unknown author",
        license: "CC BY-SA 4.0"
      },
      cana: {
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/WeavingReed2.JPG/1280px-WeavingReed2.JPG",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:WeavingReed2.JPG",
        archive: "Wikimedia Commons",
        author: "Loggie-log",
        license: "Public domain"
      },
      cesteria: {
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Close-up_of_a_basket_in_the_lap_of_an_Indian_woman_demonstrating_basket_weaving%2C_ca.1900_%28CHS-4802%29.jpg/1920px-Close-up_of_a_basket_in_the_lap_of_an_Indian_woman_demonstrating_basket_weaving%2C_ca.1900_%28CHS-4802%29.jpg",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Close-up_of_a_basket_in_the_lap_of_an_Indian_woman_demonstrating_basket_weaving,_ca.1900_(CHS-4802).jpg",
        archive: "California Historical Society / Wikimedia Commons",
        author: "C. C. Pierce",
        license: "Public domain"
      },
      "redes-y-remiendo": {
        imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/1904-10-09%2C%20El%20Gr%C3%A1fico%2C%20La%20pesca%20del%20bou%20en%20Valencia%2C%20Componiendo%20las%20redes%2C%20Repasando%20las%20velas.jpg?width=1280",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:1904-10-09,_El_Gr%C3%A1fico,_La_pesca_del_bou_en_Valencia,_Componiendo_las_redes,_Repasando_las_velas.jpg",
        archive: "Wikimedia Commons",
        author: "El Gráfico (1904)",
        license: "Public domain"
      },
      "piedra-seca": {
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6e/%22Ko%C4%8Da%22_v_zidu%2C_ki_obkro%C5%BEa_njivo_Franca_Stan%C4%8Di%C4%8Da%2C_%22v_Vali%22_1949.jpg",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:%22Ko%C4%8Da%22_v_zidu,_ki_obkro%C5%BEa_njivo_Franca_Stan%C4%8Di%C4%8Da,_%22v_Vali%22_1949.jpg",
        archive: "Slovenian Ethnographic Museum / Wikimedia Commons",
        author: "Milko Matičetov",
        license: "Public domain"
      }
    };
  }

  function safeSlugCandidate(value) {
    return slugify(value || "");
  }

  function resolveStoryCard(story, model) {
    var mediaMap = getStoryHistoricalMedia();
    var candidate = safeSlugCandidate(story.slug || story.title);
    var targetMap = {
      esparto: "espartero-espartera",
      cana: "fabricante-de-muebles-y-otros-objetos-de-mimbre-cana-palma-y-similares",
      cesteria: "fabricante-de-muebles-y-otros-objetos-de-mimbre-cana-palma-y-similares",
      "redes-y-remiendo": "cordelero-y-redero-cordelera-y-redera"
    };
    var targetSlug = targetMap[candidate] || candidate;
    var item = model.bySlug.get(targetSlug) || model.bySlug.get(candidate) || null;
    var categoryExists = Array.isArray(model.byCategory[targetSlug]) && model.byCategory[targetSlug].length > 0;
    return {
      title: story.title,
      kicker: story.kicker,
      description: story.description,
      slug: item ? item.slug : candidate,
      item: item,
      href: item ? "/oficios/" + item.slug : (categoryExists ? "/oficios/" + targetSlug : ""),
      media: mediaMap[candidate] || null
    };
  }

  function getStoryMediaBySlug(slug) {
    if (!slug) return null;
    return getStoryHistoricalMedia()[slug] || null;
  }

  function buildHeroSection() {
    return [
      '<section class="of-hero">',
      '<div class="of-hero-copy">',
      '<p class="of-kicker">Oficios</p>',
      '<h1 class="of-title">Entra en el universo de los oficios</h1>',
      '<p class="of-sub">Conocimiento recuperado del pasado. Reimaginado para el futuro.</p>',
      '<a class="of-hero-cta" href="#universos-de-oficio">Explorar oficios →</a>',
      '</div>',
      '</section>'
    ].join("");
  }

  function buildStoryRail(model) {
    var stories = getFeaturedStories().map(function (story) {
      return resolveStoryCard(story, model);
    });

    return [
      '<section class="of-section" id="universos-de-oficio">',
      '<div class="of-section-head">',
      '<div>',
      '<p class="of-kicker">Universos de oficio</p>',
      '<h2 class="of-title" style="font-size:clamp(28px,4vw,44px);max-width:14ch">Diez mundos para descubrir</h2>',
      '</div>',
      '<p>Historias cinematográficas. Archivo + oficio + territorio. Desliza para explorar.</p>',
      '</div>',
      '<div class="of-rail">',
      '<div class="of-rail-track" aria-label="Universos de oficio destacados">',
      stories.map(function (story) {
        var media = story.media;
        var bg = media && media.imageUrl ? media.imageUrl : 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Nevero_menejador.jpg/1280px-Nevero_menejador.jpg';
        var credit = media && media.sourceUrl && media.author && media.author !== 'Unknown author' && media.license
          ? '<small class="of-series-credit">' + esc(media.author + ' · ' + media.license) + '</small>'
          : '';
        var openTag = story.href
          ? '<a class="of-series-card" href="' + esc(story.href) + '">'
          : '<article class="of-series-card is-static">';
        var closeTag = story.href ? '</a>' : '</article>';
        return [
          openTag,
          '<span class="of-series-bg" style="background-image:url(\'' + esc(bg) + '\')" aria-hidden="true"></span>',
          '<span class="of-series-shade" aria-hidden="true"></span>',
          '<span class="of-series-meta">',
          '<span class="of-series-kicker">' + esc(story.kicker) + '</span>',
          '<strong class="of-series-title">' + esc(story.title) + '</strong>',
          credit,
          '</span>',
          story.href ? '<span class="of-series-discover">Descubrir →</span>' : '',
          closeTag
        ].join("");
      }).join(""),
      '</div>',
      '<p class="of-rail-cue" aria-hidden="true">Desliza para continuar&nbsp; →</p>',
      '</div>',
      '</section>'
    ].join("");
  }

  function getRouteCards() {
    return [
      {
        title: "Rutas de oficio",
        subtitle: "Recorridos entre talleres, patrimonio material y memoria local.",
        href: "/rutas",
        bg: "linear-gradient(160deg,rgba(7,26,34,.9),rgba(5,14,18,.92)),radial-gradient(circle at 78% 22%,rgba(126,232,244,.36),transparent 24%),radial-gradient(circle at 20% 84%,rgba(212,164,89,.22),transparent 28%)"
      },
      {
        title: "Territorio vivo",
        subtitle: "Geografías artesanas, oficios en contexto y paisaje cultural.",
        href: "/territorios",
        bg: "linear-gradient(160deg,rgba(10,28,20,.9),rgba(5,15,14,.92)),radial-gradient(circle at 70% 16%,rgba(102,174,139,.34),transparent 26%),radial-gradient(circle at 24% 84%,rgba(126,232,244,.2),transparent 28%)"
      },
      {
        title: "Cartografía patrimonial",
        subtitle: "Del archivo al mapa: vínculos entre oficio, tiempo y lugar.",
        href: "/mapa",
        bg: "linear-gradient(160deg,rgba(24,17,11,.9),rgba(14,12,8,.9)),radial-gradient(circle at 65% 22%,rgba(224,178,98,.26),transparent 24%),radial-gradient(circle at 18% 80%,rgba(126,232,244,.2),transparent 26%)"
      }
    ];
  }

  function buildRoutesRail() {
    var routes = getRouteCards();
    return [
      '<section class="of-section of-routes">',
      '<div class="of-section-head">',
      '<div>',
      '<p class="of-kicker">Rutas relacionadas</p>',
      '<h2 class="of-title" style="font-size:clamp(28px,4vw,44px);max-width:15ch">Oficios, territorio y patrimonio</h2>',
      '</div>',
      '<p>Conexiones editoriales para seguir el oficio fuera de la ficha.</p>',
      '</div>',
      '<div class="of-rail-track" aria-label="Rutas relacionadas">',
      routes.map(function (route) {
        return [
          '<a class="of-route-card" href="' + esc(route.href) + '">',
          '<span class="of-route-bg" style="background:' + esc(route.bg) + '" aria-hidden="true"></span>',
          '<span class="of-route-overlay" aria-hidden="true"></span>',
          '<span class="of-route-meta">',
          '<h3>' + esc(route.title) + '</h3>',
          '<p>' + esc(route.subtitle) + '</p>',
          '</span>',
          '</a>'
        ].join("");
      }).join(""),
      '</div>',
      '</section>'
    ].join("");
  }

  function buildInsightsSection(model) {
    var insights = [
      { title: "Construir sin cemento", subtitle: "Piedra seca", slug: "piedra-seca" },
      { title: "Aislar con fibras locales", subtitle: "Esparto", slug: "espartero-espartera" },
      { title: "Construir respirando", subtitle: "Cal", slug: "calero" },
      { title: "Trabajar con materiales renovables", subtitle: "Cestería", slug: "fabricante-de-muebles-y-otros-objetos-de-mimbre-cana-palma-y-similares" }
    ];

    return [
      '<section class="of-section" id="saberes-necesarios">',
      '<div class="of-section-head">',
      '<div>',
      '<p class="of-kicker">Futuro posible</p>',
      '<h2 class="of-title" style="font-size:clamp(28px,4vw,44px);max-width:14ch">Saberes que podríamos necesitar de nuevo</h2>',
      '</div>',
      '<p>Conocimiento antiguo. Problemas actuales.</p>',
      '</div>',
      '<div class="of-insights">',
      insights.map(function (insight) {
        var item = model.bySlug.get(insight.slug);
        var categoryExists = Array.isArray(model.byCategory[insight.slug]) && model.byCategory[insight.slug].length > 0;
        var href = item ? '/oficios/' + item.slug : (categoryExists ? '/oficios/' + insight.slug : '');
        var openTag = href ? '<a class="of-insight-card" href="' + esc(href) + '">' : '<article class="of-insight-card is-static">';
        var closeTag = href ? '</a>' : '</article>';
        return [
          openTag,
          '<div class="of-insight-header">',
          '<h3>' + esc(insight.title) + '</h3>',
          '<p class="of-insight-sub">' + esc(insight.subtitle) + '</p>',
          '</div>',
          href ? '<span class="of-insight-arrow">→</span>' : '',
          closeTag
        ].join("");
      }).join(""),
      '</div>',
      '</section>'
    ].join("");
  }

  function buildArchiveSection(model) {
    var html = [
      '<section class="of-archive" id="archivo-oficial">',
      '<button type="button" class="of-archive-toggle" aria-expanded="false" aria-controls="oficios-archive-content">',
      '<div>',
      '<p class="of-kicker" style="margin-bottom:6px">Archivo completo</p>',
      '<h2 class="of-title" style="font-size:clamp(20px,3vw,28px);max-width:12ch">Catálogo de todos los oficios</h2>',
      '</div>',
      '<span class="of-archive-label">Explorar archivo ↓</span>',
      '</button>',
      '<div class="of-archive-content" id="oficios-archive-content" hidden>',
      '<p class="of-archive-note">Índice documental completo de oficios registrados. Este archivo se mantiene accesible pero en segundo plano.</p>',
      '<div class="of-grid">',
      model.items.map(function (item) {
        return [
          '<article class="of-card">',
          '<div>',
          '<span class="of-capsule">' + esc(item.categoryLabel) + '</span>',
          '<h3>' + esc(item.name) + '</h3>',
          '<p class="of-muted">' + esc((item.activeWorkshops || 0) + ' activos · ' + (item.totalWorkshops || 0) + ' total · ' + (item.municipalitiesCount || 0) + ' municipios') + '</p>',
          '</div>',
          '<a class="of-btn" href="/oficios/' + esc(item.slug) + '">Ver ficha de oficio</a>',
          '</article>'
        ].join("");
      }).join(""),
      '</div>',
      '</div>',
      '</section>'
    ].join("");
    return html;
  }

  function wrapPage(innerHtml) {
    return [
      '<main class="of-shell">',
      '<div class="of-wrap">',
      buildMenuHtml(),
      '<div class="of-panel">',
      innerHtml,
      '</div>',
      '</div>',
      '</main>'
    ].join("");
  }

  function buildCraftModel(cvRows, mapRows) {
    var mapById = new Map();
    var mapBySlug = new Map();
    var categoryRows = {};

    toArray(mapRows).forEach(function (row) {
      var id = normalizeText(row.id_oficio);
      var name = pickBest(row, ["nombre_oficio", "oficio"]);
      var slug = slugify(name);
      var category = slugify(pickBest(row, ["categoria"]));
      if (id) mapById.set(id, row);
      if (slug) mapBySlug.set(slug, row);
      if (category) {
        if (!categoryRows[category]) categoryRows[category] = [];
        categoryRows[category].push(row);
      }
    });

    var items = [];
    toArray(cvRows).forEach(function (row) {
      var name = pickBest(row, ["nombre_oficio", "oficio"]);
      if (!name) return;

      var id = normalizeText(row.id_oficio);
      var category = pickBest(row, ["categoria"]);
      var slug = slugify(name);
      var mapRow = (id && mapById.get(id)) || mapBySlug.get(slug) || null;
      var municipios = mapRow ? toArray(mapRow.municipios) : [];

      var item = {
        id: id,
        slug: slug,
        name: name,
        categoryLabel: formatCategory(category || (mapRow && mapRow.categoria) || ""),
        categorySlug: slugify(category || (mapRow && mapRow.categoria) || ""),
        source: pickBest(row, ["fuente_principal"]),
        risk: pickBest(row, ["nivel_riesgo"]),
        activeWorkshops: Number(row.talleres_activos || 0),
        totalWorkshops: Number(row.talleres_total || 0),
        status: pickBest(mapRow || {}, ["estado"]),
        activity: pickBest(mapRow || {}, ["nivel_actividad"]),
        municipalities: municipios,
        municipalitiesCount: Number((mapRow && mapRow.num_municipios) || municipios.length || 0)
      };

      if (!item.slug) return;
      items.push(item);
    });

    var bySlug = new Map();
    items.forEach(function (item) {
      bySlug.set(item.slug, item);
    });

    var byCategory = {};
    items.forEach(function (item) {
      if (!item.categorySlug) return;
      if (!byCategory[item.categorySlug]) byCategory[item.categorySlug] = [];
      byCategory[item.categorySlug].push(item);
    });

    Object.keys(byCategory).forEach(function (categorySlug) {
      byCategory[categorySlug].sort(function (a, b) {
        return a.name.localeCompare(b.name, "es");
      });
    });

    items.sort(function (a, b) {
      return a.name.localeCompare(b.name, "es");
    });

    var mapCategorySlugs = Object.keys(categoryRows);
    mapCategorySlugs.forEach(function (categorySlug) {
      if (!byCategory[categorySlug]) {
        byCategory[categorySlug] = [];
      }
    });

    return {
      items: items,
      bySlug: bySlug,
      byCategory: byCategory
    };
  }

  function buildRelatedMap(edges) {
    var relatedById = {};

    toArray(edges).forEach(function (edge) {
      var source = normalizeText(edge.source);
      var target = normalizeText(edge.target);
      if (!source || !target) return;

      if (!relatedById[source]) relatedById[source] = [];
      relatedById[source].push(edge);
    });

    return relatedById;
  }

  function detailStats(item) {
    var stats = [
      { label: "Categoria", value: item.categoryLabel },
      { label: "Nivel de riesgo", value: item.risk || "Sin dato" },
      { label: "Actividad", value: item.activity || item.status || "Sin dato" },
      { label: "Talleres", value: (Number.isFinite(item.activeWorkshops) ? item.activeWorkshops : 0) + " activos / " + (Number.isFinite(item.totalWorkshops) ? item.totalWorkshops : 0) + " total" },
      { label: "Municipios", value: String(item.municipalitiesCount || (item.municipalities && item.municipalities.length) || 0) }
    ];

    return '<div class="of-stats">' + stats.map(function (entry) {
      return '<div class="of-stat"><strong>' + esc(entry.label) + '</strong><span>' + esc(entry.value) + '</span></div>';
    }).join("") + "</div>";
  }

  function initArchiveToggle(root) {
    var toggle = root.querySelector(".of-archive-toggle");
    var content = root.querySelector("#oficios-archive-content");
    if (!toggle || !content) return;

    toggle.addEventListener("click", function () {
      var willOpen = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(willOpen));
      content.hidden = !willOpen;

      var label = toggle.querySelector(".of-archive-label");
      if (label) {
        label.textContent = willOpen ? "Cerrar archivo ↑" : "Explorar archivo ↓";
      }
    });
  }

  function renderListing(root, model) {
    root.innerHTML = wrapPage([
      buildHeroSection(),
      buildStoryRail(model),
      buildInsightsSection(model),
      buildArchiveSection(model)
    ].join(""));
    initArchiveToggle(root);
  }

  function renderRelated(item, model, relatedById) {
    var rows = item.id ? toArray(relatedById[item.id]) : [];
    if (!rows.length) return "";

    var seen = new Set();
    var links = [];

    rows.forEach(function (row) {
      var targetId = normalizeText(row.target);
      if (!targetId || seen.has(targetId)) return;
      seen.add(targetId);

      var related = model.items.find(function (entry) {
        return entry.id === targetId;
      });

      if (!related) return;
      links.push('<li><a class="of-btn" href="/oficios/' + esc(related.slug) + '">' + esc(related.name) + '</a></li>');
    });

    if (!links.length) return "";

    return [
      '<section class="of-related">',
      '<h2>Enlaces relacionados</h2>',
      '<p class="of-muted">Relaciones registradas en la red de oficios.</p>',
      '<ul>' + links.join("") + '</ul>',
      '</section>'
    ].join("");
  }

  function renderCategoryDetail(root, slug, items) {
    var total = items.length;
    var active = items.reduce(function (acc, item) {
      return acc + (Number.isFinite(item.activeWorkshops) ? item.activeWorkshops : 0);
    }, 0);

    root.innerHTML = wrapPage([
      '<section class="of-detail-block">',
      '<nav class="of-breadcrumb"><a href="/oficios">Oficios</a><span>/</span><span>' + esc(slug) + '</span></nav>',
      '<p class="of-kicker">Categoria</p>',
      '<h1 class="of-title">' + esc(slug) + '</h1>',
      '<p class="of-sub">Detalle agregado a partir de los oficios clasificados en esta categoria.</p>',
      '<div class="of-stats">',
      '<div class="of-stat"><strong>Oficios en categoria</strong><span>' + esc(total) + '</span></div>',
      '<div class="of-stat"><strong>Talleres activos</strong><span>' + esc(active) + '</span></div>',
      '</div>',
      '<div class="of-grid">',
      items.map(function (item) {
        return [
          '<article class="of-card">',
          '<h3>' + esc(item.name) + '</h3>',
          '<p class="of-muted">Talleres: ' + esc(item.activeWorkshops) + ' activos / ' + esc(item.totalWorkshops) + ' total</p>',
          '<p class="of-muted">Municipios: ' + esc(item.municipalitiesCount || 0) + '</p>',
          '<a class="of-btn" href="/oficios/' + esc(item.slug) + '">Ver ficha de oficio</a>',
          '</article>'
        ].join("");
      }).join(""),
      '</div>',
      '</section>'
    ].join(""));
  }

  function renderDetail(root, item, model, relatedById) {
    var municipalities = toTextList(item.municipalities);
    var storyMedia = getStoryMediaBySlug(item && item.slug);
    var storyMediaHtml = "";
    if (storyMedia) {
      var metaText = [storyMedia.archive, storyMedia.author, storyMedia.license].filter(Boolean).join(" · ");
      storyMediaHtml = '<p class="of-muted">Referencia historica: <a class="of-btn" style="margin-top:6px" href="' + esc(storyMedia.sourceUrl || "") + '" target="_blank" rel="noopener noreferrer">' + esc(metaText || "Fuente en Wikimedia Commons") + '</a></p>';
    }

    root.innerHTML = wrapPage([
      '<section class="of-detail-block">',
      '<nav class="of-breadcrumb"><a href="/oficios">Oficios</a><span>/</span><span>' + esc(item.name) + '</span></nav>',
      '<p class="of-kicker">Oficio</p>',
      '<h1 class="of-title">' + esc(item.name) + '</h1>',
      '<p class="of-sub">Datos del oficio segun la informacion publica de actividad, talleres y territorio disponible en ARTENIA.</p>',
      detailStats(item),
      '<section class="of-card">',
      '<h2>Contexto registrado</h2>',
      '<p class="of-muted">Categoria: ' + esc(item.categoryLabel) + '</p>',
      '<p class="of-muted">Estado de actividad: ' + esc(item.status || item.activity || "Sin dato") + '</p>',
      '<p class="of-muted">Municipios: ' + esc(municipalities || "Sin detalle territorial") + '</p>',
      '<p class="of-muted">Fuente: ' + esc(item.source || "Sin fuente publica") + '</p>',
      storyMediaHtml,
      '</section>',
      renderRelated(item, model, relatedById),
      '</section>'
    ].join(""));
  }

  function renderNotFound(root, slug) {
    root.innerHTML = wrapPage([
      '<section class="of-detail-block">',
      '<nav class="of-breadcrumb"><a href="/oficios">Oficios</a><span>/</span><span>' + esc(slug) + '</span></nav>',
      '<h1 class="of-title">Oficio no encontrado</h1>',
      '<p class="of-sub">No existe un oficio ni categoria registrada con ese slug.</p>',
      '</section>'
    ].join(""));
  }

  function buildAssociationSection(items) {
    var list = toArray(items);
    if (!list.length) return "";

    return [
      '<section id="apm-oficio-associations" class="of-related">',
      '<h2>Asociaciones promotoras</h2>',
      '<p class="of-muted">Entidades que protegen, representan, ensenan o impulsan este oficio en distintos territorios.</p>',
      '<div class="of-grid">',
      list.map(function (item) {
        var subtitle = [item.entity_type, item.municipality, item.province].filter(Boolean).join(" · ") || "Territorio sin detalle";
        return [
          '<article class="of-card">',
          '<h3>' + esc(item.short_name || item.official_name || "Asociacion") + '</h3>',
          '<p class="of-muted">' + esc(subtitle) + '</p>',
          '<p class="of-muted">Nivel: ' + esc(item.verification_level || "V1_SOURCE_FOUND") + '</p>',
          '<a class="of-btn" href="/asociaciones/' + esc(item.slug || "") + '">Ver ficha</a>',
          '</article>'
        ].join("");
      }).join(""),
      '</div>',
      '</section>'
    ].join("");
  }

  function appendAssociationBlock(root, slug) {
    var main = root.querySelector("main");
    if (!main || !slug || document.getElementById("apm-oficio-associations")) {
      return Promise.resolve();
    }

    return fetchJson("/api/promoter-associations.php?craft_id=" + encodeURIComponent(slug) + "&limit=40")
      .then(function (payload) {
        var html = buildAssociationSection(payload && payload.items);
        if (!html) return;
        main.insertAdjacentHTML("beforeend", html);
      })
      .catch(function () {
        // Silent fallback to avoid blocking oficio rendering.
      });
  }

  function getRouteSlug() {
    var match = String(window.location.pathname || "").match(/^\/oficios\/([a-z0-9-]+)\/?$/);
    return match ? match[1] : "";
  }

  function resolveSlugAliases(slug, model) {
    if (!slug) return slug;
    if (model.bySlug.has(slug)) return slug;

    var aliases = {
      ceramica: "ceramista"
    };

    return aliases[slug] && model.bySlug.has(aliases[slug]) ? aliases[slug] : slug;
  }

  function renderUniversePilot(root, rawSlug, model) {
    var catalog = window.ArteniaUniverseCatalog;
    var engine = window.ArteniaUniverseEngine;
    if (!catalog || typeof catalog.resolve !== "function" || !engine || typeof engine.render !== "function") {
      return false;
    }

    var config = catalog.resolve(rawSlug);
    if (!config) return false;

    var craftIds = new Set(toArray(config.craftIds));
    var crafts = model.items.filter(function (item) { return craftIds.has(item.id); });
    var municipalities = [];
    var seenMunicipalities = new Set();
    crafts.forEach(function (item) {
      toArray(item.municipalities).forEach(function (municipality) {
        var name = normalizeText(municipality);
        if (!name || seenMunicipalities.has(name)) return;
        seenMunicipalities.add(name);
        municipalities.push(name);
      });
    });

    engine.render(root, config, {
      craftNames: crafts.map(function (item) { return item.name; }),
      municipalities: municipalities,
      municipalityCount: municipalities.length
    });
    return true;
  }

  async function bootstrap() {
    if (!/^\/oficios(?:\/|$)/.test(window.location.pathname)) {
      return;
    }

    var root = document.getElementById("root");
    if (!root) return;

    ensureStyle();

    var payload = await Promise.all([
      fetchJson("/OFICIOS_CV_completo.json"),
      fetchJson("/OFICIOS_MAPA.json"),
      fetchJson("/RED_OFICIOS.json").catch(function () { return []; })
    ]);

    var model = buildCraftModel(payload[0], payload[1]);
    var relatedById = buildRelatedMap(payload[2]);
    var rawSlug = getRouteSlug();
    var slug = resolveSlugAliases(rawSlug, model);

    if (!slug) {
      renderListing(root, model);
      return;
    }

    if (renderUniversePilot(root, rawSlug, model)) {
      return;
    }

    var bySlug = model.bySlug.get(slug);
    if (bySlug) {
      renderDetail(root, bySlug, model, relatedById);
      appendAssociationBlock(root, rawSlug || bySlug.slug);
      return;
    }

    var byCategory = model.byCategory[slug];
    if (Array.isArray(byCategory) && byCategory.length) {
      renderCategoryDetail(root, slug, byCategory);
      appendAssociationBlock(root, rawSlug || slug);
      return;
    }

    renderNotFound(root, slug);
  }

  function bootWithErrorBoundary() {
    bootstrap().catch(function (error) {
      var root = document.getElementById("root");
      if (!root) return;
      ensureStyle();
      root.innerHTML = wrapPage('<section class="of-detail-block"><h1 class="of-title">No se pudo cargar la pagina de oficios</h1><p class="of-sub">' + esc(error && error.message ? error.message : "Error inesperado") + '</p></section>');
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootWithErrorBoundary, { once: true });
  } else {
    bootWithErrorBoundary();
  }
})();
