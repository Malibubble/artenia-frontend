(function () {
  var STORAGE_KEY = 'artenia_lang';
  var DEFAULT_LANG = 'es';
  var SUPPORTED = ['es', 'en', 'fr'];
  var LOCALE_LABELS = {
    es: 'Español',
    en: 'English',
    fr: 'Français'
  };
  var MENU_LABELS = {
    es: 'Idioma',
    en: 'Language',
    fr: 'Langue'
  };
  var SCRIPT_BY_LANG = {
    en: '/i18n/lang-en.js',
    fr: '/i18n/lang-fr.js'
  };

  var HOME_HERO_TRANSLATIONS = {
    en: {
      'Hay cosas que solo una persona sabe hacer.': 'There are things only a person can do.',
      'Cada oficio guarda la historia de quien lo mantiene vivo.': 'Each craft preserves the story of those who keep it alive.',
      'Una tradición sigue viva cuando alguien la hace suya.': 'A tradition stays alive when someone makes it their own.',
      'Las manos no repiten el pasado. Lo llevan hacia el futuro.': 'Hands do not repeat the past. They carry it toward the future.',
      'Cada pieza conserva una historia que no puede hacerse en serie.': 'Each piece preserves a story that cannot be mass-produced.'
    },
    fr: {
      'Hay cosas que solo una persona sabe hacer.': 'Il y a des choses que seule une personne sait faire.',
      'Cada oficio guarda la historia de quien lo mantiene vivo.': 'Chaque métier garde l\'histoire de celles et ceux qui le maintiennent vivant.',
      'Una tradición sigue viva cuando alguien la hace suya.': 'Une tradition reste vivante quand quelqu\'un se l\'approprie.',
      'Las manos no repiten el pasado. Lo llevan hacia el futuro.': 'Les mains ne répètent pas le passé. Elles le portent vers l\'avenir.',
      'Cada pieza conserva una historia que no puede hacerse en serie.': 'Chaque pièce conserve une histoire qui ne peut pas être produite en série.'
    }
  };

  var state = {
    lang: null,
    dict: null,
    placeholders: null,
    translationObserver: null,
    translationObserverTimer: null,
    translationHeartbeat: null,
    homeHeroTimer: null,
    userMenuObserver: null
  };

  function normalizeForLookup(value) {
    return String(value || '')
      .replace(/\u2019/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  function isSupported(lang) {
    return SUPPORTED.indexOf(lang) !== -1;
  }

  function getSavedLang() {
    try {
      var lang = localStorage.getItem(STORAGE_KEY);
      return isSupported(lang) ? lang : null;
    } catch (_) {
      return null;
    }
  }

  function getLangFromQuery() {
    try {
      var url = new URL(window.location.href);
      var lang = url.searchParams.get('lang');
      return isSupported(lang) ? lang : null;
    } catch (_) {
      return null;
    }
  }

  function saveLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {
      // Ignore storage issues.
    }
  }

  function setDocumentLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
  }

  function loadLanguageScript(lang) {
    var src = SCRIPT_BY_LANG[lang];
    if (!src) return Promise.resolve();

    var existing = document.querySelector('script[data-i18n-lang="' + lang + '"]');
    if (existing) return Promise.resolve();

    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-i18n-lang', lang);
      script.onload = function () { resolve(); };
      script.onerror = function () { reject(new Error('No se pudo cargar ' + src)); };
      document.head.appendChild(script);
    });
  }

  function showInitialLanguagePrompt() {
    if (document.getElementById('artenia-lang-onboarding')) return;

    var overlay = document.createElement('div');
    overlay.id = 'artenia-lang-onboarding';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.zIndex = '2147483647';
    overlay.style.display = 'grid';
    overlay.style.placeItems = 'center';
    overlay.style.background = 'radial-gradient(circle at 20% 10%, rgba(16,43,55,.88), rgba(7,16,20,.96))';
    overlay.style.backdropFilter = 'blur(6px)';

    var card = document.createElement('div');
    card.style.width = 'min(520px, calc(100vw - 32px))';
    card.style.border = '1px solid rgba(103,232,249,.35)';
    card.style.borderRadius = '20px';
    card.style.background = 'rgba(7,16,20,.92)';
    card.style.padding = '22px';
    card.style.boxShadow = '0 24px 60px rgba(0,0,0,.45)';
    card.style.fontFamily = '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif';
    card.style.color = '#eafcff';

    var title = document.createElement('h2');
    title.textContent = 'Selecciona tu idioma';
    title.style.margin = '0 0 8px';
    title.style.fontSize = '22px';

    var subtitle = document.createElement('p');
    subtitle.textContent = 'Selecciona tu idioma · Choose your language · Choisissez votre langue';
    subtitle.style.margin = '0 0 16px';
    subtitle.style.color = '#9ad7e2';
    subtitle.style.fontSize = '14px';

    var grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(3,minmax(0,1fr))';
    grid.style.gap = '10px';

    SUPPORTED.forEach(function (lang) {
      var button = document.createElement('button');
      button.type = 'button';
      button.style.height = '46px';
      button.style.borderRadius = '12px';
      button.style.border = '1px solid rgba(103,232,249,.45)';
      button.style.background = 'transparent';
      button.style.color = '#eafcff';
      button.style.fontWeight = '700';
      button.style.cursor = 'pointer';
      button.textContent = lang.toUpperCase();
      button.addEventListener('click', function () {
        saveLang(lang);
        overlay.remove();
        applyLanguage(lang);
      });
      grid.appendChild(button);
    });

    card.appendChild(title);
    card.appendChild(subtitle);
    card.appendChild(grid);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
  }

  function replaceTextNodes(container, dict) {
    if (!container || !dict) return;
    var keys = Object.keys(dict);
    var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
        var parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        var tag = parent.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var textNode;
    while ((textNode = walker.nextNode())) {
      var raw = textNode.nodeValue;
      var original = raw.trim();
      if (!original) continue;

      if (dict[original]) {
        textNode.nodeValue = raw.replace(original, dict[original]);
        continue;
      }

      var normalizedOriginal = normalizeForLookup(original);
      var normalizedMatch = null;
      for (var n = 0; n < keys.length; n += 1) {
        var normalizedKey = normalizeForLookup(keys[n]);
        if (normalizedKey === normalizedOriginal) {
          normalizedMatch = keys[n];
          break;
        }
      }
      if (normalizedMatch) {
        textNode.nodeValue = raw.replace(original, dict[normalizedMatch]);
        continue;
      }

      var translated = raw;
      for (var i = 0; i < keys.length; i += 1) {
        var source = keys[i];
        if (source.length < 4) continue;
        if (translated.indexOf(source) !== -1) {
          translated = translated.split(source).join(dict[source]);
        }
      }
      if (translated !== raw) {
        textNode.nodeValue = translated;
      }
    }
  }

  function replaceAttributeTexts(dict) {
    if (!dict) return;
    var attrs = ['aria-label', 'title', 'alt', 'value'];
    var nodes = document.querySelectorAll('[aria-label], [title], img[alt], input[value], button[value]');
    var keys = Object.keys(dict);

    for (var i = 0; i < nodes.length; i += 1) {
      var node = nodes[i];
      for (var j = 0; j < attrs.length; j += 1) {
        var attr = attrs[j];
        if (!node.hasAttribute(attr)) continue;
        var current = node.getAttribute(attr);
        if (!current) continue;

        if (dict[current]) {
          node.setAttribute(attr, dict[current]);
          continue;
        }

        var translated = current;
        for (var k = 0; k < keys.length; k += 1) {
          var source = keys[k];
          if (source.length < 4) continue;
          if (translated.indexOf(source) !== -1) {
            translated = translated.split(source).join(dict[source]);
          }
        }
        if (translated !== current) {
          node.setAttribute(attr, translated);
        }
      }
    }
  }

  function replacePlaceholders(placeholders) {
    if (!placeholders) return;
    var fields = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    for (var i = 0; i < fields.length; i += 1) {
      var field = fields[i];
      var current = field.getAttribute('placeholder') || '';
      if (placeholders[current]) {
        field.setAttribute('placeholder', placeholders[current]);
      }
    }
  }

  function applyTranslations() {
    if (!state.dict) return;
    replaceTextNodes(document.body, state.dict);
    replaceAttributeTexts(state.dict);
    replacePlaceholders(state.placeholders);
  }

  function enforceHomeHeroTranslation() {
    if (location.pathname !== '/' || state.lang === 'es') return;
    var heading = document.querySelector('main h1');
    if (!heading) return;
    var table = HOME_HERO_TRANSLATIONS[state.lang];
    if (!table) return;

    var current = normalizeForLookup(heading.textContent || '');
    var keys = Object.keys(table);
    for (var i = 0; i < keys.length; i += 1) {
      var source = normalizeForLookup(keys[i]);
      if (current === source) {
        heading.textContent = table[keys[i]];
        return;
      }
    }
  }

  function startHomeHeroEnforcer() {
    if (state.homeHeroTimer) return;
    state.homeHeroTimer = setInterval(function () {
      enforceHomeHeroTranslation();
    }, 250);
  }

  function stopHomeHeroEnforcer() {
    if (!state.homeHeroTimer) return;
    clearInterval(state.homeHeroTimer);
    state.homeHeroTimer = null;
  }

  function startTranslationHeartbeat() {
    if (state.translationHeartbeat) return;
    state.translationHeartbeat = setInterval(function () {
      if (state.lang === 'es' || !state.dict) return;
      applyTranslations();
        enforceHomeHeroTranslation();
      injectLanguageInUserMenus();
    }, 800);
  }

  function stopTranslationHeartbeat() {
    if (!state.translationHeartbeat) return;
    clearInterval(state.translationHeartbeat);
    state.translationHeartbeat = null;
  }

  function startTranslationObserver() {
    if (state.translationObserver) return;
    state.translationObserver = new MutationObserver(function () {
      clearTimeout(state.translationObserverTimer);
      state.translationObserverTimer = setTimeout(function () {
        applyTranslations();
        injectLanguageInUserMenus();
      }, 80);
    });
    state.translationObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['aria-label', 'title', 'alt', 'value', 'placeholder']
    });
  }

  function buildLangButton(lang) {
    var button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('data-artenia-lang-option', lang);
    button.style.width = '100%';
    button.style.border = '0';
    button.style.borderRadius = '8px';
    button.style.background = lang === state.lang ? 'rgba(103,232,249,.18)' : 'transparent';
    button.style.color = lang === state.lang ? '#67e8f9' : '#d8f8ff';
    button.style.textAlign = 'left';
    button.style.padding = '7px 9px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '12px';
    button.style.fontWeight = '600';
    button.textContent = lang.toUpperCase() + ' · ' + LOCALE_LABELS[lang];
    button.addEventListener('click', function () {
      if (state.lang === lang) return;
      saveLang(lang);
      location.reload();
    });
    return button;
  }

  function createLanguageSection() {
    var section = document.createElement('div');
    section.setAttribute('data-artenia-lang-menu', '1');
    section.style.marginTop = '6px';
    section.style.paddingTop = '8px';
    section.style.borderTop = '1px solid rgba(255,255,255,.14)';

    var title = document.createElement('div');
    title.style.fontSize = '11px';
    title.style.letterSpacing = '.06em';
    title.style.textTransform = 'uppercase';
    title.style.color = 'rgba(170,220,235,.9)';
    title.style.margin = '0 0 6px';
    title.textContent = MENU_LABELS[state.lang] || MENU_LABELS.es;
    section.appendChild(title);

    for (var i = 0; i < SUPPORTED.length; i += 1) {
      section.appendChild(buildLangButton(SUPPORTED[i]));
    }
    return section;
  }

  function isUserMenuContainer(node) {
    if (!node || node.nodeType !== 1) return false;
    var text = (node.textContent || '').toLowerCase();
    if (!text) return false;
    var hasUserHints =
      text.indexOf('cerrar sesión') !== -1 ||
      text.indexOf('entrar o solicitar alta') !== -1 ||
      text.indexOf('sign in') !== -1 ||
      text.indexOf('log out') !== -1 ||
      text.indexOf('mi espacio') !== -1 ||
      text.indexOf('dashboard') !== -1;
    if (!hasUserHints) return false;
    var isPopup = node.getAttribute('role') === 'menu' || getComputedStyle(node).position === 'fixed' || getComputedStyle(node).position === 'absolute';
    return isPopup;
  }

  function injectLanguageInUserMenus() {
    var candidates = document.querySelectorAll('div,section,nav,[role="menu"]');
    for (var i = 0; i < candidates.length; i += 1) {
      var container = candidates[i];
      if (!isUserMenuContainer(container)) continue;
      if (container.querySelector('[data-artenia-lang-menu="1"]')) continue;
      container.appendChild(createLanguageSection());
    }
  }

  function observeUserMenus() {
    if (state.userMenuObserver) return;
    state.userMenuObserver = new MutationObserver(function () {
      injectLanguageInUserMenus();
    });
    state.userMenuObserver.observe(document.documentElement, { childList: true, subtree: true });
    injectLanguageInUserMenus();
  }

  function applyLanguage(lang) {
    state.lang = isSupported(lang) ? lang : DEFAULT_LANG;
    setDocumentLanguage(state.lang);

    if (state.lang === 'es') {
      state.dict = null;
      state.placeholders = null;
      stopTranslationHeartbeat();
      stopHomeHeroEnforcer();
      observeUserMenus();
      return;
    }

    loadLanguageScript(state.lang)
      .then(function () {
        observeUserMenus();
      })
      .catch(function () {
        console.warn('i18n: no se pudo cargar el idioma', state.lang);
      });
  }

  window.ARTENIA_I18N = {
    register: function (lang, payload) {
      if (lang !== state.lang) return;
      state.dict = payload && payload.dict ? payload.dict : {};
      state.placeholders = payload && payload.placeholders ? payload.placeholders : {};
      applyTranslations();
      enforceHomeHeroTranslation();
      startTranslationObserver();
      startTranslationHeartbeat();
      startHomeHeroEnforcer();
      observeUserMenus();
    }
  };

  function bootstrap() {
    var queryLang = getLangFromQuery();
    if (queryLang) {
      saveLang(queryLang);
      applyLanguage(queryLang);
      return;
    }

    var saved = getSavedLang();
    if (!saved) {
      state.lang = DEFAULT_LANG;
      setDocumentLanguage(DEFAULT_LANG);
      observeUserMenus();
      showInitialLanguagePrompt();
      return;
    }
    applyLanguage(saved);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
