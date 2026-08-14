(function () {
  const originalFetch = window.fetch.bind(window);
  const placeholderImage = "https://static.wixstatic.com/media/b386dc_fa3da766b1e542c3bd9d77f0cf83acbb~mv2.jpg";

  function accessRequired() {
    const error = new Error("Acceso necesario");
    error.code = "MAP_ACCESS_REQUIRED";
    return error;
  }

  function returnToAccess() {
    window.location.reload();
  }

  function assertPrivateResponse(response) {
    if (response.status === 401) {
      returnToAccess();
      throw accessRequired();
    }
    return response;
  }

  function text(value, fallback) {
    const result = value == null ? "" : String(value).trim();
    return result || fallback || "";
  }

  function number(value) {
    const result = Number(value);
    return Number.isFinite(result) ? result : void 0;
  }

  function slugFromProfile(profile, index) {
    const slug = text(profile?.slug || profile?.storySlug || profile?.publicSlug || profile?.story_path || "", "");
    if (slug) {
      return slug;
    }
    const seed = text(profile?.publicName || profile?.nombre || profile?.name || profile?.oficio || profile?.categoria || "perfil-publicado", "perfil-publicado");
    const base = seed
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return (base || "perfil-publicado") + "-" + String(profile?.userId ?? profile?.id ?? index + 1);
  }

  function normalizeStory(profile) {
    const slug = slugFromProfile(profile, 0);
    const name = text(profile?.publicName || profile?.nombre || profile?.name || profile?.oficio || "Perfil publicado", "Perfil publicado");
    const craft = text(profile?.oficio || profile?.craft || profile?.categoria || "Oficio artesano", "Oficio artesano");
    const place = text([profile?.localidad, profile?.provincia].filter(Boolean).join(" · "), "");
    const statement = text(profile?.relato || profile?.descripcion || profile?.summary || "", "");
    const introduction = text(profile?.descripcion || profile?.relato || statement, statement);
    const image = text(profile?.imagenPerfil || profile?.imagen || placeholderImage, placeholderImage);
    const chapter = {
      kicker: text(profile?.origin?.kicker || "Historia", "Historia"),
      title: text(profile?.origin?.title || name, name),
      body: text(profile?.origin?.body || introduction, introduction),
      period: text(profile?.origin?.period || "Perfil publicado", "Perfil publicado"),
      origin: {
        period: text(profile?.origin?.period || "Perfil publicado", "Perfil publicado"),
        title: text(profile?.origin?.title || name, name),
        body: text(profile?.origin?.body || introduction, introduction),
      },
    };
    const timelineItem = {
      period: text(profile?.origin?.period || "Perfil publicado", "Perfil publicado"),
      title: text(profile?.origin?.title || name, name),
      detail: text(profile?.origin?.body || introduction, introduction),
    };
    const galleryItem = {
      src: image,
      alt: text(profile?.publicName || name, name),
      caption: text(profile?.origin?.title || name, name),
    };

    return {
      slug,
      name,
      craft,
      place,
      eyebrow: text(profile?.categoria || craft, craft),
      statement,
      introduction,
      craftHeritage: {
        title: text(profile?.craftHeritage?.title || `Historia de ${name}`, `Historia de ${name}`),
        introduction: text(profile?.craftHeritage?.introduction || introduction, introduction),
        origin: {
          period: text(profile?.craftHeritage?.origin?.period || 'Perfil publicado', 'Perfil publicado'),
          title: text(profile?.craftHeritage?.origin?.title || name, name),
          body: text(profile?.craftHeritage?.origin?.body || introduction, introduction),
        },
        howItWorks: Array.isArray(profile?.craftHeritage?.howItWorks)
          ? profile.craftHeritage.howItWorks
          : Array.isArray(profile?.howItWorks)
            ? profile.howItWorks
            : [],
      },
      origin: {
        period: text(profile?.origin?.period || 'Perfil publicado', 'Perfil publicado'),
        title: text(profile?.origin?.title || name, name),
        body: text(profile?.origin?.body || introduction, introduction),
      },
      location: {
        label: text(profile?.location?.label || 'Ubicación pública', 'Ubicación pública'),
        detail: text(profile?.location?.detail || place || introduction, place || introduction),
        mapUrl: text(profile?.location?.mapUrl || profile?.mapUrl || profile?.web || '', ''),
        privacyNote: text(profile?.location?.privacyNote || 'Ubicación pública del perfil publicado.', 'Ubicación pública del perfil publicado.'),
      },
      visit: {
        label: text(profile?.visit?.label || 'Visitar', 'Visitar'),
        detail: text(profile?.visit?.detail || place || introduction, place || introduction),
        mapUrl: text(profile?.visit?.mapUrl || profile?.mapUrl || profile?.web || '', ''),
        privacyNote: text(profile?.visit?.privacyNote || 'Ubicación pública del perfil publicado.', 'Ubicación pública del perfil publicado.'),
      },
      chapters: Array.isArray(profile?.chapters) && profile.chapters.length > 0 ? profile.chapters : [chapter],
      services: Array.isArray(profile?.services) ? profile.services : [],
      howItWorks: Array.isArray(profile?.howItWorks) ? profile.howItWorks : [],
      timeline: Array.isArray(profile?.timeline) && profile.timeline.length > 0 ? profile.timeline : [timelineItem],
      gallery: Array.isArray(profile?.gallery) && profile.gallery.length > 0 ? profile.gallery : [galleryItem],
      highlights: Array.isArray(profile?.highlights) ? profile.highlights : [],
      projects: Array.isArray(profile?.projects) ? profile.projects : [],
      testimonials: Array.isArray(profile?.testimonials) ? profile.testimonials : [],
      links: Array.isArray(profile?.links) ? profile.links : [],
      materials: Array.isArray(profile?.materials) ? profile.materials : [],
      storyPath: text(profile?.storyPath || `/historias/${slug}`, `/historias/${slug}`),
      imageSourceUrl: image,
      imageSourceType: "publicVerifiedImage",
      imagePermissionStatus: "public_verified",
      isPilotProfile: !1,
      verificado: !0,
      isRealClient: !0,
      isDemoProfile: !1,
      panelPath: text(profile?.panelPath || "/panel-artesano", "/panel-artesano"),
      publicRoute: text(profile?.publicRoute || `/historias/${slug}`, `/historias/${slug}`),
      publicName: name,
      oficio: craft,
      categoria: text(profile?.categoria || craft, craft),
      descripcion: introduction,
      relato: statement,
      imagen: image,
      imagenPerfil: image,
      craftHeritage: {
        title: text(profile?.craftHeritage?.title || `Historia de ${name}`, `Historia de ${name}`),
        introduction: text(profile?.craftHeritage?.introduction || introduction, introduction),
        origin: {
          period: text(profile?.craftHeritage?.origin?.period || 'Perfil publicado', 'Perfil publicado'),
          title: text(profile?.craftHeritage?.origin?.title || name, name),
          body: text(profile?.craftHeritage?.origin?.body || introduction, introduction),
        },
        howItWorks: Array.isArray(profile?.craftHeritage?.howItWorks)
          ? profile.craftHeritage.howItWorks
          : Array.isArray(profile?.howItWorks)
            ? profile.howItWorks
            : [],
      },
      origin: {
        period: text(profile?.origin?.period || 'Perfil publicado', 'Perfil publicado'),
        title: text(profile?.origin?.title || name, name),
        body: text(profile?.origin?.body || introduction, introduction),
      },
      location: {
        label: text(profile?.location?.label || 'Ubicación pública', 'Ubicación pública'),
        detail: text(profile?.location?.detail || place || introduction, place || introduction),
        mapUrl: text(profile?.location?.mapUrl || profile?.mapUrl || profile?.web || '', ''),
        privacyNote: text(profile?.location?.privacyNote || 'Ubicación pública del perfil publicado.', 'Ubicación pública del perfil publicado.'),
      },
      visit: {
        label: text(profile?.visit?.label || 'Visitar', 'Visitar'),
        detail: text(profile?.visit?.detail || place || introduction, place || introduction),
        mapUrl: text(profile?.visit?.mapUrl || profile?.mapUrl || profile?.web || '', ''),
        privacyNote: text(profile?.visit?.privacyNote || 'Ubicación pública del perfil publicado.', 'Ubicación pública del perfil publicado.'),
      },
      chapters: Array.isArray(profile?.chapters) && profile.chapters.length > 0 ? profile.chapters : [chapter],
      services: Array.isArray(profile?.services) ? profile.services : [],
      howItWorks: Array.isArray(profile?.howItWorks) ? profile.howItWorks : [],
      timeline: Array.isArray(profile?.timeline) && profile.timeline.length > 0 ? profile.timeline : [timelineItem],
      gallery: Array.isArray(profile?.gallery) && profile.gallery.length > 0 ? profile.gallery : [galleryItem],
      highlights: Array.isArray(profile?.highlights) ? profile.highlights : [],
      projects: Array.isArray(profile?.projects) ? profile.projects : [],
      testimonials: Array.isArray(profile?.testimonials) ? profile.testimonials : [],
      links: Array.isArray(profile?.links) ? profile.links : [],
      materials: Array.isArray(profile?.materials) ? profile.materials : [],
      localidad: text(profile?.localidad || "", ""),
      provincia: text(profile?.provincia || "", ""),
      userId: profile?.userId ?? profile?.id ?? null,
    };
  }

  function normalizeMapEntry(profile, index) {
    const story = normalizeStory(profile);
    return {
      id: Number.isFinite(Number(profile?.id)) ? Number(profile.id) : 1_000_000 + index,
      slug: story.slug,
      nombre: story.publicName,
      nombre_oficio: story.publicName,
      publicName: story.publicName,
      oficio: story.oficio,
      categoria: story.categoria,
      descripcion: story.descripcion,
      relato: story.relato,
      storyPath: story.storyPath,
      publicRoute: story.publicRoute,
      panelPath: story.panelPath,
      lat_centro: number(profile?.latitud ?? profile?.lat_centro),
      lng_centro: number(profile?.longitud ?? profile?.lng_centro),
      imagen: story.imagen,
      imagenPerfil: story.imagenPerfil,
      craftHeritage: story.craftHeritage,
      origin: story.origin,
      location: story.location,
      visit: story.visit,
      chapters: story.chapters,
      services: story.services,
      howItWorks: story.howItWorks,
      timeline: story.timeline,
      gallery: story.gallery,
      highlights: story.highlights,
      projects: story.projects,
      testimonials: story.testimonials,
      links: story.links,
      materials: story.materials,
      localidad: story.localidad,
      provincia: story.provincia,
      userId: story.userId,
    };
  }

  function dedupeKey(item) {
    const candidates = [item?.id, item?.slug, item?.storyPath, item?.publicRoute];
    for (const candidate of candidates) {
      const value = text(candidate, "");
      if (value) {
        return value;
      }
    }
    return "";
  }

  function hasCoordinates(item) {
    return Number.isFinite(Number(item?.lat_centro)) && Number.isFinite(Number(item?.lng_centro));
  }

  async function loadPublishedProfiles() {
    if (!window.__arteniaPublishedProfilesPromise) {
      window.__arteniaPublishedProfilesPromise = originalFetch("/api/public-profiles.php", { credentials: "same-origin" })
        .then((response) => {
          assertPrivateResponse(response);
          if (!response.ok) {
            throw new Error("No se pudieron cargar los perfiles publicados");
          }
          return response.json();
        })
        .then((payload) => {
          const items = Array.isArray(payload?.items) ? payload.items : [];
          window.__arteniaPublishedProfiles = items;
          return items;
        })
        .catch((error) => {
          if (error?.code === "MAP_ACCESS_REQUIRED") {
            window.__arteniaPublishedProfilesPromise = null;
            throw error;
          }
          window.__arteniaPublishedProfiles = [];
          return [];
        });
    }

    return window.__arteniaPublishedProfilesPromise;
  }

  function mergeMapEntries(staticItems, publishedItems) {
    const seen = new Set();
    const merged = [];

    for (const item of Array.isArray(staticItems) ? staticItems : []) {
      const key = dedupeKey(item);
      if (key && seen.has(key)) {
        continue;
      }
      if (key) {
        seen.add(key);
      }
      merged.push(item);
    }

    for (let index = 0; index < (Array.isArray(publishedItems) ? publishedItems.length : 0); index += 1) {
      const normalized = normalizeMapEntry(publishedItems[index], index);
      if (!hasCoordinates(normalized)) {
        continue;
      }
      const key = dedupeKey(normalized);
      if (key && seen.has(key)) {
        continue;
      }
      if (key) {
        seen.add(key);
      }
      merged.push(normalized);
    }

    return merged;
  }

  window.__arteniaProfileToStory = normalizeStory;
  window.__arteniaNormalizePublishedProfileForMap = normalizeMapEntry;
  window.__arteniaMergePublishedProfilesForMap = mergeMapEntries;
  loadPublishedProfiles();

  window.fetch = async function (input, init) {
    const url = typeof input === "string" ? input : input && typeof input.url === "string" ? input.url : "";
    let pathname = "";

    try {
      pathname = new URL(url, window.location.href).pathname;
    } catch {
      pathname = "";
    }

    if (pathname === "/OFICIOS_MAPA.json") {
      const response = await originalFetch(input, init);
      assertPrivateResponse(response);

      try {
        const staticItems = await response.clone().json();
        const publishedItems = await loadPublishedProfiles();
        return new Response(JSON.stringify(mergeMapEntries(staticItems, publishedItems)), {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        });
      } catch {
        return response;
      }
    }

    return originalFetch(input, init);
  };
})();
