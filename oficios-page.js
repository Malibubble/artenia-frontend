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
      ".of-wrap{max-width:1080px;margin:0 auto;padding:28px 16px 56px;color:#e8f6f9}",
      ".of-kicker{margin:0 0 8px;color:#7ee8f4;font-size:11px;text-transform:uppercase;letter-spacing:.16em;font-weight:800}",
      ".of-title{margin:0 0 8px;font-size:clamp(28px,4vw,44px);line-height:1.08}",
      ".of-sub{margin:0 0 20px;color:rgba(255,255,255,.75);line-height:1.55}",
      ".of-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}",
      ".of-card{background:rgba(10,24,30,.92);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px}",
      ".of-card h3{margin:0 0 8px;font-size:16px;line-height:1.3}",
      ".of-muted{margin:0;color:rgba(255,255,255,.72);font-size:13px;line-height:1.45}",
      ".of-btn{display:inline-flex;align-items:center;gap:8px;margin-top:10px;padding:8px 12px;border-radius:999px;border:1px solid rgba(126,232,244,.45);color:#7ee8f4;text-decoration:none;font-size:12px;font-weight:700}",
      ".of-btn:hover,.of-btn:focus-visible{background:rgba(126,232,244,.12);outline:none}",
      ".of-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:18px 0}",
      ".of-stat{padding:10px 12px;border-radius:12px;background:rgba(8,32,44,.62);border:1px solid rgba(255,255,255,.1)}",
      ".of-stat strong{display:block;font-size:12px;color:#9cc4d1;text-transform:uppercase;letter-spacing:.08em}",
      ".of-stat span{display:block;margin-top:4px;font-size:15px}",
      ".of-breadcrumb{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:14px;font-size:12px;color:#9cc4d1}",
      ".of-breadcrumb a{color:#7ee8f4;text-decoration:none}",
      ".of-related{margin-top:24px}",
      ".of-related ul{margin:10px 0 0;padding-left:18px}",
      ".of-related li{margin:6px 0}",
      "@media (max-width:640px){.of-wrap{padding:20px 12px 40px}}"
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

  function renderListing(root, model) {
    var categoryCounts = Object.keys(model.byCategory)
      .filter(function (key) { return model.byCategory[key] && model.byCategory[key].length; })
      .length;

    root.innerHTML = [
      '<main class="of-wrap">',
      '<p class="of-kicker">Oficios</p>',
      '<h1 class="of-title">Indice de oficios artesanos</h1>',
      '<p class="of-sub">Listado basado en la fuente publica de oficios y talleres disponibles en ARTENIA.</p>',
      '<div class="of-stats">',
      '<div class="of-stat"><strong>Oficios</strong><span>' + esc(model.items.length) + '</span></div>',
      '<div class="of-stat"><strong>Categorias</strong><span>' + esc(categoryCounts) + '</span></div>',
      '</div>',
      '<div class="of-grid">',
      model.items.map(function (item) {
        return [
          '<article class="of-card">',
          '<h3>' + esc(item.name) + '</h3>',
          '<p class="of-muted">Categoria: ' + esc(item.categoryLabel) + '</p>',
          '<p class="of-muted">Municipios: ' + esc(item.municipalitiesCount || 0) + '</p>',
          '<a class="of-btn" href="/oficios/' + esc(item.slug) + '">Ver oficio</a>',
          '</article>'
        ].join("");
      }).join(""),
      '</div>',
      '</main>'
    ].join("");
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

    root.innerHTML = [
      '<main class="of-wrap">',
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
      '</main>'
    ].join("");
  }

  function renderDetail(root, item, model, relatedById) {
    var municipalities = toTextList(item.municipalities);

    root.innerHTML = [
      '<main class="of-wrap">',
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
      '</section>',
      renderRelated(item, model, relatedById),
      '</main>'
    ].join("");
  }

  function renderNotFound(root, slug) {
    root.innerHTML = [
      '<main class="of-wrap">',
      '<nav class="of-breadcrumb"><a href="/oficios">Oficios</a><span>/</span><span>' + esc(slug) + '</span></nav>',
      '<h1 class="of-title">Oficio no encontrado</h1>',
      '<p class="of-sub">No existe un oficio ni categoria registrada con ese slug.</p>',
      '</main>'
    ].join("");
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
      root.innerHTML = '<main class="of-wrap"><h1 class="of-title">No se pudo cargar la pagina de oficios</h1><p class="of-sub">' + esc(error && error.message ? error.message : "Error inesperado") + '</p></main>';
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootWithErrorBoundary, { once: true });
  } else {
    bootWithErrorBoundary();
  }
})();
