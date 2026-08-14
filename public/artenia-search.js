(function () {
  "use strict";

  var FILTERS = [
    { id: "todos", label: "Todos" },
    { id: "artesanos", label: "Artesanos" },
    { id: "oficios", label: "Oficios" },
    { id: "tecnicas", label: "Técnicas" },
    { id: "lugares", label: "Lugares" },
    { id: "rutas", label: "Rutas" },
    { id: "historias", label: "Historias" }
  ];
  var TYPE_LABELS = {
    artesanos: "Artesano",
    oficios: "Oficio",
    tecnicas: "Técnica",
    lugares: "Lugar",
    rutas: "Ruta",
    historias: "Historia"
  };
  var TYPE_IMAGES = {
    artesanos: "/artenia-artesano-humano.avif",
    oficios: "/artenia-oficio-vivo.avif",
    tecnicas: "/artenia-manos-futuro.avif",
    lugares: "/artenia-red-viva.avif",
    rutas: "/artenia-memoria-digital.avif",
    historias: "/artenia-artesano-humano.avif"
  };
  var TERRITORY_SEEDS = [
    { name: "Onil", comarca: "L'Alcoià", related: "Fabricación de juguetes", lat: 38.626, lng: -0.674 }
  ];
  var CURATED_STORIES = [
    ["posidonia-segunda-vida", "Quienes leían la orilla", "Recogida y aprovechamiento de posidonia", "El Campello · Alicante"],
    ["esparto-fibra-que-respira", "La fibra que esperaba en el monte", "Espartería y esterería", "Crevillent"],
    ["piedra-seca-agua-lenta", "Muros que dejan pasar el agua", "Margenería de piedra seca", "Vall de Pop"],
    ["cal-casas-que-respiran", "El fuego blanco", "Calcinero y construcción con cal", "Alcoi"],
    ["neveros-frio-sin-maquinas", "Guardar el invierno", "Nevateros y comercio del hielo", "Serra de Mariola"],
    ["almadraba-memoria-del-atun", "El laberinto del atún", "Almadraberos y rederas", "Nueva Tabarca"],
    ["palma-blanca-tiempo-vegetal", "Cultivar la oscuridad", "Palmereros y trenzadoras de palma blanca", "Elx"],
    ["arrancadors-piedra-tosca", "Leer la duna convertida en piedra", "Arrancadors de piedra tosca", "Xàbia"],
    ["salineros-paisaje-productivo", "Cosechar agua y sol", "Salineros", "Santa Pola y Torrevieja"],
    ["hojalateros-juguete-mecanico", "Cuando una lata aprendió a moverse", "Hojalateros y jugueteros", "Ibi y Onil"]
  ];
  var state = { filter: "todos", query: "", items: [], associations: [] };
  var overlay;
  var input;
  var filters;
  var results;
  var status;
  var previousFocus;
  var dataPromise;

  function normalized(value) {
    return String(value || "")
      .toLocaleLowerCase("es")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[_/]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function slug(value) {
    return normalized(value).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function text(value) {
    return value == null ? "" : String(value).trim();
  }

  function escapeHtml(value) {
    return text(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function number(value) {
    if (value === null || value === undefined || String(value).trim() === "") return null;
    var result = Number(value);
    return Number.isFinite(result) ? result : null;
  }

  function fetchJson(url) {
    return fetch(url, { credentials: "same-origin", headers: { Accept: "application/json" } })
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .catch(function () { return []; });
  }

  function item(spec) {
    spec.search = normalized([
      spec.title,
      spec.subtitle,
      spec.description,
      spec.terms
    ].filter(Boolean).join(" "));
    spec.image = spec.image || TYPE_IMAGES[spec.type];
    return spec;
  }

  function uniqueBy(items, keyBuilder) {
    var seen = Object.create(null);
    return items.filter(function (entry) {
      var key = normalized(keyBuilder(entry));
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function buildCrafts(rows) {
    return (Array.isArray(rows) ? rows : []).map(function (row) {
      var title = text(row.nombre_oficio || row.oficio || row.nombre);
      var municipalities = Array.isArray(row.municipios) ? row.municipios.join(" · ") : "";
      return item({
        id: "oficio-" + text(row.id_oficio || slug(title)),
        type: "oficios",
        title: title,
        subtitle: [text(row.categoria), municipalities].filter(Boolean).join(" · "),
        description: row.num_talleres ? row.num_talleres + " talleres conectados" : "Oficio del atlas ARTENIA",
        terms: [row.categoria, municipalities, row.estado, normalized(title).indexOf("fabricante de juguetes") !== -1 ? "Onil" : ""].filter(Boolean).join(" "),
        href: "/oficios/" + slug(title.split("/")[0]),
        mapQuery: title.split("/")[0],
        selectTitle: title,
        lat: number(row.lat_centro),
        lng: number(row.lng_centro)
      });
    }).filter(function (entry) { return entry.title; });
  }

  function buildArtisans(rows) {
    return (Array.isArray(rows) ? rows : []).map(function (row) {
      var title = text(row.nombre_taller || row.publicName || row.nombre || row.name);
      var craft = text(row.oficio_nombre || row.oficio || row.categoria);
      var place = [row.municipio || row.localidad, row.provincia].filter(Boolean).join(" · ");
      var storyPath = text(row.storyPath || row.publicRoute);
      return item({
        id: "artesano-" + text(row.id_taller || row.id || row.userId || slug(title + place)),
        type: "artesanos",
        title: title,
        subtitle: [craft, place].filter(Boolean).join(" · "),
        description: text(row.descripcion || row.relato || "Taller artesano"),
        terms: [craft, place, row.comarca].filter(Boolean).join(" "),
        href: storyPath || "/mapa?buscar=" + encodeURIComponent(craft || title),
        mapQuery: storyPath ? title : (craft || place || title),
        selectTitle: title,
        lat: number(row.lat || row.latitud || row.lat_centro),
        lng: number(row.lng || row.longitud || row.lng_centro),
        image: text(row.imagenPerfil || row.imagen)
      });
    }).filter(function (entry) { return entry.title; });
  }

  function buildTechniques(edges) {
    var rows = uniqueBy(Array.isArray(edges) ? edges : [], function (edge) {
      return edge.label || edge.type;
    });
    return rows.map(function (edge, index) {
      var rawLabel = text(edge.label || edge.type).replace(/_/g, " ");
      var title = rawLabel.charAt(0).toLocaleUpperCase("es") + rawLabel.slice(1);
      var related = [edge.source_name, edge.target_name].filter(Boolean).join(" · ");
      return item({
        id: "tecnica-" + index + "-" + slug(title),
        type: "tecnicas",
        title: title,
        subtitle: related,
        description: "Conexión entre saberes del atlas",
        terms: [edge.type, related].filter(Boolean).join(" "),
        href: "/mapa?buscar=" + encodeURIComponent(edge.source_name || rawLabel),
        mapQuery: edge.source_name || rawLabel,
        selectTitle: edge.source_name || ""
      });
    });
  }

  function buildPlaces(crafts, points, workshops) {
    var rows = TERRITORY_SEEDS.slice();
    (Array.isArray(crafts) ? crafts : []).forEach(function (craft) {
      (Array.isArray(craft.municipios) ? craft.municipios : []).forEach(function (place) {
        rows.push({ name: place, related: craft.nombre_oficio, lat: craft.lat_centro, lng: craft.lng_centro });
      });
    });
    (Array.isArray(points) ? points : []).forEach(function (point) {
      rows.push({ name: point.municipio, related: point.nombre, comarca: point.comarca, lat: point.lat, lng: point.lng });
    });
    (Array.isArray(workshops) ? workshops : []).forEach(function (workshop) {
      rows.push({ name: workshop.municipio || workshop.localidad, related: workshop.oficio_nombre || workshop.oficio, comarca: workshop.comarca, lat: workshop.lat || workshop.latitud, lng: workshop.lng || workshop.longitud });
    });
    return uniqueBy(rows, function (row) { return row.name; }).map(function (row) {
      return item({
        id: "lugar-" + slug(row.name),
        type: "lugares",
        title: row.name,
        subtitle: [row.comarca, row.related].filter(Boolean).join(" · "),
        description: "Explorar oficios y personas vinculadas al territorio",
        terms: [row.comarca, row.related].filter(Boolean).join(" "),
        href: "/mapa?buscar=" + encodeURIComponent(row.name),
        mapQuery: row.name,
        selectTitle: row.name,
        lat: number(row.lat),
        lng: number(row.lng)
      });
    }).filter(function (entry) { return entry.title; });
  }

  function buildRoutes(points) {
    var grouped = uniqueBy(Array.isArray(points) ? points : [], function (point) {
      return point.municipio || point.comarca;
    });
    return grouped.map(function (point) {
      var place = text(point.municipio || point.comarca);
      return item({
        id: "ruta-" + slug(place),
        type: "rutas",
        title: "Ruta por " + place,
        subtitle: [point.comarca, point.nombre].filter(Boolean).join(" · "),
        description: "Lugares, memoria y oficios conectados",
        terms: [place, point.comarca, point.nombre, point.tipo, point.descripcion].filter(Boolean).join(" "),
        href: "/rutas?buscar=" + encodeURIComponent(place),
        mapQuery: place,
        selectTitle: place,
        lat: number(point.lat),
        lng: number(point.lng)
      });
    });
  }

  function buildStories(profiles, workshops) {
    var source = (Array.isArray(profiles) ? profiles : []).filter(function (profile) {
      var profileSlug = normalized(profile.slug || profile.storyPath || profile.publicRoute);
      return profileSlug.indexOf("amalia-infante") === -1 && (profile.storyPath || profile.publicRoute || profile.relato || profile.historia);
    });
    if (!source.length) {
      source = (Array.isArray(workshops) ? workshops : []).filter(function (workshop) {
        return workshop.historia || workshop.curiosidad;
      });
    }
    return source.map(function (profile, index) {
      var title = text(profile.publicName || profile.nombre_taller || profile.nombre || profile.name || profile.oficio);
      var craft = text(profile.oficio || profile.oficio_nombre || profile.categoria);
      var place = [profile.localidad || profile.municipio, profile.provincia].filter(Boolean).join(" · ");
      return item({
        id: "historia-" + text(profile.id || profile.userId || profile.id_taller || index),
        type: "historias",
        title: title,
        subtitle: [craft, place].filter(Boolean).join(" · "),
        description: text(profile.relato || profile.historia || profile.curiosidad || "Una historia de oficio vivo"),
        terms: [craft, place].filter(Boolean).join(" "),
        href: text(profile.storyPath || profile.publicRoute) || "/historias",
        mapQuery: title,
        selectTitle: title,
        lat: number(profile.latitud || profile.lat || profile.lat_centro),
        lng: number(profile.longitud || profile.lng || profile.lng_centro),
        image: text(profile.imagenPerfil || profile.imagen)
      });
    }).filter(function (entry) { return entry.title; });
  }

  function buildCuratedStories() {
    return CURATED_STORIES.map(function (story, index) {
      return item({
        id: "historia-alicante-" + story[0],
        type: "historias",
        title: story[1],
        subtitle: story[2] + " · " + story[3],
        description: "Historia documental de un saber singular de Alicante",
        terms: [story[0], story[1], story[2], story[3], "Alicante materiales naturales recursos futuro"].join(" "),
        href: "/historias/" + story[0],
        mapQuery: story[3],
        selectTitle: story[3],
        image: TYPE_IMAGES[Object.keys(TYPE_IMAGES)[index % Object.keys(TYPE_IMAGES).length]]
      });
    });
  }

  function loadData() {
    if (dataPromise) return dataPromise;
    var publishedPromise = window.__arteniaPublishedProfilesPromise || Promise.resolve([]);
    dataPromise = Promise.all([
      fetchJson("/OFICIOS_MAPA.json"),
      fetchJson("/RED_OFICIOS.json"),
      fetchJson("/data/POI_RUTAS_CV.json"),
      fetchJson("/data/TALLERES_300PLUS.json"),
      publishedPromise.catch(function () { return []; }),
      fetchJson("/api/promoter-associations.php?limit=200")
    ]).then(function (payloads) {
      var crafts = Array.isArray(payloads[0]) ? payloads[0] : [];
      var edges = Array.isArray(payloads[1]) ? payloads[1] : [];
      var points = Array.isArray(payloads[2]) ? payloads[2] : [];
      var workshops = Array.isArray(payloads[3]) ? payloads[3] : [];
      var profiles = Array.isArray(payloads[4]) ? payloads[4] : [];
      var associationPayload = payloads[5] && !Array.isArray(payloads[5]) ? payloads[5] : {};
      state.associations = Array.isArray(associationPayload.items) ? associationPayload.items : state.associations;
      state.items = uniqueBy([]
        .concat(buildArtisans(workshops))
        .concat(buildArtisans(profiles))
        .concat(buildCrafts(crafts))
        .concat(buildTechniques(edges))
        .concat(buildPlaces(crafts, points, workshops))
        .concat(buildRoutes(points))
        .concat(buildCuratedStories())
        .concat(buildStories(profiles, workshops)), function (entry) {
          return [entry.type, entry.title, entry.subtitle].join("|");
        });
      render();
      return state.items;
    });
    return dataPromise;
  }

  function associationItems() {
    return state.associations.map(function (association) {
      var title = text(association.short_name || association.official_name || "Red artesana");
      var place = [association.municipality, association.province, association.autonomous_community].filter(Boolean).join(" · ");
      return item({
        id: "association-" + text(association.id || association.slug || slug(title)),
        type: "lugares",
        label: "Red artesana",
        title: title,
        subtitle: place,
        description: text(association.mission_summary || association.history_summary || "Entidad conectada al territorio"),
        terms: [association.entity_type, place, association.official_name].filter(Boolean).join(" "),
        href: "/asociaciones/" + text(association.slug),
        mapQuery: title,
        association: true,
        lat: number(association.latitude),
        lng: number(association.longitude)
      });
    });
  }

  function score(entry, tokens, wholeQuery) {
    var haystack = entry.search;
    if (!tokens.every(function (token) {
      if (haystack.indexOf(token) !== -1) return true;
      return token.length >= 6 && haystack.indexOf(token.slice(0, 6)) !== -1;
    })) return -1;
    var title = normalized(entry.title);
    var result = 0;
    if (title === wholeQuery) result += 100;
    if (title.indexOf(wholeQuery) === 0) result += 55;
    if (title.indexOf(wholeQuery) !== -1) result += 35;
    tokens.forEach(function (token) {
      if (title.indexOf(token) !== -1) result += 12;
    });
    return result;
  }

  function visibleItems() {
    var query = normalized(state.query);
    if (query.length < 2) return [];
    var tokens = query.split(" ").filter(Boolean);
    return state.items.concat(associationItems())
      .filter(function (entry) { return state.filter === "todos" || entry.type === state.filter; })
      .map(function (entry) { return { entry: entry, score: score(entry, tokens, query) }; })
      .filter(function (ranked) { return ranked.score >= 0; })
      .sort(function (a, b) { return b.score - a.score || a.entry.title.localeCompare(b.entry.title, "es"); })
      .slice(0, 36)
      .map(function (ranked) { return ranked.entry; });
  }

  function render() {
    if (!results || !filters || !status) return;
    var hasQuery = normalized(state.query).length >= 2;
    filters.hidden = !hasQuery;
    Array.prototype.forEach.call(filters.querySelectorAll("button"), function (button) {
      var selected = button.getAttribute("data-filter") === state.filter;
      button.setAttribute("aria-pressed", String(selected));
      button.classList.toggle("is-active", selected);
    });
    if (!hasQuery) {
      status.textContent = "Busca en el atlas cultural de ARTENIA";
      results.innerHTML = '<div class="ags-empty"><span>⌘ K</span><p>Personas, saberes y territorios conectados en una sola búsqueda.</p></div>';
      return;
    }
    var matches = visibleItems();
    status.textContent = matches.length ? matches.length + (matches.length === 1 ? " resultado relacionado" : " resultados relacionados") : "Sin coincidencias todavía";
    if (!matches.length) {
      results.innerHTML = '<div class="ags-empty"><p>Prueba con un oficio, una técnica o un lugar cercano.</p><a href="/mapa?buscar=' + encodeURIComponent(state.query) + '">Explorar “' + escapeHtml(state.query) + '” en el mapa →</a></div>';
      return;
    }
    results.innerHTML = matches.map(function (entry) {
      var mapAction = entry.mapQuery ? '<button type="button" class="ags-map" data-map-id="' + escapeHtml(entry.id) + '" aria-label="Ver ' + escapeHtml(entry.title) + ' en el mapa">Ver en mapa <span aria-hidden="true">↗</span></button>' : "";
      return [
        '<article class="ags-result" data-result-id="', escapeHtml(entry.id), '">',
        '<a class="ags-result-main" href="', escapeHtml(entry.href || "/mapa"), '">',
        '<img src="', escapeHtml(entry.image || TYPE_IMAGES[entry.type]), '" alt="" loading="lazy" onerror="this.onerror=null;this.src=\'/artenia-oficio-vivo.avif\'">',
        '<span class="ags-result-copy"><small>', escapeHtml(entry.label || TYPE_LABELS[entry.type]), '</small><strong>', escapeHtml(entry.title), '</strong><em>', escapeHtml(entry.subtitle), '</em></span>',
        '</a>', mapAction,
        '</article>'
      ].join("");
    }).join("");
  }

  function setNativeInputValue(element, value) {
    var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function findNativeMapInput() {
    var candidates = document.querySelectorAll('input[placeholder*="Persona"], input[placeholder="¿Qué quieres descubrir?"]');
    for (var index = 0; index < candidates.length; index += 1) {
      if (!candidates[index].hasAttribute("data-artenia-search-input")) return candidates[index];
    }
    return null;
  }

  function hideNativeMapSearch() {
    if (!/^\/mapa(?:\/|$)/.test(window.location.pathname)) return;
    var nativeInputs = document.querySelectorAll('input[placeholder*="Persona"], input[placeholder="¿Qué quieres descubrir?"]');
    Array.prototype.forEach.call(nativeInputs, function (nativeInput) {
      if (nativeInput.hasAttribute("data-artenia-search-input")) return;
      (nativeInput.closest("label") || nativeInput).classList.add("ags-native-map-search");
    });
  }

  function applyMapResult(entry, attempt) {
    attempt = attempt || 0;
    if (entry.association && window.__arteniaAssociationMapBridge && window.__arteniaAssociationMapBridge.focus(entry.title)) {
      return;
    }
    var nativeInput = findNativeMapInput();
    if (!nativeInput && attempt < 18) {
      window.setTimeout(function () { applyMapResult(entry, attempt + 1); }, 180);
      return;
    }
    if (nativeInput) {
      setNativeInputValue(nativeInput, entry.mapQuery || entry.title);
      nativeInput.focus();
      window.setTimeout(function () {
        var title = normalized(entry.selectTitle || entry.title);
        var candidates = document.querySelectorAll("button, [role='button']");
        for (var index = 0; index < candidates.length; index += 1) {
          if (normalized(candidates[index].textContent).indexOf(title) !== -1 && !candidates[index].closest("#artenia-global-search")) {
            candidates[index].click();
            break;
          }
        }
      }, 420);
    }
    var map = window.__arteniaMap || window.__ARTENIA_LEAFLET_MAP__;
    if (map && entry.lat !== null && entry.lng !== null && typeof map.flyTo === "function") {
      map.flyTo([entry.lat, entry.lng], Math.max(map.getZoom(), 11), { duration: 0.8 });
    }
  }

  function goToMap(entry) {
    if (/^\/mapa(?:\/|$)/.test(window.location.pathname)) {
      closeSearch();
      applyMapResult(entry);
      return;
    }
    var params = new URLSearchParams();
    params.set("buscar", entry.mapQuery || entry.title);
    if (entry.selectTitle) params.set("seleccionar", entry.selectTitle);
    if (entry.lat !== null && entry.lat !== undefined) params.set("lat", entry.lat);
    if (entry.lng !== null && entry.lng !== undefined) params.set("lng", entry.lng);
    window.location.href = "/mapa?" + params.toString();
  }

  function openSearch(initialQuery) {
    previousFocus = document.activeElement;
    overlay.hidden = false;
    document.documentElement.classList.add("ags-open");
    state.query = text(initialQuery || state.query);
    input.value = state.query;
    render();
    window.setTimeout(function () { input.focus(); input.select(); }, 30);
    loadData();
  }

  function closeSearch() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.documentElement.classList.remove("ags-open");
    if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
  }

  function createSearch() {
    if (document.getElementById("artenia-global-search")) return;
    var style = document.createElement("style");
    style.id = "artenia-global-search-style";
    style.textContent = [
      ".ags-open{overflow:hidden}",
      ".ags-native-map-search{display:none!important}",
      "[data-loc=\"client/src/components/MapaExploradorLayout.tsx:174\"],[data-loc=\"client/src/components/MapaExploradorLayout.tsx:335\"]{display:none!important}",
      "#artenia-global-search[hidden]{display:none!important}",
      "#artenia-global-search{position:fixed;inset:0;z-index:2147482000;display:grid;place-items:start center;padding:clamp(64px,10vh,110px) 18px 28px;background:radial-gradient(circle at 50% 0%,rgba(22,73,80,.46),transparent 48%),rgba(2,8,11,.82);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}",
      ".ags-panel{width:min(920px,100%);max-height:calc(100vh - 100px);overflow:hidden;display:flex;flex-direction:column;border:1px solid rgba(191,239,237,.17);border-radius:28px;background:linear-gradient(150deg,rgba(15,34,38,.96),rgba(5,14,18,.98));box-shadow:0 36px 110px rgba(0,0,0,.65),inset 0 1px rgba(255,255,255,.07);color:#f5f0e7}",
      ".ags-head{position:relative;padding:clamp(22px,4vw,38px) clamp(20px,4vw,42px) 18px;border-bottom:1px solid rgba(255,255,255,.09)}",
      ".ags-kicker{display:block;margin-bottom:9px;color:#8edfe0;font:700 10px/1.2 ui-sans-serif,system-ui;letter-spacing:.19em;text-transform:uppercase}",
      ".ags-head label{display:block;padding-right:46px;font:500 clamp(20px,3.4vw,34px)/1.15 Georgia,serif;letter-spacing:-.02em}",
      ".ags-input-wrap{display:flex;align-items:center;gap:12px;margin-top:20px;padding:0 3px 12px;border-bottom:1px solid rgba(158,228,226,.32)}",
      ".ags-input-wrap svg{width:20px;flex:0 0 auto;color:#8edfe0}",
      ".ags-input{width:100%;border:0!important;outline:0!important;background:transparent!important;color:#fff!important;box-shadow:none!important;font:400 clamp(17px,2.4vw,22px)/1.4 ui-sans-serif,system-ui!important}",
      ".ags-input::placeholder{color:rgba(245,240,231,.43)}",
      ".ags-close{position:absolute;right:20px;top:20px;width:40px;height:40px;border:1px solid rgba(255,255,255,.13);border-radius:50%;background:rgba(0,0,0,.22);color:#fff;font-size:21px;cursor:pointer}",
      ".ags-filters{display:flex;gap:7px;overflow-x:auto;padding:14px clamp(20px,4vw,42px) 5px;scrollbar-width:none}",
      ".ags-filters::-webkit-scrollbar{display:none}.ags-filters[hidden]{display:none}",
      ".ags-filter{flex:0 0 auto;min-height:36px;padding:0 13px;border:1px solid rgba(255,255,255,.12);border-radius:999px;background:transparent;color:rgba(255,255,255,.63);font:600 12px/1 ui-sans-serif,system-ui;cursor:pointer}",
      ".ags-filter.is-active{border-color:rgba(139,224,224,.44);background:rgba(115,210,210,.13);color:#eaffff}",
      ".ags-status{min-height:22px;padding:9px clamp(20px,4vw,42px) 4px;color:rgba(255,255,255,.48);font:500 11px/1.4 ui-sans-serif,system-ui;letter-spacing:.04em}",
      ".ags-results{overflow:auto;padding:10px clamp(14px,3vw,30px) 28px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}",
      ".ags-result{position:relative;min-width:0;overflow:hidden;border:1px solid rgba(255,255,255,.09);border-radius:18px;background:rgba(255,255,255,.035);transition:transform .2s ease,border-color .2s ease,background .2s ease}",
      ".ags-result:hover{transform:translateY(-2px);border-color:rgba(139,224,224,.3);background:rgba(255,255,255,.065)}",
      ".ags-result-main{display:grid;grid-template-columns:92px minmax(0,1fr);min-height:108px;color:inherit;text-decoration:none}",
      ".ags-result-main img{width:92px;height:100%;min-height:108px;object-fit:cover;filter:saturate(.72) contrast(1.03)}",
      ".ags-result-copy{min-width:0;display:flex;flex-direction:column;justify-content:center;padding:14px 13px 34px}",
      ".ags-result-copy small{color:#82d8d9;font:700 9px/1.2 ui-sans-serif,system-ui;letter-spacing:.14em;text-transform:uppercase}",
      ".ags-result-copy strong{display:block;margin-top:5px;overflow:hidden;text-overflow:ellipsis;color:#fff;font:600 16px/1.25 Georgia,serif;white-space:nowrap}",
      ".ags-result-copy em{display:block;margin-top:5px;overflow:hidden;text-overflow:ellipsis;color:rgba(255,255,255,.5);font:400 11px/1.35 ui-sans-serif,system-ui;font-style:normal;white-space:nowrap}",
      ".ags-map{position:absolute;right:12px;bottom:10px;border:0;background:transparent;color:rgba(151,226,226,.76);font:600 10px/1 ui-sans-serif,system-ui;cursor:pointer}",
      ".ags-empty{grid-column:1/-1;min-height:180px;display:grid;place-content:center;justify-items:center;padding:28px;text-align:center;color:rgba(255,255,255,.55)}",
      ".ags-empty span{padding:8px 11px;border:1px solid rgba(255,255,255,.13);border-radius:9px;color:rgba(255,255,255,.45);font:600 11px ui-sans-serif,system-ui}.ags-empty p{max-width:440px;line-height:1.6}.ags-empty a{color:#8edfe0;text-decoration:none}",
      "[data-artenia-global-search-trigger]{cursor:pointer}",
      ".ags-nav-trigger{display:inline-flex;align-items:center;min-height:40px;padding:0 14px;border:1px solid rgba(255,255,255,.16);border-radius:999px;background:rgba(0,0,0,.18);color:inherit;font:600 12px ui-sans-serif,system-ui;letter-spacing:.05em}",
      "@media(max-width:680px){#artenia-global-search{padding:14px}.ags-panel{max-height:calc(100vh - 28px);border-radius:22px}.ags-results{grid-template-columns:1fr}.ags-result-main{grid-template-columns:78px minmax(0,1fr)}.ags-result-main img{width:78px}.ags-close{right:14px;top:14px}}",
      "@media(prefers-reduced-motion:reduce){.ags-result{transition:none!important}.ags-result:hover{transform:none}}"
    ].join("");
    document.head.appendChild(style);

    overlay = document.createElement("div");
    overlay.id = "artenia-global-search";
    overlay.hidden = true;
    overlay.innerHTML = [
      '<section class="ags-panel" role="dialog" aria-modal="true" aria-labelledby="ags-title">',
      '<header class="ags-head"><span class="ags-kicker">Búsqueda ARTENIA</span><label id="ags-title" for="ags-input">¿Qué quieres descubrir?</label>',
      '<button class="ags-close" type="button" aria-label="Cerrar búsqueda">×</button>',
      '<div class="ags-input-wrap"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5"/><path d="m16.3 16.3 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
      '<input id="ags-input" class="ags-input" data-artenia-search-input type="search" autocomplete="off" placeholder="Artesano, oficio, técnica, lugar, ruta…"></div></header>',
      '<div class="ags-filters" hidden>', FILTERS.map(function (filter) { return '<button class="ags-filter' + (filter.id === "todos" ? ' is-active' : '') + '" type="button" data-filter="' + filter.id + '" aria-pressed="' + (filter.id === "todos") + '">' + filter.label + '</button>'; }).join(""), '</div>',
      '<div class="ags-status" aria-live="polite"></div><div class="ags-results"></div></section>'
    ].join("");
    document.body.appendChild(overlay);
    input = overlay.querySelector(".ags-input");
    filters = overlay.querySelector(".ags-filters");
    results = overlay.querySelector(".ags-results");
    status = overlay.querySelector(".ags-status");

    input.addEventListener("input", function () { state.query = input.value; render(); });
    filters.addEventListener("click", function (event) {
      var button = event.target.closest("[data-filter]");
      if (!button) return;
      state.filter = button.getAttribute("data-filter");
      render();
    });
    results.addEventListener("click", function (event) {
      var button = event.target.closest("[data-map-id]");
      if (!button) return;
      event.preventDefault();
      var id = button.getAttribute("data-map-id");
      var entry = state.items.concat(associationItems()).find(function (candidate) { return candidate.id === id; });
      if (entry) goToMap(entry);
    });
    overlay.querySelector(".ags-close").addEventListener("click", closeSearch);
    overlay.addEventListener("mousedown", function (event) { if (event.target === overlay) closeSearch(); });
  }

  function addSearchToOtherNavigation() {
    if (window.location.pathname === "/") return;
    var isMap = /^\/mapa(?:\/|$)/.test(window.location.pathname);
    var navs = isMap
      ? document.querySelectorAll(".artenia-command-bar > :last-child")
      : document.querySelectorAll("header nav");
    Array.prototype.forEach.call(navs, function (nav) {
      if (nav.querySelector("[data-artenia-global-search-trigger]")) return;
      if (/Modo de exploraci[oó]n/i.test(nav.getAttribute("aria-label") || "")) return;
      var button = document.createElement("button");
      button.type = "button";
      button.className = "ags-nav-trigger";
      button.textContent = "Buscar";
      button.setAttribute("data-artenia-global-search-trigger", "navigation");
      button.setAttribute("aria-label", "Abrir búsqueda ARTENIA");
      nav.appendChild(button);
    });
  }

  function applyIncomingMapSearch() {
    if (!/^\/mapa(?:\/|$)/.test(window.location.pathname)) return;
    var params = new URLSearchParams(window.location.search);
    var query = text(params.get("buscar") || params.get("q"));
    if (!query) return;
    applyMapResult({
      title: text(params.get("seleccionar")) || query,
      selectTitle: text(params.get("seleccionar")),
      mapQuery: query,
      lat: number(params.get("lat")),
      lng: number(params.get("lng"))
    });
  }

  function bootstrap() {
    createSearch();
    addSearchToOtherNavigation();
    hideNativeMapSearch();
    render();
    document.addEventListener("click", function (event) {
      var trigger = event.target.closest("[data-artenia-global-search-trigger]");
      if (!trigger) return;
      event.preventDefault();
      openSearch();
    });
    document.addEventListener("artenia:associations-updated", function (event) {
      var incoming = event.detail && Array.isArray(event.detail.items) ? event.detail.items : [];
      var byId = Object.create(null);
      state.associations.concat(incoming).forEach(function (association) {
        byId[text(association.id || association.slug)] = association;
      });
      state.associations = Object.keys(byId).map(function (key) { return byId[key]; });
      render();
    });
    document.addEventListener("keydown", function (event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase("es") === "k") {
        event.preventDefault();
        overlay.hidden ? openSearch() : closeSearch();
      } else if (event.key === "Escape") {
        closeSearch();
      }
    });
    var observer = new MutationObserver(function () {
      addSearchToOtherNavigation();
      hideNativeMapSearch();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setTimeout(function () { observer.disconnect(); }, 12000);
    applyIncomingMapSearch();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
})();
