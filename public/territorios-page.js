(function () {
  "use strict";

  var FEATURED_STORY_SLUG = "";
  var HERO_IMAGES = [
    "/artenia-artesano-humano.avif",
    "/artenia-manos-futuro.avif",
    "/artenia-oficio-vivo.avif",
    "/artenia-memoria-digital.avif"
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
    return fetch(url, { credentials: "same-origin" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Request failed");
        }
        return response.json();
      });
  }

  function buildTerritoriesFromMapData(entries) {
    var bucket = new Map();

    for (var i = 0; i < entries.length; i += 1) {
      var item = entries[i] || {};
      var oficio = String(item.nombre_oficio || item.oficio || "").trim();
      var categoria = String(item.categoria || "").trim();
      var talleres = Number(item.num_talleres);
      var count = Number.isFinite(talleres) && talleres > 0 ? talleres : 0;
      var municipios = Array.isArray(item.municipios) ? item.municipios.filter(Boolean) : [];
      if (!municipios.length) continue;

      for (var m = 0; m < municipios.length; m += 1) {
        var name = String(municipios[m] || "").trim();
        if (!name) continue;

        var key = slugify(name);
        if (!bucket.has(key)) {
          bucket.set(key, {
            key: key,
            name: name,
            talleres: 0,
            oficios: new Set(),
            categorias: new Set()
          });
        }

        var territory = bucket.get(key);
        territory.talleres += count;
        if (oficio) territory.oficios.add(oficio);
        if (categoria) territory.categorias.add(categoria);
      }
    }

    return Array.from(bucket.values())
      .map(function (entry) {
        return {
          key: entry.key,
          name: entry.name,
          talleres: entry.talleres,
          oficios: Array.from(entry.oficios),
          categorias: Array.from(entry.categorias)
        };
      })
      .sort(function (a, b) {
        return b.talleres - a.talleres;
      });
  }

  function buildCraftGroups(entries) {
    var groups = new Map();

    for (var i = 0; i < entries.length; i += 1) {
      var item = entries[i] || {};
      var category = String(item.categoria || "").trim();
      if (!category) continue;
      var oficio = String(item.nombre_oficio || item.oficio || "").trim();
      var talleres = Number(item.num_talleres);
      var count = Number.isFinite(talleres) && talleres > 0 ? talleres : 0;

      if (!groups.has(category)) {
        groups.set(category, {
          name: category,
          key: slugify(category),
          talleres: 0,
          oficios: new Set()
        });
      }

      var group = groups.get(category);
      group.talleres += count;
      if (oficio) group.oficios.add(oficio);
    }

    return Array.from(groups.values())
      .map(function (group) {
        return {
          name: group.name,
          key: group.key,
          talleres: group.talleres,
          oficios: Array.from(group.oficios)
        };
      })
      .sort(function (a, b) {
        return b.talleres - a.talleres;
      });
  }

  function pickFeaturedStory(profiles) {
    if (!Array.isArray(profiles) || !profiles.length) return null;
    if (FEATURED_STORY_SLUG) {
      var match = profiles.find(function (item) {
        return String(item && item.slug || "") === FEATURED_STORY_SLUG;
      });
      if (match) return match;
    }

    return profiles.find(function (item) {
      var quote = String(item && (item.relato || item.descripcion || "") || "").trim();
      return quote.length >= 32;
    }) || null;
  }

  function pickExperiences(profiles) {
    if (!Array.isArray(profiles) || !profiles.length) return [];

    return profiles
      .filter(function (item) {
        var hasServices = Array.isArray(item && item.services) && item.services.length > 0;
        var hasProjects = Array.isArray(item && item.projects) && item.projects.length > 0;
        var hasVisit = !!(item && item.visit && item.visit.detail);
        return hasServices || hasProjects || hasVisit;
      })
      .slice(0, 3);
  }

  function mountStyles() {
    if (document.getElementById("territorios-style")) return;
    var style = document.createElement("style");
    style.id = "territorios-style";
    style.textContent = [
      ":root{--tr-bg:#071116;--tr-panel:rgba(10,22,28,.84);--tr-line:rgba(255,255,255,.16);--tr-text:#f2fbff;--tr-muted:rgba(242,251,255,.72);--tr-accent:#98e8ef}",
      "body[data-page='territorios-page']{margin:0;background:var(--tr-bg);color:var(--tr-text);font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif}",
      "#seo-indexable-content{display:none!important}",
      ".tr-page{max-width:1240px;margin:0 auto;padding:20px 20px 72px}",
      ".tr-nav{display:flex;flex-wrap:wrap;gap:10px;padding:8px 0 18px}",
      ".tr-nav a{display:inline-flex;align-items:center;min-height:42px;padding:0 16px;border-radius:999px;border:1px solid var(--tr-line);background:rgba(0,0,0,.24);color:var(--tr-text);text-decoration:none;font-size:13px;letter-spacing:.04em;text-transform:uppercase}",
      ".tr-nav a:hover{border-color:rgba(152,232,239,.45);background:rgba(152,232,239,.1)}",
      ".tr-nav-territory{display:grid;gap:1px;padding:10px 14px;border-radius:14px;border:1px solid var(--tr-line);background:rgba(0,0,0,.22)}",
      ".tr-nav-territory strong{font-size:12px;letter-spacing:.1em;text-transform:uppercase}",
      ".tr-nav-territory span{font-size:11px;color:var(--tr-muted)}",
      ".tr-hero{display:grid;grid-template-columns:1.08fr .92fr;gap:20px;align-items:stretch}",
      ".tr-hero-copy{padding:clamp(24px,4vw,46px);border:1px solid var(--tr-line);border-radius:26px;background:var(--tr-panel);display:grid;gap:18px}",
      ".tr-kicker{font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--tr-accent)}",
      ".tr-hero-copy h1{margin:0;font-size:clamp(38px,7vw,78px);line-height:.95;letter-spacing:-.03em}",
      ".tr-hero-copy p{margin:0;max-width:60ch;color:var(--tr-muted);line-height:1.7}",
      ".tr-actions{display:flex;flex-wrap:wrap;gap:10px}",
      ".tr-btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 18px;border-radius:999px;text-decoration:none;font-weight:700;border:1px solid var(--tr-line);color:var(--tr-text);background:transparent}",
      ".tr-btn-primary{background:var(--tr-accent);border-color:var(--tr-accent);color:#071116}",
      ".tr-hero-media{min-height:380px;border-radius:26px;overflow:hidden;border:1px solid var(--tr-line)}",
      ".tr-hero-media img{width:100%;height:100%;object-fit:cover}",
      ".tr-section{margin-top:44px;padding:clamp(22px,3vw,34px);border-radius:24px;border:1px solid var(--tr-line);background:rgba(8,18,24,.7)}",
      ".tr-section h2{margin:0 0 8px;font-size:clamp(30px,5vw,52px);line-height:1;letter-spacing:-.03em}",
      ".tr-section p{margin:0;color:var(--tr-muted);line-height:1.6}",
      ".tr-map-tools{margin-top:18px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}",
      ".tr-map-tools input,.tr-map-tools select,.tr-map-tools button{width:100%;min-height:44px;border-radius:12px;border:1px solid var(--tr-line);background:rgba(0,0,0,.25);color:var(--tr-text);padding:0 12px;font:inherit}",
      ".tr-map-tools button{cursor:pointer}",
      ".tr-map-shell{margin-top:14px;border:1px dashed rgba(152,232,239,.4);border-radius:16px;padding:20px;background:rgba(4,10,14,.56)}",
      ".tr-grid{margin-top:18px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}",
      ".tr-card{border:1px solid var(--tr-line);border-radius:18px;overflow:hidden;background:rgba(5,12,16,.7)}",
      ".tr-card img{width:100%;height:180px;object-fit:cover}",
      ".tr-card-body{padding:14px;display:grid;gap:8px}",
      ".tr-card h3{margin:0;font-size:20px}",
      ".tr-card p{margin:0;color:var(--tr-muted);font-size:14px;line-height:1.5}",
      ".tr-link{color:var(--tr-accent);text-decoration:none;font-weight:700}",
      ".tr-quote{padding:56px 10px;text-align:center;max-width:900px;margin:0 auto}",
      ".tr-quote h2{font-size:clamp(34px,6vw,62px)}",
      ".tr-empty{margin-top:14px;padding:20px;border-radius:16px;border:1px solid var(--tr-line);background:rgba(0,0,0,.25)}",
      "@media (max-width:980px){.tr-hero{grid-template-columns:1fr}.tr-grid{grid-template-columns:1fr 1fr}.tr-map-tools{grid-template-columns:1fr 1fr}}",
      "@media (max-width:640px){.tr-page{padding:16px 14px 54px}.tr-grid{grid-template-columns:1fr}.tr-map-tools{grid-template-columns:1fr}.tr-nav{gap:8px}}",
      "@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}"
    ].join("");
    document.head.appendChild(style);
  }

  function render(root, mapData, profiles) {
    var territories = buildTerritoriesFromMapData(mapData).slice(0, 3);
    var craftGroups = buildCraftGroups(mapData).slice(0, 8);
    var featuredStory = pickFeaturedStory(profiles);
    var experiences = pickExperiences(profiles);

    var territoryOptions = territories.map(function (item) {
      return '<option value="' + escapeHtml(item.name) + '">' + escapeHtml(item.name) + '</option>';
    }).join("");

    var craftOptions = craftGroups.map(function (item) {
      return '<option value="' + escapeHtml(item.name) + '">' + escapeHtml(item.name) + '</option>';
    }).join("");

    var territoryCards = territories.map(function (item, index) {
      var oficios = item.oficios.slice(0, 3).join(" · ");
      var image = HERO_IMAGES[index % HERO_IMAGES.length];
      return [
        '<article class="tr-card">',
        '<img src="' + image + '" alt="Territorio artesanal en ' + escapeHtml(item.name) + '">',
        '<div class="tr-card-body">',
        '<h3>' + escapeHtml(item.name) + '</h3>',
        '<p><span>Talleres detectados automáticamente:</span> <strong>' + String(Math.max(0, Math.round(item.talleres))) + '</strong></p>',
        '<p><span>Oficios presentes:</span> <span>' + escapeHtml(oficios || "Información editorial en actualización.") + '</span></p>',
        '<a class="tr-link" href="/mapa?q=' + encodeURIComponent(item.name) + '">Explorar perfiles</a>',
        '</div>',
        '</article>'
      ].join("");
    }).join("");

    var craftCards = craftGroups.map(function (item, index) {
      var image = HERO_IMAGES[(index + 1) % HERO_IMAGES.length];
      var leadOficio = item.oficios[0] || "";
      return [
        '<article class="tr-card">',
        '<img src="' + image + '" alt="Oficio de ' + escapeHtml(item.name) + '">',
        '<div class="tr-card-body">',
        '<h3>' + escapeHtml(item.name) + '</h3>',
        '<p><span>Oficio representativo:</span> <span>' + escapeHtml(leadOficio || "Oficios vinculados al territorio.") + '</span></p>',
        '<a class="tr-link" href="/mapa?q=' + encodeURIComponent(item.name) + '">Ver en el mapa</a>',
        '</div>',
        '</article>'
      ].join("");
    }).join("");

    var storyBlock = featuredStory
      ? [
          '<article class="tr-card">',
          '<img src="' + escapeHtml(featuredStory.imagen || featuredStory.imagenPerfil || HERO_IMAGES[0]) + '" alt="Historia destacada de ' + escapeHtml(featuredStory.publicName || featuredStory.nombre || "artesano") + '">',
          '<div class="tr-card-body">',
          '<p class="tr-kicker">HISTORIA DESTACADA</p>',
          '<h3>' + escapeHtml(featuredStory.publicName || featuredStory.nombre || "Artesano publicado") + '</h3>',
          '<p>' + escapeHtml(String(featuredStory.relato || featuredStory.descripcion || "").slice(0, 180) || "Conoce su trayectoria, su oficio y su relación con el territorio.") + '</p>',
          '<a class="tr-link" href="' + escapeHtml(featuredStory.storyPath || ("/historias/" + (featuredStory.slug || ""))) + '">Conocer su historia</a>',
          '</div>',
          '</article>'
        ].join("")
      : [
          '<div class="tr-empty">',
          '<h3>El mapa sigue creciendo.</h3>',
          '<p>Estamos incorporando nuevos artesanos, oficios y territorios a ARTENIA.</p>',
          '<a class="tr-link" href="/registro-artesano">Formar parte del mapa</a>',
          '</div>'
        ].join("");

    var experiencesBlock = experiences.length
      ? experiences.map(function (item, index) {
          var image = item.imagen || item.imagenPerfil || HERO_IMAGES[(index + 2) % HERO_IMAGES.length];
          var label = item.publicName || item.nombre || "Experiencia publicada";
          var detail = item.descripcion || item.relato || "Experiencia vinculada al oficio y al territorio.";
          return [
            '<article class="tr-card">',
            '<img src="' + escapeHtml(image) + '" alt="Experiencia de ' + escapeHtml(label) + '">',
            '<div class="tr-card-body">',
            '<h3>' + escapeHtml(label) + '</h3>',
            '<p>' + escapeHtml(String(detail).slice(0, 160)) + '</p>',
            '<a class="tr-link" href="' + escapeHtml(item.storyPath || ("/historias/" + (item.slug || ""))) + '">Ver detalle</a>',
            '</div>',
            '</article>'
          ].join("");
        }).join("")
      : [
          '<div class="tr-empty">',
          '<p>Estamos preparando nuevas formas de recorrer el territorio a través de sus oficios.</p>',
          '</div>'
        ].join("");

    root.innerHTML = [
      '<main class="tr-page" aria-label="Territorios ARTENIA">',
      '<nav class="tr-nav" aria-label="Navegación principal">',
      '<a href="/mapa">Mapa</a>',
      '<a href="/oficios">Oficios</a>',
      '<a href="/historias">Historias</a>',
      '<div class="tr-nav-territory" aria-current="page"><strong>Territorios</strong><span>España · El primer territorio de ARTENIA</span></div>',
      '<a href="/registro-artesano">Para artesanos</a>',
      '</nav>',
      '<section class="tr-hero" aria-labelledby="territorios-title">',
      '<article class="tr-hero-copy">',
      '<p class="tr-kicker">Artesanía en España</p>',
      '<h1 id="territorios-title">España, hecha a mano.</h1>',
      '<p>Un territorio contado por quienes transforman la materia, preservan los oficios y mantienen vivo el conocimiento que pasa de unas manos a otras.</p>',
      '<div class="tr-actions">',
      '<a class="tr-btn tr-btn-primary" href="/mapa?q=España">Explorar el mapa</a>',
      '<a class="tr-btn" href="/oficios">Descubrir los oficios</a>',
      '</div>',
      '</article>',
      '<figure class="tr-hero-media"><img src="' + HERO_IMAGES[0] + '" alt="Manos y oficio artesanal en territorio español"></figure>',
      '</section>',
      '<section class="tr-section" aria-labelledby="territorios-map-title">',
      '<h2 id="territorios-map-title">Un mapa vivo</h2>',
      '<p>Descubre artesanos, talleres, oficios y experiencias cerca de ti.</p>',
      '<form class="tr-map-tools" id="territorios-map-filters">',
      '<input type="search" name="query" placeholder="Buscar por nombre u oficio" aria-label="Buscar por nombre u oficio">',
      '<select name="territory" aria-label="Filtrar por territorio"><option value="">Comunidad, provincia o zona</option>' + territoryOptions + '</select>',
      '<select name="craft" aria-label="Filtrar por oficio"><option value="">Filtrar por oficio</option>' + craftOptions + '</select>',
      '<button type="submit">Abrir mapa de ARTENIA</button>',
      '</form>',
      '<div class="tr-map-shell">',
      '<p>Para mantener el funcionamiento actual del mapa, la exploración completa se abre en su ruta real.</p>',
      '<div class="tr-actions" style="margin-top:10px">',
      '<a class="tr-btn tr-btn-primary" href="/mapa?q=España">Explorar el mapa</a>',
      '<button class="tr-btn" type="button" id="territorios-nearby">Cerca de mí</button>',
      '</div>',
      '</div>',
      '</section>',
      '<section class="tr-section" aria-labelledby="territorios-activity-title">',
      '<h2 id="territorios-activity-title">Territorios con historias que contar</h2>',
      '<p>Selección automática basada en perfiles y oficios con actividad real publicada.</p>',
      (territoryCards ? '<div class="tr-grid">' + territoryCards + '</div>' : '<div class="tr-empty"><p>El mapa sigue creciendo.</p></div>'),
      (!territoryCards ? '' : '<p style="margin-top:14px">El mapa sigue creciendo.</p>'),
      '</section>',
      '<section class="tr-quote" aria-labelledby="territorios-manifesto-title">',
      '<h2 id="territorios-manifesto-title">Un territorio también se reconoce por lo que sabe hacer.</h2>',
      '<p>ARTENIA conecta personas, oficios, técnicas y lugares para que el conocimiento hecho con las manos pueda encontrarse, compartirse y continuar vivo.</p>',
      '</section>',
      '<section class="tr-section" aria-labelledby="territorios-crafts-title">',
      '<h2 id="territorios-crafts-title">Oficios que forman parte del territorio</h2>',
      '<p>Categorías activas detectadas desde los datos reales del mapa.</p>',
      (craftCards ? '<div class="tr-grid">' + craftCards + '</div>' : '<div class="tr-empty"><p>El mapa sigue creciendo.</p></div>'),
      '</section>',
      '<section class="tr-section" aria-labelledby="territorios-featured-story">',
      '<h2 id="territorios-featured-story">Historia destacada</h2>',
      storyBlock,
      '</section>',
      '<section class="tr-section" aria-labelledby="territorios-experiences-title">',
      '<h2 id="territorios-experiences-title">No solo mires. Entra.</h2>',
      '<p>Visita un taller, conoce un proceso, participa en una experiencia o encuentra una pieza creada cerca de ti.</p>',
      (experiences.length ? '<div class="tr-grid">' + experiencesBlock + '</div>' : experiencesBlock),
      '</section>',
      '<section class="tr-section" aria-labelledby="territorios-join-title">',
      '<h2 id="territorios-join-title">¿Trabajas con tus manos?</h2>',
      '<p>Forma parte del mapa vivo de ARTENIA y permite que nuevas personas descubran tu trabajo, tus procesos y tu historia.</p>',
      '<div class="tr-actions" style="margin-top:12px"><a class="tr-btn tr-btn-primary" href="/registro-artesano">Unirme a ARTENIA</a></div>',
      '</section>',
      '</main>'
    ].join("");

    var filterForm = document.getElementById("territorios-map-filters");
    if (filterForm) {
      filterForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var q = [];
        var query = String(filterForm.query.value || "").trim();
        var territory = String(filterForm.territory.value || "").trim();
        var craft = String(filterForm.craft.value || "").trim();
        if (query) q.push(query);
        if (territory) q.push(territory);
        if (craft) q.push(craft);
        var target = "/mapa" + (q.length ? ("?q=" + encodeURIComponent(q.join(" "))) : "?q=" + encodeURIComponent("España"));
        window.location.assign(target);
      });
    }

    var nearby = document.getElementById("territorios-nearby");
    if (nearby) {
      nearby.addEventListener("click", function () {
        if (!navigator.geolocation) {
          window.location.assign("/mapa?q=España");
          return;
        }
        nearby.disabled = true;
        navigator.geolocation.getCurrentPosition(function (position) {
          var lat = position && position.coords ? position.coords.latitude : null;
          var lng = position && position.coords ? position.coords.longitude : null;
          var target = "/mapa";
          if (typeof lat === "number" && typeof lng === "number") {
            target += "?q=" + encodeURIComponent(lat.toFixed(4) + "," + lng.toFixed(4));
          } else {
            target += "?q=" + encodeURIComponent("España");
          }
          window.location.assign(target);
        }, function () {
          nearby.disabled = false;
          window.location.assign("/mapa?q=España");
        }, { enableHighAccuracy: false, timeout: 6000, maximumAge: 120000 });
      });
    }
  }

  async function bootstrap() {
    if (!/^\/territorios(?:\/|$)/.test(window.location.pathname)) return;

    document.body.setAttribute("data-page", "territorios-page");
    mountStyles();

    var root = document.getElementById("root");
    if (!root) return;

    var mapData = [];
    var profiles = [];

    try {
      mapData = await fetchJson("/OFICIOS_MAPA.json");
      if (!Array.isArray(mapData)) mapData = [];
    } catch (_) {
      mapData = [];
    }

    try {
      var payload = await fetchJson("/api/public-profiles.php");
      profiles = payload && Array.isArray(payload.items) ? payload.items : [];
    } catch (_) {
      profiles = [];
    }

    render(root, mapData, profiles);
  }

  ready(function () {
    bootstrap();
  });
})();
