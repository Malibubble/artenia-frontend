(function () {
  'use strict';

  const COUNTER_SELECTOR = '[aria-label="Crecimiento de la comunidad ARTENIA"]';
  const DETAILS_ID = 'artenia-live-stats-details';

  function number(value) {
    return new Intl.NumberFormat(document.documentElement.lang || 'es').format(Number(value) || 0);
  }

  function countryName(code) {
    try {
      return new Intl.DisplayNames([document.documentElement.lang || 'es'], { type: 'region' }).of(code) || code;
    } catch (_error) {
      return code;
    }
  }

  function flag(code) {
    if (!/^[A-Z]{2}$/.test(code)) return '·';
    return String.fromCodePoint(...code.split('').map((letter) => 127397 + letter.charCodeAt(0)));
  }

  function makeMetric(label, value) {
    const item = document.createElement('div');
    item.className = 'artenia-live-stats__metric';
    item.innerHTML = `<strong>${number(value)}</strong><span>${label}</span>`;
    return item;
  }

  function makeCountryRow(country, knownVisits) {
    const code = String(country.code || '').toUpperCase();
    const visits = Number(country.visits) || 0;
    const percentage = knownVisits > 0 ? Math.round((visits / knownVisits) * 100) : 0;
    const row = document.createElement('li');
    row.className = 'artenia-live-stats__country';
    row.innerHTML = `
      <span class="artenia-live-stats__country-name">
        <span aria-hidden="true">${flag(code)}</span>
        <span>${countryName(code)} <small>${code}</small></span>
      </span>
      <span class="artenia-live-stats__country-value">${number(visits)} <small>${percentage}%</small></span>
    `;
    return row;
  }

  function render(counter, stats) {
    counter.querySelector(`#${DETAILS_ID}`)?.remove();
    counter.classList.add('artenia-live-counter--minimized');

    const countries = Array.isArray(stats.topCountries) ? stats.topCountries : [];
    const knownVisits = Number(stats.identifiedVisits)
      || countries.reduce((sum, country) => sum + (Number(country.visits) || 0), 0);
    const unknownVisits = Number(stats.unidentifiedVisits) || 0;
    const section = document.createElement('section');
    section.id = DETAILS_ID;
    section.className = 'artenia-live-stats';
    section.setAttribute('aria-label', 'Información completa de visitas por país');

    const compact = document.createElement('div');
    compact.className = 'artenia-live-stats__compact';
    compact.innerHTML = `
      <span class="artenia-live-stats__live"><i aria-hidden="true"></i>ARTENIA en vivo</span>
      <span><strong>${number(stats.totalVisits)}</strong> visitas · <strong>${number(stats.countries)}</strong> países · <strong>${number(stats.registrations)}</strong> perfiles</span>
    `;
    section.appendChild(compact);

    if (!stats.countryDetailsAvailable) {
      const privateNote = document.createElement('p');
      privateNote.className = 'artenia-live-stats__private-note';
      privateNote.textContent = 'El desglose está disponible al entrar en tu cuenta.';
      section.appendChild(privateNote);
      counter.appendChild(section);
      return;
    }

    const details = document.createElement('details');
    details.className = 'artenia-live-stats__details';
    const summary = document.createElement('summary');
    summary.innerHTML = '<span>Ver estadísticas completas</span><span aria-hidden="true">＋</span>';
    details.appendChild(summary);

    const body = document.createElement('div');
    body.className = 'artenia-live-stats__body';

    const metrics = document.createElement('div');
    metrics.className = 'artenia-live-stats__metrics';
    metrics.append(
      makeMetric('Total', stats.totalVisits),
      makeMetric('Hoy', stats.todayVisits),
      makeMetric('7 días', stats.weekVisits)
    );
    body.appendChild(metrics);

    const countriesHeading = document.createElement('div');
    countriesHeading.className = 'artenia-live-stats__countries-heading';
    countriesHeading.innerHTML = `<strong>Países de las visitas</strong><span>${number(stats.countries)} identificados</span>`;
    body.appendChild(countriesHeading);

    if (countries.length) {
      const list = document.createElement('ul');
      list.className = 'artenia-live-stats__countries';
      countries.forEach((country) => list.appendChild(makeCountryRow(country, knownVisits)));
      if (unknownVisits > 0) {
        const unknown = document.createElement('li');
        unknown.className = 'artenia-live-stats__country artenia-live-stats__country--unknown';
        unknown.innerHTML = `<span>Sin país identificado / histórico</span><span class="artenia-live-stats__country-value">${number(unknownVisits)}</span>`;
        list.appendChild(unknown);
      }
      body.appendChild(list);
    } else {
      const empty = document.createElement('p');
      empty.className = 'artenia-live-stats__empty';
      empty.textContent = 'Aún no hay países identificados. Las próximas visitas aparecerán aquí.';
      body.appendChild(empty);
    }

    details.appendChild(body);
    section.appendChild(details);
    counter.appendChild(section);
  }

  function installStyles() {
    if (document.getElementById('artenia-live-stats-styles')) return;
    const style = document.createElement('style');
    style.id = 'artenia-live-stats-styles';
    style.textContent = `
      .artenia-live-counter--minimized{max-width:24rem!important;padding:.72rem .9rem!important;border-radius:1rem!important}
      .artenia-live-counter--minimized>:not(.artenia-live-stats){display:none!important}
      .artenia-live-stats{margin:0;padding:0;color:#fff}
      .artenia-live-stats__compact{display:flex;align-items:center;justify-content:space-between;gap:.8rem;font-size:.62rem;color:rgba(255,255,255,.5);white-space:nowrap}
      .artenia-live-stats__compact strong{font-size:.7rem;color:rgba(255,255,255,.88);font-variant-numeric:tabular-nums}
      .artenia-live-stats__live{display:inline-flex;align-items:center;gap:.38rem;font-size:.56rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(207,250,254,.72)}
      .artenia-live-stats__live i{width:.38rem;height:.38rem;border-radius:999px;background:#a5f3fc;box-shadow:0 0 .65rem rgba(165,243,252,.65)}
      .artenia-live-stats__private-note{margin:.35rem 0 0;text-align:right;font-size:.52rem;color:rgba(255,255,255,.28)}
      .artenia-live-stats__details{margin-top:.6rem;border-top:1px solid rgba(255,255,255,.08)}
      .artenia-live-stats__details summary{display:flex;align-items:center;justify-content:space-between;padding:.55rem 0 0;cursor:pointer;list-style:none;font-size:.6rem;color:rgba(207,250,254,.68)}
      .artenia-live-stats__details summary::-webkit-details-marker{display:none}
      .artenia-live-stats__details[open] summary span:last-child{transform:rotate(45deg)}
      .artenia-live-stats__body{padding-top:.15rem}
      .artenia-live-stats__countries-heading{display:flex;align-items:center;justify-content:space-between;gap:.75rem}
      .artenia-live-stats__countries-heading strong{font-size:.7rem;letter-spacing:.08em;text-transform:uppercase}
      .artenia-live-stats__countries-heading span{font-size:.6rem;color:rgba(255,255,255,.42)}
      .artenia-live-stats__metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.4rem;margin-top:.65rem}
      .artenia-live-stats__metric{padding:.55rem .6rem;border-radius:.7rem;background:rgba(255,255,255,.045);text-align:center}
      .artenia-live-stats__metric strong{display:block;font-size:.9rem;font-variant-numeric:tabular-nums}
      .artenia-live-stats__metric span{display:block;margin-top:.12rem;font-size:.55rem;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.45)}
      .artenia-live-stats__countries-heading{margin-top:.9rem}
      .artenia-live-stats__countries{max-height:9.5rem;margin:.55rem 0 0;padding:0;overflow-y:auto;list-style:none;scrollbar-width:thin}
      .artenia-live-stats__country{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.42rem .15rem;border-top:1px solid rgba(255,255,255,.07);font-size:.68rem}
      .artenia-live-stats__country-name{display:flex;min-width:0;align-items:center;gap:.45rem}
      .artenia-live-stats__country small{font-size:.52rem;color:rgba(255,255,255,.35)}
      .artenia-live-stats__country-value{flex:none;font-variant-numeric:tabular-nums;color:rgba(207,250,254,.9)}
      .artenia-live-stats__country--unknown{color:rgba(255,255,255,.4)}
      .artenia-live-stats__empty{margin:.55rem 0 0;font-size:.65rem;line-height:1rem;color:rgba(255,255,255,.42)}
      @media (max-width:420px){.artenia-live-stats__compact{white-space:normal}.artenia-live-stats__live{display:none}}
    `;
    document.head.appendChild(style);
  }

  async function enhance(counter) {
    if (counter.dataset.countryDetailsLoading === 'true' || counter.querySelector(`#${DETAILS_ID}`)) return;
    counter.dataset.countryDetailsLoading = 'true';
    try {
      const response = await fetch('/api/stats.php', {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { Accept: 'application/json' }
      });
      const stats = await response.json();
      if (response.ok && stats && stats.success) render(counter, stats);
    } catch (_error) {
      // El contador básico de React continúa visible si la información ampliada falla.
    } finally {
      counter.dataset.countryDetailsLoading = 'false';
    }
  }

  function scan() {
    const counter = document.querySelector(COUNTER_SELECTOR);
    if (counter && counter.dataset.countryDetailsScheduled !== 'true') {
      counter.dataset.countryDetailsScheduled = 'true';
      window.setTimeout(() => enhance(counter), 500);
    }
  }

  installStyles();
  scan();
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
})();
