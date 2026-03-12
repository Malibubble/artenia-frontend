import type { Filters } from "../App";

/**
 * Normalize a string: lowercase, remove diacritics, collapse whitespace
 */
function normalizeText(s: unknown): string {
  if (s === null || s === undefined) return "";
  const str = String(s).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  return str.replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Pure filter function for artisans. Expects artisan objects to have
 * fields like: nombre, disciplina, oficio, subcategoria, municipio,
 * comarca, provincia, riesgo_desaparicion, actividad_artesanal,
 * actividad_digital, rutas (array), asociaciones (array), descripcion
 */
export function filterArtisans<T extends Record<string, any>>(artesanos: T[], filters?: Filters): T[] {
  if (!filters) return artesanos.slice();

  const q = normalizeText(filters.searchQuery || "");
  const matchQuery = (a: T) => {
    if (!q) return true;
    const haystackFields = [
      a.nombre,
      a.disciplina,
      a.oficio,
      a.subcategoria,
      a.municipio,
      a.comarca,
      a.provincia,
      a.descripcion,
      a.productos,
      a.rutas,
      a.asociaciones,
      a.web,
      a.instagram,
    ];

    const haystack = haystackFields
      .filter(Boolean)
      .flatMap((v) => (Array.isArray(v) ? v : [v]))
      .map(normalizeText)
      .join(" ");

    return haystack.includes(q);
  };

  return artesanos.filter((a) => {
    // search query
    if (!matchQuery(a)) return false;

    // riesgo
    if (filters.riesgo && filters.riesgo !== "Todos") {
      const r = normalizeText(a.riesgo_desaparicion || a.riesgo || "");
      if (!r.includes(normalizeText(filters.riesgo))) return false;
    }

    // categoria (match against oficio/disciplina/subcategoria)
    if (filters.categoria && filters.categoria !== "Todos") {
      const cat = [a.oficio, a.disciplina, a.subcategoria].map(normalizeText).join(" ");
      if (!cat.includes(normalizeText(filters.categoria))) return false;
    }

    // estadoOficio / actividad
    const estadoFilter = (filters as any).estadoOficio || (filters as any).actividad;
    if (estadoFilter && estadoFilter !== "Todos") {
      const act = normalizeText(a.actividad_artesanal || a.actividad_digital || a.estado || "");
      if (!act.includes(normalizeText(estadoFilter))) return false;
    }

    // municipio/comarca/provincia
    if (filters.municipio && filters.municipio !== "Todos") {
      const mun = normalizeText(a.municipio || "");
      if (!mun.includes(normalizeText(filters.municipio))) return false;
    }
    if (filters.comarca && filters.comarca !== "Todos") {
      const com = normalizeText(a.comarca || "");
      if (!com.includes(normalizeText(filters.comarca))) return false;
    }
    if (filters.provincia && filters.provincia !== "Todos") {
      const prov = normalizeText(a.provincia || "");
      if (!prov.includes(normalizeText(filters.provincia))) return false;
    }

    // tipoResultado: simple heuristics
    if (filters.tipoResultado && filters.tipoResultado !== "Todos") {
      if (filters.tipoResultado === "Rutas") {
        if (!Array.isArray(a.rutas) || a.rutas.length === 0) return false;
      }
      if (filters.tipoResultado === "Oficios") {
        const hasOficio = Boolean(a.oficio || a.disciplina);
        if (!hasOficio) return false;
      }
      if (filters.tipoResultado === "Talleres") {
        // heuristic: must have a name and coordinates
        if (!a.nombre) return false;
        if (!a.lat && !a.latitude && !a.lng && !a.lon) return false;
      }
    }

    return true;
  });
}
