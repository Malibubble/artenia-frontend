(function () {
  "use strict";

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function hasText(value) {
    return typeof value === "string" && value.trim().length > 0;
  }

  function hasArray(value) {
    return Array.isArray(value) && value.length > 0;
  }

  function hasImage(value) {
    return value && hasText(value.image);
  }

  function hasReputation(value) {
    if (!value) return false;
    return hasArray(value.media) || hasArray(value.contextFacts) || (value.clients && hasArray(value.clients.items));
  }

  function mountFonts() {
    if (document.getElementById("artenia-story-fonts")) return;
    var preconnectA = document.createElement("link");
    preconnectA.rel = "preconnect";
    preconnectA.href = "https://fonts.googleapis.com";
    preconnectA.id = "artenia-story-fonts";

    var preconnectB = document.createElement("link");
    preconnectB.rel = "preconnect";
    preconnectB.href = "https://fonts.gstatic.com";
    preconnectB.crossOrigin = "anonymous";

    var stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600&family=Manrope:wght@400;500;700&display=swap";

    document.head.appendChild(preconnectA);
    document.head.appendChild(preconnectB);
    document.head.appendChild(stylesheet);
  }

  function mountStyles() {
    if (document.getElementById("artenia-story-layout-style")) return;
    var style = document.createElement("style");
    style.id = "artenia-story-layout-style";
    style.textContent = [
      ":root{--story-bg:#f5efe4;--story-ink:#171412;--story-soft:#6a5f54;--story-accent:#9d5f2f;--story-line:rgba(23,20,18,.18);--story-paper:#f8f3ea;}",
      "body[data-artenia-story='1']{margin:0;background:radial-gradient(1200px 700px at 80% -10%, rgba(157,95,47,.12), transparent 60%),linear-gradient(180deg,#f8f3ea 0%,#f3ebdf 45%,#efe4d2 100%);color:var(--story-ink);font-family:'Manrope','Avenir Next','Segoe UI',sans-serif;}",
      ".story-landing{width:100%;overflow-x:hidden;color:var(--story-ink);}",
      ".story-hero{position:relative;min-height:94vh;display:grid;align-items:end;padding:11vh 6vw 8vh;border-bottom:1px solid var(--story-line);background:linear-gradient(180deg,rgba(18,14,11,.08) 0%,rgba(18,14,11,.42) 65%,rgba(18,14,11,.62) 100%),var(--story-hero-image) center/cover no-repeat;}",
      ".story-hero-inner{max-width:900px;color:#f8f2e8;}",
      ".story-kicker{margin:0 0 14px;letter-spacing:.12em;text-transform:uppercase;font-size:12px;font-weight:700;opacity:.9;}",
      ".story-title{margin:0;font-family:'Fraunces','Iowan Old Style','Times New Roman',serif;font-size:clamp(42px,8vw,100px);line-height:.95;letter-spacing:-.02em;}",
      ".story-meta{margin:18px 0 0;font-size:14px;letter-spacing:.06em;text-transform:uppercase;opacity:.9;}",
      ".story-section{max-width:1200px;margin:0 auto;padding:clamp(52px,9vw,130px) 6vw;}",
      ".story-image-break{position:relative;min-height:84vh;background:#0f0f0f;margin:0;display:grid;align-items:end;}",
      ".story-image-break img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;}",
      ".story-image-break figcaption{position:relative;z-index:2;margin:0;padding:20px 6vw 28px;color:#f8f3ea;background:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.68) 70%);font-size:13px;letter-spacing:.09em;text-transform:uppercase;}",
      ".story-intro{font-family:'Fraunces','Iowan Old Style','Times New Roman',serif;font-size:clamp(26px,4vw,46px);line-height:1.2;max-width:19ch;margin:0;}",
      ".story-eyebrow{margin:0 0 12px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--story-soft);font-weight:700;}",
      ".story-chapters{display:grid;gap:46px;}",
      ".story-chapter{max-width:820px;}",
      ".story-chapter h3{margin:0 0 12px;font-family:'Fraunces','Iowan Old Style','Times New Roman',serif;font-size:clamp(30px,4.2vw,54px);line-height:1.05;}",
      ".story-chapter p{margin:0;font-size:clamp(18px,1.95vw,28px);line-height:1.45;color:#2b2520;}",
      ".story-wide-band{background:rgba(255,255,255,.36);border-top:1px solid var(--story-line);border-bottom:1px solid var(--story-line);}",
      ".story-officio-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:52px;align-items:start;}",
      ".story-officio-grid h2,.story-section h2{margin:0 0 20px;font-family:'Fraunces','Iowan Old Style','Times New Roman',serif;font-size:clamp(34px,4.4vw,62px);line-height:1;}",
      ".story-list{margin:0;padding:0;list-style:none;display:grid;gap:14px;}",
      ".story-list li{padding:0 0 14px;border-bottom:1px solid var(--story-line);font-size:18px;line-height:1.45;}",
      ".story-pieces{display:grid;gap:2px;background:#000;}",
      ".story-piece{position:relative;min-height:90vh;overflow:hidden;background:#000;}",
      ".story-piece img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;}",
      ".story-piece-copy{position:absolute;left:0;right:0;bottom:0;padding:24px 6vw 30px;color:#f8f3ea;background:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.78) 80%);}",
      ".story-piece-copy h3{margin:0 0 6px;font-family:'Fraunces','Iowan Old Style','Times New Roman',serif;font-size:clamp(30px,5.2vw,64px);line-height:.98;}",
      ".story-piece-copy p{margin:0;max-width:52ch;line-height:1.5;color:rgba(248,243,234,.94);}",
      ".story-timeline{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px;}",
      ".story-timeline-item{padding-top:12px;border-top:2px solid #2b2520;}",
      ".story-timeline-year{font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:var(--story-soft);font-weight:700;}",
      ".story-timeline-item h3{margin:8px 0 0;font-family:'Fraunces','Iowan Old Style','Times New Roman',serif;font-size:30px;line-height:1.08;}",
      ".story-reputation{border-top:1px solid var(--story-line);border-bottom:1px solid var(--story-line);background:rgba(255,255,255,.3);}",
      ".story-reputation-intro{margin:0;max-width:26ch;font-family:'Fraunces','Iowan Old Style','Times New Roman',serif;font-size:clamp(30px,4.8vw,58px);line-height:1.06;}",
      ".story-reputation-grid{margin-top:34px;display:grid;grid-template-columns:1fr 1fr;gap:36px 54px;align-items:start;}",
      ".story-reputation-block h3{margin:0 0 12px;font-family:'Fraunces','Iowan Old Style','Times New Roman',serif;font-size:clamp(24px,3.2vw,38px);line-height:1.08;}",
      ".story-reputation-block p{margin:0;color:#2b2520;line-height:1.6;}",
      ".story-reputation-media,.story-reputation-facts,.story-clients-list{margin:0;padding:0;list-style:none;display:grid;gap:12px;}",
      ".story-reputation-media li,.story-reputation-facts li{padding-bottom:12px;border-bottom:1px solid var(--story-line);}",
      ".story-reputation-source{display:inline-block;margin-top:5px;font-size:12px;letter-spacing:.07em;text-transform:uppercase;color:var(--story-soft);}",
      ".story-clients-list{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 18px;}",
      ".story-clients-list li{font-size:15px;line-height:1.4;color:#2b2520;}",
      ".story-client-panel{margin:20px 0 0;padding-top:14px;border-top:1px solid var(--story-line);}",
      ".story-client-panel img{display:block;width:100%;height:auto;border:1px solid var(--story-line);}",
      ".story-client-panel figcaption{margin-top:8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--story-soft);}",
      ".story-territory p,.story-future p{margin:0;max-width:72ch;font-size:19px;line-height:1.6;color:#2b2520;}",
      ".story-quote{padding:clamp(52px,9vw,130px) 6vw;text-align:center;background:#13110f;color:#f5eee3;}",
      ".story-quote blockquote{margin:0 auto;max-width:18ch;font-family:'Fraunces','Iowan Old Style','Times New Roman',serif;font-size:clamp(32px,5.6vw,76px);line-height:1.02;}",
      ".story-quote p{margin:16px 0 0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:rgba(245,238,227,.78);}",
      ".story-cta-group{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px;}",
      ".story-cta{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 20px;border-radius:999px;border:1px solid #2b2520;color:#2b2520;text-decoration:none;font-weight:700;letter-spacing:.02em;}",
      ".story-cta-primary{background:#2b2520;color:#f7f0e4;border-color:#2b2520;}",
      ".story-footer{padding:60px 6vw 90px;border-top:1px solid var(--story-line);}",
      ".story-sources{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px;}",
      ".story-sources a{color:#2b2520;}",
      "@media (max-width:920px){.story-hero{min-height:72vh;padding:11vh 7vw 8vh}.story-officio-grid{grid-template-columns:1fr;gap:34px}.story-reputation-grid{grid-template-columns:1fr;gap:28px}.story-clients-list{grid-template-columns:1fr}.story-intro{max-width:none}.story-piece{min-height:76vh}}"
    ].join("");
    document.head.appendChild(style);
  }

  function renderLinks(links, className, primaryLabel) {
    if (!hasArray(links)) return "";
    return [
      '<div class="' + esc(className) + '">',
      links.map(function (item) {
        if (!item || !hasText(item.label) || !hasText(item.href)) return "";
        var isPrimary = primaryLabel && item.label === primaryLabel;
        return '<a class="story-cta ' + (isPrimary ? "story-cta-primary" : "") + '" href="' + esc(item.href) + '">' + esc(item.label) + '</a>';
      }).join(""),
      "</div>"
    ].join("");
  }

  function render(data) {
    var parts = [];
    var heroImage = data && data.hero && hasText(data.hero.image) ? data.hero.image : "";

    parts.push('<main class="story-landing">');

    if (heroImage) {
      parts.push('<header class="story-hero" style="--story-hero-image:url(\'' + esc(heroImage) + '\')">');
      parts.push('<div class="story-hero-inner">');
      if (data.hero && hasText(data.hero.kicker)) {
        parts.push('<p class="story-kicker">' + esc(data.hero.kicker) + '</p>');
      }
      if (hasText(data.name)) {
        parts.push('<h1 class="story-title">' + esc(data.name) + '</h1>');
      }
      parts.push('<p class="story-meta">' + esc(data.craft || "") + ' · ' + esc(data.place || "") + '</p>');
      parts.push("</div>");
      parts.push("</header>");
    }

    if (hasText(data.intro)) {
      parts.push('<section class="story-section">');
      parts.push('<p class="story-eyebrow">Introduccion</p>');
      parts.push('<p class="story-intro">' + esc(data.intro) + '</p>');
      parts.push("</section>");
    }

    if (hasImage(data.portrait)) {
      parts.push('<figure class="story-image-break">');
      parts.push('<img src="' + esc(data.portrait.image) + '" alt="' + esc(data.portrait.alt || data.name || "Con Alma Design") + '">');
      parts.push('<figcaption>Con Alma Design</figcaption>');
      parts.push('</figure>');
    }

    if (hasText(data.quote)) {
      parts.push('<section class="story-quote">');
      parts.push('<blockquote>' + esc(data.quote) + '</blockquote>');
      if (hasText(data.quoteSource)) {
        parts.push('<p>' + esc(data.quoteSource) + '</p>');
      }
      parts.push('</section>');
    }

    if (hasArray(data.chapters)) {
      parts.push('<section class="story-section">');
      parts.push('<p class="story-eyebrow">Storytelling</p>');
      parts.push('<div class="story-chapters">');
      data.chapters.forEach(function (chapter) {
        if (!chapter || !hasText(chapter.title) || !hasText(chapter.body)) return;
        parts.push('<article class="story-chapter">');
        parts.push('<h3>' + esc(chapter.title) + '</h3>');
        parts.push('<p>' + esc(chapter.body) + '</p>');
        parts.push('</article>');
      });
      parts.push('</div>');
      parts.push('</section>');
    }

    if (data.materialStory && (hasText(data.materialStory.title) || hasText(data.materialStory.body) || hasText(data.materialStory.image))) {
      parts.push('<section class="story-wide-band"><div class="story-section">');
      parts.push('<p class="story-eyebrow">El material</p>');
      if (hasText(data.materialStory.title)) {
        parts.push('<h2>' + esc(data.materialStory.title) + '</h2>');
      }
      if (hasText(data.materialStory.body)) {
        parts.push('<p class="story-intro" style="font-size:clamp(24px,3.6vw,40px)">' + esc(data.materialStory.body) + '</p>');
      }
      parts.push('</div></section>');
      if (hasText(data.materialStory.image)) {
        parts.push('<figure class="story-image-break">');
        parts.push('<img src="' + esc(data.materialStory.image) + '" alt="' + esc(data.materialStory.alt || "Madera y ceramica") + '">');
        parts.push('<figcaption>Madera + ceramica</figcaption>');
        parts.push('</figure>');
      }
    }

    if (hasArray(data.pieces)) {
      parts.push('<section class="story-section">');
      parts.push('<p class="story-eyebrow">Piezas</p>');
      parts.push('<h2>Coleccion real</h2>');
      parts.push('</section>');
      parts.push('<section class="story-pieces">');
      data.pieces.forEach(function (piece) {
        if (!piece || !hasText(piece.image) || !hasText(piece.name)) return;
        parts.push('<article class="story-piece">');
        parts.push('<img src="' + esc(piece.image) + '" alt="' + esc(piece.alt || piece.name) + '">');
        parts.push('<div class="story-piece-copy">');
        parts.push('<h3>' + esc(piece.name) + '</h3>');
        if (hasText(piece.note)) {
          parts.push('<p>' + esc(piece.note) + '</p>');
        }
        if (hasText(piece.href)) {
          parts.push('<p style="margin-top:10px"><a style="color:#f8f3ea" href="' + esc(piece.href) + '">Ver pieza en web oficial</a></p>');
        }
        parts.push('</div>');
        parts.push('</article>');
      });
      parts.push('</section>');
    }

    if (data.craftTime && (hasText(data.craftTime.title) || hasText(data.craftTime.body))) {
      parts.push('<section class="story-wide-band"><div class="story-section">');
      parts.push('<p class="story-eyebrow">El tiempo</p>');
      if (hasText(data.craftTime.title)) {
        parts.push('<h2>' + esc(data.craftTime.title) + '</h2>');
      }
      if (hasText(data.craftTime.body)) {
        parts.push('<p class="story-intro" style="font-size:clamp(24px,3.6vw,40px)">' + esc(data.craftTime.body) + '</p>');
      }
      parts.push('</div></section>');
    }

    if (data.mediterranean && (hasText(data.mediterranean.title) || hasText(data.mediterranean.body) || hasText(data.mediterranean.image))) {
      parts.push('<section class="story-section story-territory">');
      parts.push('<p class="story-eyebrow">Mediterraneo</p>');
      if (hasText(data.mediterranean.title)) {
        parts.push('<h2>' + esc(data.mediterranean.title) + '</h2>');
      }
      if (hasText(data.mediterranean.body)) {
        parts.push('<p>' + esc(data.mediterranean.body) + '</p>');
      }
      parts.push('</section>');
      if (hasText(data.mediterranean.image)) {
        parts.push('<figure class="story-image-break">');
        parts.push('<img src="' + esc(data.mediterranean.image) + '" alt="' + esc(data.mediterranean.alt || "Mediterraneo Gourmet") + '">');
        parts.push('<figcaption>Mediterraneo Gourmet</figcaption>');
        parts.push('</figure>');
      }
    }

    if (hasArray(data.process) || hasArray(data.materials)) {
      parts.push('<section class="story-wide-band"><div class="story-section">');
      parts.push('<div class="story-officio-grid">');

      if (hasArray(data.process)) {
        parts.push('<div>');
        parts.push('<p class="story-eyebrow">El oficio</p>');
        parts.push('<h2>Proceso artesanal</h2>');
        parts.push('<ul class="story-list">');
        data.process.forEach(function (step) {
          if (!step || !hasText(step.title) || !hasText(step.body)) return;
          parts.push('<li><strong>' + esc(step.title) + '.</strong> ' + esc(step.body) + '</li>');
        });
        parts.push('</ul>');
        parts.push('</div>');
      }

      if (hasArray(data.materials)) {
        parts.push('<div>');
        parts.push('<p class="story-eyebrow">Materiales</p>');
        parts.push('<h2>Materia viva</h2>');
        parts.push('<ul class="story-list">');
        data.materials.forEach(function (material) {
          if (!hasText(material)) return;
          parts.push('<li>' + esc(material) + '</li>');
        });
        parts.push('</ul>');
        parts.push('</div>');
      }

      parts.push('</div>');
      parts.push('</div></section>');
    }

    if (hasArray(data.timeline)) {
      parts.push('<section class="story-section">');
      parts.push('<p class="story-eyebrow">Linea temporal</p>');
      parts.push('<h2>Cronologia</h2>');
      parts.push('<div class="story-timeline">');
      data.timeline.forEach(function (item) {
        if (!item || !hasText(item.year) || !hasText(item.title)) return;
        parts.push('<article class="story-timeline-item">');
        parts.push('<p class="story-timeline-year">' + esc(item.year) + '</p>');
        parts.push('<h3>' + esc(item.title) + '</h3>');
        if (hasText(item.detail)) {
          parts.push('<p>' + esc(item.detail) + '</p>');
        }
        parts.push('</article>');
      });
      parts.push('</div>');
      parts.push('</section>');
    }

    if (hasReputation(data.reputation)) {
      parts.push('<section class="story-section story-reputation">');
      parts.push('<p class="story-eyebrow">Reconocimientos</p>');
      parts.push('<h2 class="story-reputation-intro">' + esc(data.reputation.intro || "Una practica que tambien ha sido mirada desde fuera.") + '</h2>');
      parts.push('<div class="story-reputation-grid">');

      if (hasArray(data.reputation.media)) {
        parts.push('<article class="story-reputation-block">');
        parts.push('<h3>' + esc(data.reputation.mediaTitle || "En los medios") + '</h3>');
        parts.push('<ul class="story-reputation-media">');
        data.reputation.media.forEach(function (item) {
          if (!item || !hasText(item.outlet) || !hasText(item.sourceUrl)) return;
          parts.push('<li>');
          parts.push('<p><strong>' + esc(item.outlet) + '</strong>' + (hasText(item.title) ? ' · ' + esc(item.title) : '') + '</p>');
          if (hasText(item.note)) {
            parts.push('<p>' + esc(item.note) + '</p>');
          }
          parts.push('<a class="story-reputation-source" href="' + esc(item.sourceUrl) + '">Fuente</a>');
          parts.push('</li>');
        });
        parts.push('</ul>');
        parts.push('</article>');
      }

      if (hasArray(data.reputation.contextFacts)) {
        parts.push('<article class="story-reputation-block">');
        parts.push('<h3>' + esc(data.reputation.contextFactsTitle || "Apuntes documentados") + '</h3>');
        parts.push('<ul class="story-reputation-facts">');
        data.reputation.contextFacts.forEach(function (fact) {
          if (!fact || !hasText(fact.text) || !hasText(fact.sourceUrl)) return;
          parts.push('<li><p>' + esc(fact.text) + '</p><a class="story-reputation-source" href="' + esc(fact.sourceUrl) + '">Fuente</a></li>');
        });
        parts.push('</ul>');
        parts.push('</article>');
      }

      if (data.reputation.clients && hasArray(data.reputation.clients.items)) {
        parts.push('<article class="story-reputation-block" style="grid-column:1/-1">');
        parts.push('<h3>' + esc(data.reputation.clients.title || "Trayectoria / Clientes") + '</h3>');
        if (hasText(data.reputation.clients.subtitle)) {
          parts.push('<p>' + esc(data.reputation.clients.subtitle) + '</p>');
        }
        parts.push('<ul class="story-clients-list" style="margin-top:14px">');
        data.reputation.clients.items.forEach(function (item) {
          if (!hasText(item)) return;
          parts.push('<li>' + esc(item) + '</li>');
        });
        parts.push('</ul>');

        if (hasText(data.reputation.clients.sourceUrl)) {
          parts.push('<a class="story-reputation-source" href="' + esc(data.reputation.clients.sourceUrl) + '">Fuente del panel oficial</a>');
        }

        if (hasText(data.reputation.clients.panelImage)) {
          parts.push('<figure class="story-client-panel">');
          parts.push('<img src="' + esc(data.reputation.clients.panelImage) + '" alt="' + esc(data.reputation.clients.panelAlt || "Panel oficial de clientes") + '">');
          parts.push('<figcaption>Panel oficial "Nuestros clientes"</figcaption>');
          parts.push('</figure>');
        }

        parts.push('</article>');
      }

      parts.push('</div>');
      parts.push('</section>');
    }

    if (data.territory && (hasText(data.territory.body) || hasText(data.territory.title))) {
      parts.push('<section class="story-section story-territory">');
      parts.push('<p class="story-eyebrow">Territorio</p>');
      parts.push('<h2>' + esc(data.territory.title || "Territorio") + '</h2>');
      if (hasText(data.territory.body)) {
        parts.push('<p>' + esc(data.territory.body) + '</p>');
      }
      if (hasText(data.territory.mapUrl)) {
        parts.push(renderLinks([{ label: "Abrir en mapa", href: data.territory.mapUrl }], "story-cta-group"));
      }
      parts.push('</section>');
    }

    if (data.futureKnowledge && hasArray(data.futureKnowledge.principles)) {
      parts.push('<section class="story-wide-band"><div class="story-section story-future">');
      parts.push('<p class="story-eyebrow">ARTENIA</p>');
      parts.push('<h2>' + esc(data.futureKnowledge.title || "Lo que nos llevamos al futuro") + '</h2>');
      parts.push('<ul class="story-list">');
      data.futureKnowledge.principles.forEach(function (line) {
        if (!hasText(line)) return;
        parts.push('<li>' + esc(line) + '</li>');
      });
      parts.push('</ul>');
      parts.push('</div></section>');
    }

    if (hasArray(data.experiences) || hasArray(data.links)) {
      parts.push('<section class="story-section">');
      parts.push('<p class="story-eyebrow">Experiencias y enlaces</p>');
      parts.push('<h2>Seguir explorando</h2>');
      if (hasArray(data.experiences)) {
        parts.push(renderLinks(data.experiences, "story-cta-group", "Ver ficha"));
      }
      if (hasArray(data.links)) {
        parts.push('<ul class="story-list" style="margin-top:22px">');
        data.links.forEach(function (item) {
          if (!item || !hasText(item.label) || !hasText(item.href)) return;
          parts.push('<li><a href="' + esc(item.href) + '">' + esc(item.label) + '</a></li>');
        });
        parts.push('</ul>');
      }
      parts.push('</section>');
    }

    parts.push('<footer class="story-footer">');
    parts.push('<a class="story-cta story-cta-primary" href="/artesanos/con-alma-design">Volver a ficha</a>');
    if (hasArray(data.sources)) {
      parts.push('<div class="story-sources">');
      data.sources.forEach(function (source) {
        if (!source || !hasText(source.label) || !hasText(source.href)) return;
        parts.push('<a href="' + esc(source.href) + '">' + esc(source.label) + '</a>');
      });
      parts.push('</div>');
    }
    parts.push('</footer>');

    parts.push('</main>');
    return parts.join("");
  }

  function mount(root, data) {
    if (!root || !data) return;
    mountFonts();
    mountStyles();
    document.body.setAttribute("data-artenia-story", "1");
    root.innerHTML = render(data);
  }

  window.ArteniaArtisanStoryLayout = {
    mount: mount
  };
})();
