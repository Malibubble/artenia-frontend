(function () {
  "use strict";

  var HERO_IMAGES = [
    "/artenia-oficio-vivo.avif",
    "/artenia-manos-futuro.avif",
    "/artenia-artesano-humano.avif",
    "/artenia-memoria-digital.avif"
  ];

  var MATERIALS = [
    {
      name: "Piedra",
      eyebrow: "Construir con lo que el territorio entrega",
      copy: "Peso, forma, pendiente, gravedad y experiencia. La piedra no se impone: se lee.",
      image: HERO_IMAGES[0]
    },
    {
      name: "Arcilla",
      eyebrow: "La tierra que acepta la mano",
      copy: "Modelar, corregir, secar y atravesar el fuego. Una materia blanda que guarda memoria.",
      image: HERO_IMAGES[1]
    },
    {
      name: "Fibras",
      eyebrow: "Trenzar como forma de pensamiento",
      copy: "Esparto, palma, mimbre o lana: estructuras creadas por repetición, tensión y tiempo.",
      image: HERO_IMAGES[2]
    },
    {
      name: "Agua · sal · nieve",
      eyebrow: "Trabajar con lo que cambia",
      copy: "Evaporar, conservar, conducir, esperar. Oficios nacidos de observar ciclos antes de controlarlos.",
      image: HERO_IMAGES[3]
    },
    {
      name: "Metal",
      eyebrow: "Fuego, extracción y precisión",
      copy: "Dominar temperatura, herramientas y error hasta convertir la materia en continuidad útil.",
      image: HERO_IMAGES[0]
    }
  ];

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }
    callback();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function fetchJson(url) {
    return fetch(url, { credentials: "same-origin" }).then(function (response) {
      if (!response.ok) throw new Error("Request failed");
      return response.json();
    });
  }

  function buildTerritoriesFromMapData(entries) {
    var bucket = new Map();

    (Array.isArray(entries) ? entries : []).forEach(function (item) {
      var oficio = String(item && (item.nombre_oficio || item.oficio) || "").trim();
      var categoria = String(item && item.categoria || "").trim();
      var municipios = Array.isArray(item && item.municipios) ? item.municipios.filter(Boolean) : [];

      municipios.forEach(function (municipio) {
        var name = String(municipio || "").trim();
        var key = slugify(name);
        if (!key) return;

        if (!bucket.has(key)) {
          bucket.set(key, { key: key, name: name, oficios: new Set(), categorias: new Set() });
        }

        var territory = bucket.get(key);
        if (oficio) territory.oficios.add(oficio);
        if (categoria) territory.categorias.add(categoria);
      });
    });

    return Array.from(bucket.values())
      .map(function (entry) {
        return {
          key: entry.key,
          name: entry.name,
          oficios: Array.from(entry.oficios),
          categorias: Array.from(entry.categorias)
        };
      })
      .sort(function (a, b) {
        return b.oficios.length - a.oficios.length;
      });
  }

  function mountStyles() {
    if (document.getElementById("territorios-style")) return;

    var style = document.createElement("style");
    style.id = "territorios-style";
    style.textContent = [
      ":root{--tr-bg:#02090c;--tr-text:#eef9fa;--tr-muted:rgba(238,249,250,.68);--tr-line:rgba(238,249,250,.13);--tr-accent:#8ee8ef}",
      "body[data-page='territorios-page']{margin:0;background:var(--tr-bg);color:var(--tr-text);font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif}",
      "#seo-indexable-content{display:none!important}",
      ".tr-page{position:relative;overflow:hidden;background:radial-gradient(circle at 78% 8%,rgba(59,153,168,.12),transparent 25%),linear-gradient(180deg,#02090c 0%,#041216 56%,#02090c 100%)}",
      ".tr-page:before{content:'';position:fixed;inset:0;pointer-events:none;background:repeating-linear-gradient(115deg,rgba(255,255,255,.012) 0 1px,transparent 1px 64px);opacity:.45}",
      ".tr-nav{position:sticky;top:12px;z-index:30;max-width:1480px;margin:0 auto;padding:14px 18px;display:flex;align-items:center;gap:8px;background:rgba(2,9,12,.76);backdrop-filter:blur(18px);border:1px solid var(--tr-line);border-radius:22px}",
      ".tr-nav a,.tr-nav span{color:var(--tr-text);text-decoration:none;font-size:12px;letter-spacing:.08em;text-transform:uppercase;padding:8px 11px;border-radius:999px}",
      ".tr-nav a:hover{background:rgba(142,232,239,.1)}",
      ".tr-nav .active{margin-left:auto;color:var(--tr-accent);border:1px solid rgba(142,232,239,.28)}",
      ".tr-hero{position:relative;min-height:92vh;display:flex;align-items:flex-end;margin:18px auto 0;max-width:1480px;border-radius:34px;overflow:hidden;background:#071116}",
      ".tr-hero-bg{position:absolute;inset:0;background:linear-gradient(180deg,rgba(2,9,12,.02) 0%,rgba(2,9,12,.22) 42%,rgba(2,9,12,.94) 100%),url('/artenia-oficio-vivo.avif') center 42%/cover no-repeat;transform:scale(1.02)}",
      ".tr-hero:after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 72% 30%,transparent 0 18%,rgba(2,9,12,.18) 48%,rgba(2,9,12,.62) 100%)}",
      ".tr-hero-copy{position:relative;z-index:2;max-width:1040px;padding:clamp(28px,5vw,76px)}",
      ".tr-kicker{margin:0 0 14px;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:var(--tr-accent);font-weight:800}",
      ".tr-hero h1{margin:0;max-width:11ch;font-size:clamp(54px,9vw,132px);line-height:.86;letter-spacing:-.065em;font-weight:650}",
      ".tr-hero-lead{max-width:36ch;margin:24px 0 0;font-size:clamp(19px,2vw,28px);line-height:1.24;color:rgba(238,249,250,.82)}",
      ".tr-hero-materials{margin-top:28px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:rgba(238,249,250,.56)}",
      ".tr-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:30px}",
      ".tr-btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 17px;border-radius:999px;border:1px solid rgba(142,232,239,.28);color:var(--tr-text);text-decoration:none;font-size:12px;font-weight:800;letter-spacing:.05em;background:rgba(2,12,16,.48);backdrop-filter:blur(10px)}",
      ".tr-btn:hover{background:rgba(142,232,239,.13)}",
      ".tr-wrap{max-width:1480px;margin:0 auto;padding:0 18px 100px}",
      ".tr-section{position:relative;margin-top:110px}",
      ".tr-section-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,.55fr);gap:40px;align-items:end;margin-bottom:28px}",
      ".tr-section h2{margin:0;max-width:14ch;font-size:clamp(42px,6vw,82px);line-height:.92;letter-spacing:-.055em;font-weight:620}",
      ".tr-section-intro{margin:0;color:var(--tr-muted);font-size:15px;line-height:1.7;max-width:48ch}",
      ".tr-material-rail{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(320px,34vw);gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:14px;scrollbar-width:thin;scrollbar-color:rgba(142,232,239,.35) transparent}",
      ".tr-material{position:relative;min-height:520px;border-radius:28px;overflow:hidden;scroll-snap-align:start;border:1px solid var(--tr-line);background:#071116}",
      ".tr-material-bg{position:absolute;inset:0;background-size:cover;background-position:center;filter:saturate(.72) contrast(1.08) brightness(.58);transition:transform .5s ease,filter .5s ease}",
      ".tr-material:hover .tr-material-bg{transform:scale(1.06);filter:saturate(.9) contrast(1.1) brightness(.68)}",
      ".tr-material:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(2,9,12,.06),rgba(2,9,12,.92) 82%)}",
      ".tr-material-copy{position:absolute;z-index:2;left:24px;right:24px;bottom:24px}",
      ".tr-material-copy small{display:block;color:var(--tr-accent);font-size:10px;letter-spacing:.15em;text-transform:uppercase;margin-bottom:9px}",
      ".tr-material-copy h3{margin:0;font-size:clamp(32px,3vw,48px);letter-spacing:-.04em}",
      ".tr-material-copy p{margin:10px 0 0;color:rgba(238,249,250,.76);line-height:1.5;font-size:14px;max-width:34ch}",
      ".tr-landscape{min-height:76vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:80px 20px;border-top:1px solid var(--tr-line);border-bottom:1px solid var(--tr-line);background:radial-gradient(circle at 50% 48%,rgba(142,232,239,.09),transparent 32%)}",
      ".tr-landscape-inner{max-width:1100px}",
      ".tr-landscape h2{max-width:none;margin:0 auto;font-size:clamp(50px,8vw,116px)}",
      ".tr-landscape-lines{margin:34px auto 0;display:grid;gap:9px;color:rgba(238,249,250,.72);font-size:clamp(17px,2vw,25px);line-height:1.35}",
      ".tr-layers{display:grid;grid-template-columns:.8fr 1.2fr;gap:54px;align-items:start}",
      ".tr-layer-stack{border-top:1px solid var(--tr-line)}",
      ".tr-layer{display:grid;grid-template-columns:120px 1fr;gap:20px;padding:22px 0;border-bottom:1px solid var(--tr-line)}",
      ".tr-layer strong{color:var(--tr-accent);font-size:11px;letter-spacing:.16em;text-transform:uppercase}",
      ".tr-layer span{font-size:clamp(20px,2.4vw,34px);line-height:1.15;letter-spacing:-.03em}",
      ".tr-geographies{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}",
      ".tr-geo{position:relative;min-height:420px;border-radius:28px;overflow:hidden;border:1px solid var(--tr-line);text-decoration:none;color:inherit;background:#071116}",
      ".tr-geo-bg{position:absolute;inset:0;background-size:cover;background-position:center;filter:saturate(.7) brightness(.52);transition:transform .45s ease,filter .45s ease}",
      ".tr-geo:hover .tr-geo-bg{transform:scale(1.05);filter:saturate(.9) brightness(.62)}",
      ".tr-geo:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(2,9,12,.08),rgba(2,9,12,.92) 90%)}",
      ".tr-geo-copy{position:absolute;z-index:2;left:24px;right:24px;bottom:24px}",
      ".tr-geo-copy small{display:block;color:var(--tr-accent);font-size:10px;letter-spacing:.15em;text-transform:uppercase;margin-bottom:8px}",
      ".tr-geo-copy h3{margin:0;font-size:clamp(34px,4vw,58px);line-height:.95;letter-spacing:-.05em}",
      ".tr-geo-copy p{margin:12px 0 0;color:rgba(238,249,250,.73);line-height:1.5;max-width:46ch}",
      ".tr-map-cta{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:end;padding:32px;border:1px solid var(--tr-line);border-radius:28px;background:linear-gradient(135deg,rgba(8,31,37,.76),rgba(3,13,17,.78))}",
      ".tr-map-cta h3{margin:0;font-size:clamp(34px,5vw,64px);line-height:.96;letter-spacing:-.045em;max-width:14ch}",
      ".tr-map-cta p{margin:12px 0 0;color:var(--tr-muted);max-width:58ch;line-height:1.55}",
      ".tr-final{min-height:72vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:80px 16px}",
      ".tr-final h2{max-width:15ch;margin:0 auto;font-size:clamp(48px,8vw,112px);line-height:.92;letter-spacing:-.06em}",
      ".tr-final p{margin:22px auto 0;color:var(--tr-muted);font-size:16px;max-width:44ch;line-height:1.6}",
      "@media(max-width:900px){.tr-section-head,.tr-layers,.tr-map-cta{grid-template-columns:1fr}.tr-geographies{grid-template-columns:1fr}.tr-material-rail{grid-auto-columns:minmax(82vw,1fr)}.tr-nav{margin:8px 10px 0;overflow-x:auto;flex-wrap:nowrap}.tr-nav .active{margin-left:0}.tr-layer{grid-template-columns:92px 1fr}}",
      "@media(max-width:640px){.tr-hero{min-height:82vh;margin:10px 10px 0;border-radius:24px}.tr-hero-copy{padding:24px 20px}.tr-wrap{padding:0 12px 70px}.tr-section{margin-top:82px}.tr-material{min-height:430px}.tr-geo{min-height:360px}.tr-landscape{min-height:66vh}.tr-map-cta{padding:22px}}",
      "@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}"
    ].join("");

    document.head.appendChild(style);
  }

  function render(root, mapData) {
    var territories = buildTerritoriesFromMapData(mapData).slice(0, 6);

    var materialCards = MATERIALS.map(function (item) {
      return [
        '<article class="tr-material">',
        '<div class="tr-material-bg" style="background-image:url(\'' + escapeHtml(item.image) + '\')" aria-hidden="true"></div>',
        '<div class="tr-material-copy">',
        '<small>' + escapeHtml(item.eyebrow) + '</small>',
        '<h3>' + escapeHtml(item.name) + '</h3>',
        '<p>' + escapeHtml(item.copy) + '</p>',
        '</div>',
        '</article>'
      ].join("");
    }).join("");

    var geographyCards = territories.map(function (item, index) {
      var oficios = item.oficios.slice(0, 5).join(" · ");
      var categorias = item.categorias.slice(0, 3).join(" · ");
      var image = HERO_IMAGES[index % HERO_IMAGES.length];
      return [
        '<a class="tr-geo" href="/mapa?q=' + encodeURIComponent(item.name) + '">',
        '<div class="tr-geo-bg" style="background-image:url(\'' + escapeHtml(image) + '\')" aria-hidden="true"></div>',
        '<div class="tr-geo-copy">',
        '<small>' + escapeHtml(categorias || "Territorio vivo") + '</small>',
        '<h3>' + escapeHtml(item.name) + '</h3>',
        '<p>' + escapeHtml(oficios || "Oficios y saberes documentados en el mapa de ARTENIA.") + '</p>',
        '</div>',
        '</a>'
      ].join("");
    }).join("");

    root.innerHTML = [
      '<main class="tr-page" aria-label="Territorios ARTENIA">',
      '<nav class="tr-nav" aria-label="Navegación principal">',
      '<a href="/">ARTENIA</a>',
      '<a href="/mapa">Mapa</a>',
      '<a href="/oficios">Oficios</a>',
      '<a href="/historias">Historias</a>',
      '<span class="active" aria-current="page">Territorios</span>',
      '</nav>',

      '<section class="tr-hero" aria-labelledby="territorios-title">',
      '<div class="tr-hero-bg" aria-hidden="true"></div>',
      '<div class="tr-hero-copy">',
      '<p class="tr-kicker">Territorios · España</p>',
      '<h1 id="territorios-title">España, construida a mano.</h1>',
      '<p class="tr-hero-lead">Antes de ser un mapa de fronteras, fue un mapa de materias. Cada paisaje enseñó a sus habitantes una manera distinta de hacer.</p>',
      '<div class="tr-hero-materials">Piedra · Arcilla · Fibra · Sal · Agua · Nieve · Metal · Madera · Fuego</div>',
      '<div class="tr-actions"><a class="tr-btn" href="#leer-territorio">Leer el territorio ↓</a><a class="tr-btn" href="/mapa?q=España">Abrir el mapa →</a></div>',
      '</div>',
      '</section>',

      '<div class="tr-wrap">',
      '<section class="tr-section" id="leer-territorio">',
      '<div class="tr-section-head">',
      '<div><p class="tr-kicker">01 · Leer el territorio</p><h2>Cada paisaje guarda una técnica.</h2></div>',
      '<p class="tr-section-intro">Los oficios no aparecieron separados del lugar. Nacieron de aprender qué ofrecía una materia, qué impedía el clima y qué podía hacer una mano con ambos.</p>',
      '</div>',
      '<div class="tr-material-rail">' + materialCards + '</div>',
      '</section>',

      '<section class="tr-section tr-landscape">',
      '<div class="tr-landscape-inner">',
      '<p class="tr-kicker">02 · Inteligencia territorial</p>',
      '<h2>El paisaje también es una herramienta.</h2>',
      '<div class="tr-landscape-lines">',
      '<span>Una montaña guarda nieve.</span>',
      '<span>Una salina utiliza el sol.</span>',
      '<span>Una cantera determina una arquitectura.</span>',
      '<span>Una palmera crea un oficio.</span>',
      '<span>Un terreno pedregoso inventa el bancal.</span>',
      '</div>',
      '</div>',
      '</section>',

      '<section class="tr-section">',
      '<div class="tr-layers">',
      '<div><p class="tr-kicker">03 · Un territorio, muchas capas</p><h2>Alicante no es un punto. Es una acumulación de decisiones.</h2><p class="tr-section-intro" style="margin-top:20px">Materia, gesto, persona, lugar y transmisión. Cuando esas capas se conectan, el mapa deja de señalar lugares y empieza a explicar por qué existen.</p></div>',
      '<div class="tr-layer-stack">',
      '<div class="tr-layer"><strong>Superficie</strong><span>Paisaje · geología · clima</span></div>',
      '<div class="tr-layer"><strong>Materia</strong><span>Piedra · esparto · sal · palma · arcilla · nieve</span></div>',
      '<div class="tr-layer"><strong>Gesto</strong><span>Extraer · tallar · trenzar · evaporar · encajar · conservar</span></div>',
      '<div class="tr-layer"><strong>Oficio</strong><span>Cantero · espartero · salinero · palmerero · alfarero · nevater</span></div>',
      '<div class="tr-layer"><strong>Memoria</strong><span>Archivo · vocabulario · herramientas · fotografías · relatos</span></div>',
      '<div class="tr-layer"><strong>Futuro</strong><span>Aprender · reparar · construir · adaptar · transmitir</span></div>',
      '</div>',
      '</div>',
      '</section>',

      '<section class="tr-section">',
      '<div class="tr-section-head">',
      '<div><p class="tr-kicker">04 · Geografías que saben hacer</p><h2>El mapa cambia cuando miras lo que un lugar sabe.</h2></div>',
      '<p class="tr-section-intro">Estas geografías se generan a partir de los oficios presentes en los datos reales de ARTENIA. Entra en cada territorio para seguir sus conexiones en el mapa.</p>',
      '</div>',
      (geographyCards ? '<div class="tr-geographies">' + geographyCards + '</div>' : '<p class="tr-section-intro">El mapa territorial está creciendo.</p>'),
      '</section>',

      '<section class="tr-section">',
      '<div class="tr-map-cta">',
      '<div><p class="tr-kicker">Mapa vivo</p><h3>No busques solo lugares. Busca relaciones.</h3><p>Una materia conduce a un oficio. Un oficio a una persona. Una persona a un taller. Un taller a una historia. Y una historia puede volver a convertirse en aprendizaje.</p></div>',
      '<div class="tr-actions"><a class="tr-btn" href="/mapa?q=España">Explorar ARTENIA →</a></div>',
      '</div>',
      '</section>',

      '<section class="tr-final">',
      '<div><p class="tr-kicker">Territorio vivo</p><h2>Una ciudad está viva cuando todavía sabe hacer algo con sus propias manos.</h2><p>ARTENIA usa lo digital para hacer visible, conectar y fortalecer conocimientos que solo existen plenamente cuando vuelven a ponerse en práctica.</p><div class="tr-actions" style="justify-content:center"><a class="tr-btn" href="/mapa">Descubrir quién mantiene ese conocimiento vivo →</a></div></div>',
      '</section>',
      '</div>',
      '</main>'
    ].join("");
  }

  async function bootstrap() {
    if (!/^\/territorios(?:\/|$)/.test(window.location.pathname)) return;

    document.body.setAttribute("data-page", "territorios-page");
    mountStyles();

    var root = document.getElementById("root");
    if (!root) return;

    var mapData = [];
    try {
      mapData = await fetchJson("/OFICIOS_MAPA.json");
      if (!Array.isArray(mapData)) mapData = [];
    } catch (_) {
      mapData = [];
    }

    render(root, mapData);
  }

  ready(function () {
    bootstrap();
  });
})();
