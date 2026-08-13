(function () {
  "use strict";

  var DISCLAIMER_TEXT = "Esta ficha se ha elaborado a partir de informacion publica y fuentes identificadas. Su presencia no implica adhesion, patrocinio ni colaboracion oficial con ARTENIA. La entidad puede solicitar su verificacion, actualizacion o retirada.";

  function installLeafletCapture() {
    if (window.__apmLeafletCaptureInstalled) return;
    window.__apmLeafletCaptureInstalled = true;

    function patchLeafletMapFactory() {
      var L = window.L;
      if (!L || typeof L.map !== "function" || L.map.__apmWrapped) {
        return;
      }
      var originalMapFactory = L.map.bind(L);
      var wrapped = function () {
        var map = originalMapFactory.apply(null, arguments);
        if (map && typeof map.getBounds === "function") {
          window.__ARTENIA_LEAFLET_MAP__ = map;
        }
        return map;
      };
      wrapped.__apmWrapped = true;
      L.map = wrapped;
    }

    patchLeafletMapFactory();
    var tries = 0;
    var timer = window.setInterval(function () {
      patchLeafletMapFactory();
      tries += 1;
      if (tries >= 25 || window.__ARTENIA_LEAFLET_MAP__) {
        window.clearInterval(timer);
      }
    }, 500);
  }

  function findLeafletMapInstance() {
    if (window.__ARTENIA_LEAFLET_MAP__ && typeof window.__ARTENIA_LEAFLET_MAP__.getBounds === "function") {
      return window.__ARTENIA_LEAFLET_MAP__;
    }
    var L = window.L;
    if (!L || typeof L.Map !== "function") {
      return null;
    }
    var keys = Object.keys(window);
    for (var i = 0; i < keys.length; i += 1) {
      var value = window[keys[i]];
      if (value instanceof L.Map && typeof value.getBounds === "function") {
        window.__ARTENIA_LEAFLET_MAP__ = value;
        return value;
      }
    }
    return null;
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function slugToLabel(slug) {
    return String(slug || "")
      .split("-")
      .filter(Boolean)
      .map(function (part) {
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join(" ");
  }

  function normalize(value, fallback) {
    var text = String(value == null ? "" : value).trim();
    return text || (fallback || "");
  }

  function formatDate(value) {
    var ts = Number(value || 0);
    if (!Number.isFinite(ts) || ts <= 0) return "";
    try {
      return new Date(ts * 1000).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch (_) {
      return "";
    }
  }

  async function api(url, options) {
    var response = await fetch(url, Object.assign({
      credentials: "same-origin",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    }, options || {}));
    var payload = await response.json().catch(function () { return {}; });
    if (!response.ok) {
      throw new Error(payload.error || "No se pudo completar la accion.");
    }
    return payload;
  }

  function ensureStyle() {
    if (document.getElementById("apm-style")) return;
    var style = document.createElement("style");
    style.id = "apm-style";
    style.textContent = [
      ".apm-wrap{max-width:1080px;margin:0 auto;padding:28px 16px 56px;color:#e8f6f9}",
      ".apm-kicker{margin:0 0 10px;color:#7ee8f4;font-size:11px;text-transform:uppercase;letter-spacing:.16em;font-weight:800}",
      ".apm-title{margin:0 0 8px;font-size:clamp(27px,4vw,44px);line-height:1.05}",
      ".apm-sub{margin:0 0 20px;color:rgba(255,255,255,.75);line-height:1.6}",
      ".apm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}",
      ".apm-card{background:rgba(10,24,30,.92);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px}",
      ".apm-card h3{margin:0 0 7px;font-size:16px;line-height:1.3}",
      ".apm-muted{color:rgba(255,255,255,.62);font-size:13px;line-height:1.5}",
      ".apm-pill{display:inline-block;border:1px solid rgba(126,232,244,.35);background:rgba(126,232,244,.1);border-radius:999px;padding:5px 9px;font-size:10px;text-transform:uppercase;letter-spacing:.08em;font-weight:800;color:#9deff7}",
      ".apm-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}",
      ".apm-btn{appearance:none;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.06);color:#ecf9fc;border-radius:999px;padding:9px 13px;font-size:13px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}",
      ".apm-btn:hover{border-color:rgba(126,232,244,.6);background:rgba(126,232,244,.12)}",
      ".apm-disclaimer{margin-top:22px;border:1px solid rgba(251,191,36,.35);background:rgba(251,191,36,.08);border-radius:14px;padding:14px;color:#ffe9b1;line-height:1.55}",
      ".apm-meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin:14px 0}",
      ".apm-meta div{border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:10px 12px;background:rgba(255,255,255,.04)}",
      ".apm-meta strong{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.09em;color:rgba(255,255,255,.62);margin-bottom:6px}",
      ".apm-form{margin-top:14px;display:grid;gap:8px}",
      ".apm-input,.apm-textarea{width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.17);background:rgba(0,0,0,.26);color:#fff;border-radius:10px;padding:10px 11px;font:inherit}",
      ".apm-textarea{min-height:90px;resize:vertical}",
      ".apm-oficio-section{margin:30px 0 0}",
      ".apm-oficio-section h2{margin:0 0 8px;font-size:28px}",
      ".apm-oficio-section p{margin:0 0 14px;color:rgba(255,255,255,.72)}"
    ].join("");
    document.head.appendChild(style);
  }

  function buildAssociationCard(item) {
    var title = normalize(item.short_name || item.official_name, "Asociacion promotora");
    var territory = [item.municipality, item.province, item.autonomous_community].filter(Boolean).join(" · ");
    return [
      '<article class="apm-card">',
      '<span class="apm-pill">' + esc(item.entity_type || "association") + '</span>',
      '<h3>' + esc(title) + '</h3>',
      '<p class="apm-muted">' + esc(item.official_name || "") + '</p>',
      territory ? '<p class="apm-muted">' + esc(territory) + '</p>' : "",
      '<p class="apm-muted">Nivel: ' + esc(item.verification_level || "V1_SOURCE_FOUND") + '</p>',
      '<a class="apm-btn" href="/asociaciones/' + esc(item.slug || "") + '">Ver ficha</a>',
      '</article>'
    ].join("");
  }

  function mountAssociationListing(root) {
    root.innerHTML = [
      '<main class="apm-wrap">',
      '<p class="apm-kicker">ARTENIA · Asociaciones promotoras</p>',
      '<h1 class="apm-title">Asociaciones promotoras</h1>',
      '<p class="apm-sub">Entidades que protegen, representan, ensenan o impulsan oficios artesanos en distintos territorios.</p>',
      '<section id="apm-list" class="apm-grid"></section>',
      '</main>'
    ].join("");

    api('/api/promoter-associations.php?limit=200')
      .then(function (payload) {
        var items = Array.isArray(payload.items) ? payload.items : [];
        var container = document.getElementById('apm-list');
        if (!container) return;
        if (!items.length) {
          container.innerHTML = '<p class="apm-muted">Sin asociaciones publicadas todavia.</p>';
          return;
        }
        container.innerHTML = items.map(buildAssociationCard).join('');
      })
      .catch(function (error) {
        var container = document.getElementById('apm-list');
        if (container) {
          container.innerHTML = '<p class="apm-muted">' + esc(error.message || 'No se pudo cargar el listado.') + '</p>';
        }
      });
  }

  function requestForm(slug, type, buttonLabel) {
    var titleByType = {
      claim: 'Represento a esta asociacion',
      correction: 'Solicitar correccion',
      removal: 'Solicitar retirada'
    };
    return [
      '<details class="apm-card">',
      '<summary class="apm-btn" style="display:inline-flex">' + esc(buttonLabel) + '</summary>',
      '<form class="apm-form" data-association-request="' + esc(type) + '" data-association-slug="' + esc(slug) + '">',
      '<p class="apm-muted">' + esc(titleByType[type]) + '</p>',
      '<input class="apm-input" name="requester_name" type="text" placeholder="Nombre">',
      '<input class="apm-input" name="requester_email" type="email" placeholder="Correo" required>',
      '<textarea class="apm-textarea" name="message" placeholder="Detalle de la solicitud" required></textarea>',
      '<button class="apm-btn" type="submit">Enviar</button>',
      '<p class="apm-muted" data-status></p>',
      '</form>',
      '</details>'
    ].join('');
  }

  function bindRequestForms() {
    Array.prototype.forEach.call(document.querySelectorAll('form[data-association-request]'), function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var slug = form.getAttribute('data-association-slug') || '';
        var requestType = form.getAttribute('data-association-request') || '';
        var status = form.querySelector('[data-status]');
        if (status) status.textContent = 'Enviando...';
        api('/api/association-request.php', {
          method: 'POST',
          body: JSON.stringify({
            slug: slug,
            request_type: requestType,
            requester_name: String(form.requester_name.value || ''),
            requester_email: String(form.requester_email.value || ''),
            message: String(form.message.value || ''),
          })
        }).then(function (payload) {
          if (status) status.textContent = payload.message || 'Solicitud enviada.';
          form.reset();
        }).catch(function (error) {
          if (status) status.textContent = error.message || 'No se pudo enviar la solicitud.';
        });
      });
    });
  }

  function mountAssociationDetail(root, slug) {
    root.innerHTML = '<main class="apm-wrap"><p class="apm-muted">Cargando ficha...</p></main>';
    api('/api/promoter-associations.php?slug=' + encodeURIComponent(slug))
      .then(function (payload) {
        var item = payload && payload.item ? payload.item : null;
        if (!item) {
          root.innerHTML = '<main class="apm-wrap"><p class="apm-muted">Ficha no disponible.</p></main>';
          return;
        }
        var relations = payload.relations || {};
        var crafts = Array.isArray(relations.crafts) ? relations.crafts : [];
        var territories = Array.isArray(relations.territories) ? relations.territories : [];
        var routes = Array.isArray(relations.routes) ? relations.routes : [];
        var territory = [item.locality, item.municipality, item.province, item.autonomous_community].filter(Boolean).join(' · ');
        var sourceDate = formatDate(item.source_checked_at);

        root.innerHTML = [
          '<main class="apm-wrap">',
          '<p class="apm-kicker">ARTENIA · Asociacion promotora</p>',
          '<h1 class="apm-title">' + esc(item.official_name || slugToLabel(slug)) + '</h1>',
          item.short_name ? '<p class="apm-sub">' + esc(item.short_name) + '</p>' : '',
          '<section class="apm-meta">',
          '<div><strong>Tipo de entidad</strong><span>' + esc(item.entity_type || 'association') + '</span></div>',
          '<div><strong>Territorio</strong><span>' + esc(territory || 'No especificado') + '</span></div>',
          '<div><strong>Nivel de verificacion</strong><span>' + esc(item.verification_level || 'V1_SOURCE_FOUND') + '</span></div>',
          '<div><strong>Comprobacion de fuente</strong><span>' + esc(sourceDate || 'Sin fecha') + '</span></div>',
          '</section>',
          '<section class="apm-card">',
          '<h2>Resumen editorial original de ARTENIA</h2>',
          '<p class="apm-muted">' + esc(item.mission_summary || 'Estamos completando el resumen editorial de esta entidad.') + '</p>',
          '</section>',
          (item.history_summary || item.legacy_summary) ? [
            '<section class="apm-card">',
            '<h2>Historia y legado</h2>',
            item.history_summary ? '<p class="apm-muted">' + esc(item.history_summary) + '</p>' : '',
            item.legacy_summary ? '<p class="apm-muted">' + esc(item.legacy_summary) + '</p>' : '',
            '</section>'
          ].join('') : '',
          '<section class="apm-card">',
          '<h2>Papel actual en la transmision del oficio</h2>',
          '<p class="apm-muted">' + esc(item.mission_summary || 'Informacion en proceso de documentacion.') + '</p>',
          '</section>',
          '<section class="apm-card">',
          '<h2>Sostenibilidad y preservacion cultural</h2>',
          '<p class="apm-muted">' + esc(item.sustainability_summary || 'Informacion en proceso de documentacion.') + '</p>',
          '</section>',
          '<section class="apm-card">',
          '<h2>Oficios relacionados</h2>',
          crafts.length ? '<p class="apm-muted">' + crafts.map(function (row) { return esc((row.craft_id || '') + ' (' + (row.relation_type || '') + ')'); }).join(' · ') + '</p>' : '<p class="apm-muted">Sin oficios vinculados aun.</p>',
          '</section>',
          '<section class="apm-card">',
          '<h2>Rutas y territorios relacionados</h2>',
          territories.length ? '<p class="apm-muted">Territorios: ' + territories.map(function (row) { return esc((row.territory_id || '') + ' (' + (row.relation_type || '') + ')'); }).join(' · ') + '</p>' : '',
          routes.length ? '<p class="apm-muted">Rutas: ' + routes.map(function (row) { return esc((row.route_id || '') + ' (' + (row.relation_type || '') + ')'); }).join(' · ') + '</p>' : '',
          (!territories.length && !routes.length) ? '<p class="apm-muted">Sin rutas o territorios vinculados aun.</p>' : '',
          '</section>',
          '<section class="apm-card">',
          '<h2>Fuente y fecha de comprobacion</h2>',
          '<p class="apm-muted"><strong>Fuente:</strong> ' + esc(item.source_name || 'No indicada') + '</p>',
          item.source_url ? '<p class="apm-muted"><a class="apm-btn" rel="noreferrer" target="_blank" href="' + esc(item.source_url) + '">Web oficial o fuente</a></p>' : '',
          '</section>',
          '<div class="apm-actions">',
          requestForm(item.slug, 'claim', 'Represento a esta asociacion'),
          requestForm(item.slug, 'correction', 'Solicitar correccion'),
          requestForm(item.slug, 'removal', 'Solicitar retirada'),
          '</div>',
          '<p class="apm-disclaimer">' + esc(DISCLAIMER_TEXT) + '</p>',
          '</main>'
        ].join('');

        bindRequestForms();
      })
      .catch(function (error) {
        root.innerHTML = '<main class="apm-wrap"><p class="apm-muted">' + esc(error.message || 'No se pudo cargar la ficha.') + '</p></main>';
      });
  }

  function mountAsociacionesRoute() {
    var root = document.getElementById('root');
    if (!root) return;
    ensureStyle();
    var path = String(window.location.pathname || '');
    var detailMatch = path.match(/^\/asociaciones\/([a-z0-9-]+)$/);
    if (detailMatch) {
      mountAssociationDetail(root, detailMatch[1]);
      return;
    }
    mountAssociationListing(root);
  }

  function appendOficioAssociations() {
    var match = String(window.location.pathname || '').match(/^\/oficios\/([a-z0-9-]+)$/);
    if (!match) return;
    var oficioSlug = match[1];

    api('/api/promoter-associations.php?craft_id=' + encodeURIComponent(oficioSlug) + '&limit=40')
      .then(function (payload) {
        var items = Array.isArray(payload.items) ? payload.items : [];
        if (!items.length) return;
        ensureStyle();

        var attachTo = document.querySelector('#root main') || document.querySelector('#root div') || document.getElementById('root');
        if (!attachTo || document.getElementById('apm-oficio-associations')) return;

        var section = document.createElement('section');
        section.id = 'apm-oficio-associations';
        section.className = 'apm-wrap apm-oficio-section';
        section.innerHTML = [
          '<h2>Asociaciones promotoras</h2>',
          '<p>Entidades que protegen, representan, ensenan o impulsan este oficio en distintos territorios.</p>',
          '<div class="apm-grid">' + items.map(function (item) {
            return [
              '<article class="apm-card">',
              '<h3>' + esc(item.short_name || item.official_name) + '</h3>',
              '<p class="apm-muted">' + esc(item.entity_type) + ' · ' + esc([item.municipality, item.province].filter(Boolean).join(' · ') || 'Territorio sin detalle') + '</p>',
              '<p class="apm-muted">Nivel: ' + esc(item.verification_level || 'V1_SOURCE_FOUND') + '</p>',
              '<a class="apm-btn" href="/asociaciones/' + esc(item.slug) + '">Ver ficha</a>',
              '</article>'
            ].join('');
          }).join('') + '</div>'
        ].join('');

        attachTo.appendChild(section);
      })
      .catch(function () {
        // Silent fallback to avoid affecting oficio page rendering.
      });
  }

  function maybeInitMapAssociationLayer() {
    if (!/^\/mapa(?:\/|$)/.test(window.location.pathname)) return;
    installLeafletCapture();

    var L = window.L;
    if (!L || typeof L.marker !== 'function') {
      window.setTimeout(maybeInitMapAssociationLayer, 1200);
      return;
    }

    var map = null;
    if (window.__arteniaMap && typeof window.__arteniaMap.getBounds === 'function') {
      map = window.__arteniaMap;
    }
    if (!map) {
      map = findLeafletMapInstance();
    }

    if (!map) {
      window.setTimeout(maybeInitMapAssociationLayer, 1400);
      return;
    }

    ensureStyle();

    var layer = typeof L.markerClusterGroup === 'function'
      ? L.markerClusterGroup({
          showCoverageOnHover: false,
          spiderfyOnMaxZoom: true,
          disableClusteringAtZoom: 13
        })
      : L.layerGroup();
    var active = true;
    var loadedIds = new Set();
    var filterState = {
      entity_type: '',
      country_code: '',
      autonomous_community: '',
      province: '',
      municipality: '',
      craft_id: '',
      verification_level: '',
      history_documented: false,
      has_activities: false
    };

    function markerHtml() {
      return '<div style="width:16px;height:16px;border-radius:50%;background:#7ee8f4;border:2px solid #06202b;box-shadow:0 0 0 2px rgba(126,232,244,.28)"></div>';
    }

    var markerRecords = [];

    function normalizeSearch(value) {
      return String(value || '').toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function exposeSearchBridge() {
      window.__arteniaAssociationMapBridge = {
        getItems: function () {
          return markerRecords.map(function (record) { return record.item; });
        },
        setVisible: function (visible) {
          active = Boolean(visible);
          if (active) {
            map.addLayer(layer);
            fetchByBounds();
          } else {
            map.removeLayer(layer);
          }
        },
        setFilters: function (nextFilters) {
          Object.keys(filterState).forEach(function (key) {
            if (Object.prototype.hasOwnProperty.call(nextFilters || {}, key)) {
              filterState[key] = nextFilters[key];
            }
          });
          loadedIds.clear();
          markerRecords = [];
          layer.clearLayers();
          fetchByBounds();
        },
        focus: function (query) {
          var needle = normalizeSearch(query);
          var record = markerRecords.find(function (candidate) {
            var item = candidate.item || {};
            return normalizeSearch([
              item.short_name,
              item.official_name,
              item.municipality,
              item.province
            ].filter(Boolean).join(' ')).indexOf(needle) !== -1;
          });
          if (!record) return false;
          map.flyTo(record.marker.getLatLng(), Math.max(map.getZoom(), 13), { duration: 0.8 });
          record.marker.openPopup();
          return true;
        }
      };
    }

    function upsertMarker(item) {
      var id = String(item.id || item.slug || '');
      if (!id || loadedIds.has(id)) return;
      var lat = Number(item.latitude);
      var lng = Number(item.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
      loadedIds.add(id);
      var icon = L.divIcon({
        className: 'apm-neutral-icon',
        html: markerHtml(),
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      var marker = L.marker([lat, lng], { icon: icon, keyboard: true });
      var subtitle = [item.entity_type, item.municipality, item.province].filter(Boolean).join(' · ');
      marker.bindPopup([
        '<div style="min-width:210px">',
        '<strong>' + esc(item.short_name || item.official_name || 'Asociacion') + '</strong>',
        subtitle ? '<p style="margin:6px 0;color:#445">' + esc(subtitle) + '</p>' : '',
        item.is_approximate_location ? '<p style="margin:6px 0;color:#975">Ubicacion aproximada</p>' : '',
        '<a href="/asociaciones/' + esc(item.slug || '') + '">Ver ficha</a>',
        '</div>'
      ].join(''));
      markerRecords.push({ item: item, marker: marker });
      layer.addLayer(marker);
    }

    var inflight = null;
    function fetchByBounds() {
      if (!active || !map || typeof map.getBounds !== 'function') return;
      var bounds = map.getBounds();
      if (!bounds) return;
      var q = [
        'min_lat=' + encodeURIComponent(String(bounds.getSouth())),
        'max_lat=' + encodeURIComponent(String(bounds.getNorth())),
        'min_lng=' + encodeURIComponent(String(bounds.getWest())),
        'max_lng=' + encodeURIComponent(String(bounds.getEast())),
        'limit=200'
      ].join('&');

      var filters = [];
      Object.keys(filterState).forEach(function (key) {
        var value = filterState[key];
        if (typeof value === 'boolean') {
          if (value) {
            filters.push(key + '=1');
          }
          return;
        }
        if (String(value || '').trim() !== '') {
          filters.push(key + '=' + encodeURIComponent(String(value).trim()));
        }
      });
      if (filters.length) {
        q += '&' + filters.join('&');
      }

      if (inflight) {
        return;
      }
      inflight = api('/api/promoter-associations.php?' + q)
        .then(function (payload) {
          var items = Array.isArray(payload.items) ? payload.items : [];
          items.forEach(upsertMarker);
          document.dispatchEvent(new CustomEvent('artenia:associations-updated', { detail: { items: items } }));
        })
        .catch(function () {
          // Silent fallback.
        })
        .finally(function () {
          inflight = null;
        });
    }

    exposeSearchBridge();
    map.addLayer(layer);
    fetchByBounds();
    map.on('moveend', fetchByBounds);
    map.on('zoomend', fetchByBounds);
  }

  function updateAssociationSeo() {
    var path = String(window.location.pathname || '');
    var match = path.match(/^\/asociaciones\/([a-z0-9-]+)$/);
    if (!match) return;
    var slug = match[1];
    api('/api/promoter-associations.php?slug=' + encodeURIComponent(slug))
      .then(function (payload) {
        var item = payload && payload.item ? payload.item : null;
        if (!item) return;
        var relations = payload && payload.relations ? payload.relations : {};
        var craftValues = Array.isArray(relations.crafts)
          ? relations.crafts.map(function (row) { return String(row.craft_id || '').trim(); }).filter(Boolean)
          : [];
        var oficioText = 'oficios artesanos';
        var territory = [item.municipality, item.province, item.autonomous_community].filter(Boolean).join(', ');
        var title = (item.short_name || item.official_name) + ' | Asociacion promotora de ' + oficioText + ' en ' + (territory || 'su territorio') + ' | ARTENIA';
        var description = normalize(item.mission_summary || item.history_summary || item.legacy_summary, 'Ficha de asociacion promotora elaborada con fuentes publicas verificables en ARTENIA.');
        document.title = title;

        var canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalLink) canonicalLink.setAttribute('href', 'https://artenialab.com/asociaciones/' + item.slug);

        function ensureMeta(selector, content) {
          var node = document.querySelector(selector);
          if (!node) return;
          node.setAttribute('content', content);
        }

        ensureMeta('meta[name="description"]', description);
        ensureMeta('meta[property="og:title"]', title);
        ensureMeta('meta[property="og:description"]', description);
        ensureMeta('meta[property="og:url"]', 'https://artenialab.com/asociaciones/' + item.slug);
        ensureMeta('meta[property="og:image"]', 'https://artenialab.com/artenia-artesano-humano.avif');
        ensureMeta('meta[name="twitter:title"]', title);
        ensureMeta('meta[name="twitter:description"]', description);
        ensureMeta('meta[name="twitter:image"]', 'https://artenialab.com/artenia-artesano-humano.avif');

        var oldJsonLd = document.querySelector('script[data-artenia-association-jsonld]');
        if (oldJsonLd) oldJsonLd.remove();

        var jsonLd = {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: item.official_name,
          url: 'https://artenialab.com/asociaciones/' + item.slug,
          description: description,
          areaServed: [item.municipality, item.province, item.autonomous_community, item.country_code].filter(Boolean),
          knowsAbout: craftValues,
          sameAs: item.website_url ? [item.website_url] : []
        };
        var script = document.createElement('script');
        script.type = 'application/ld+json';
        script.dataset.arteniaAssociationJsonld = '1';
        script.textContent = JSON.stringify(jsonLd);
        document.head.appendChild(script);
      })
      .catch(function () {
        // Silent fallback.
      });
  }

  function bootstrap() {
    if (/^\/asociaciones(?:\/|$)/.test(window.location.pathname)) {
      mountAsociacionesRoute();
    }
    appendOficioAssociations();
    maybeInitMapAssociationLayer();
    updateAssociationSeo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
  } else {
    bootstrap();
  }
})();
