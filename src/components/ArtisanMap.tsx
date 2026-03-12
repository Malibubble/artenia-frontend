// src/components/ArtisanMap.tsx

import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapboxMap, LngLatBounds } from "mapbox-gl";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Filters, Stats } from "../App";
import { filterArtisans } from "../utils/filterArtisans";
import { VistaToggle } from "./VistaToggle";

type Props = {
  filters: Filters;
  onStatsChange?: (stats: Stats) => void;
};

// === ENV ===
const env = (import.meta as any).env as {
  VITE_MAPBOX_TOKEN?: string;
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
};

const mapboxToken = env.VITE_MAPBOX_TOKEN || "";
mapboxgl.accessToken = mapboxToken;

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// === TABLA QUE USAMOS PARA EL MAPA ===
const TABLE_NAME = "artesanos_lab";

// === TIPOS ===
type Artesano = {
  id: number;
  nombre: string;
  lat: number | string | null;
  lon: number | string | null;
  disciplina?: string | null;
  municipio?: string | null;
  web?: string | null;
  instagram?: string | null;
  telefono?: string | null;
  riesgo_desaparicion?: string | null;
  actividad_digital?: string | null;
  actividad_artesanal?: string | null;
  descripcion?: string | null;
  oficio?: string | null;
  subcategoria?: string | null;
  avatar_url?: string | null;
  ficha_url?: string | null;
  tour360_url?: string | null;
  antiguedad_anos?: number | null;
};

export default function ArtisanMap({ filters, onStatsChange }: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const [view, setView] = useState<"mapa" | "colmena">("mapa");

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!mapboxToken) {
      console.error("[ArtisanMap] Falta VITE_MAPBOX_TOKEN");
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-0.5, 39.5], // Comunitat Valenciana aprox
      zoom: 6,
    });

    mapRef.current = map;

    map.on("load", () => {
      if (!supabase) {
        console.error("[ArtisanMap] Supabase no está inicializado");
        return;
      }
      cargarArtesanos(map);
    });

    map.on("error", (e) => {
      console.error("[ArtisanMap] Error de Mapbox:", e.error);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [filters, onStatsChange]);

  // ============================
  //      CARGAR DESDE BD
  // ============================
  async function cargarArtesanos(map: MapboxMap) {
    const { data, error } = await supabase!
      .from(TABLE_NAME)
      .select(
        [
          "id",
          "nombre",
          "lat",
          "lon",
          "disciplina",
          "municipio",
          "web",
          "instagram",
          "telefono",
          "riesgo_desaparicion",
          "actividad_digital",
          "actividad_artesanal",
          "descripcion",
          "oficio",
          "subcategoria",
          "avatar_url",
          "ficha_url",
          "tour360_url",
        ].join(",")
      );

    if (error) {
      console.error("[ArtisanMap] ERROR SQL:", error);
      return;
    }

    if (!data || data.length === 0) {
      console.warn("[ArtisanMap] La tabla artesanos_lab está vacía");
      return;
    }

    const rows = Array.isArray(data) ? (data as any[]) : [];
    const artesanosConCoords: Artesano[] = rows
      .map((r) => ({
        id: r.id,
        nombre: r.nombre,
        lat: r.lat,
        lon: r.lon,
        disciplina: r.disciplina,
        municipio: r.municipio,
        web: r.web,
        instagram: r.instagram,
        telefono: r.telefono,
        riesgo_desaparicion: r.riesgo_desaparicion,
        actividad_digital: r.actividad_digital,
        actividad_artesanal: r.actividad_artesanal,
        descripcion: r.descripcion,
        oficio: r.oficio,
        subcategoria: r.subcategoria,
        avatar_url: r.avatar_url,
        ficha_url: r.ficha_url,
        tour360_url: r.tour360_url,
        antiguedad_anos: r.antiguedad_anos,
      } as Artesano))
      .filter((a) => {
        const lat = Number(a.lat);
        const lon = Number(a.lon);
        return !Number.isNaN(lat) && !Number.isNaN(lon);
      });

    if (!artesanosConCoords.length) {
      console.warn(
        "[ArtisanMap] Ningún artesano de artesanos_lab tiene lat/lon válidos"
      );
      return;
    }

      // Aplicar filtros recibidos desde props antes de pintar
      const filtered = filterArtisans(artesanosConCoords, filters as Filters);

      pintarHexagonos(map, filtered);

    if (onStatsChange) {
      onStatsChange({
        total: artesanosConCoords.length,
        muyActivo: artesanosConCoords.length,
        activo: 0,
        inactivo: 0,
      } as Stats);
    }
  }

  // ============================
  //        HEXÁGONOS ARTENIA
  // ============================
  function pintarHexagonos(map: MapboxMap, artesanos: Artesano[]) {
    const bounds = new LngLatBounds();

    artesanos.forEach((a) => {
      const lat = Number(a.lat);
      const lon = Number(a.lon);

      if (Number.isNaN(lat) || Number.isNaN(lon)) return;

      bounds.extend([lon, lat]);

      // --- CONTENEDOR DEL MARCADOR ---
      const markerEl = document.createElement("div");
      markerEl.style.width = "30px";
      markerEl.style.height = "30px";
      markerEl.style.display = "flex";
      markerEl.style.alignItems = "center";
      markerEl.style.justifyContent = "center";
      markerEl.style.pointerEvents = "auto";

      // --- HEXÁGONO INTERIOR (equilátero visual + respiración) ---
      const dot = document.createElement("div");
      dot.style.width = "22px";
      dot.style.height = "18px"; // un poco menos de alto → se ve más equilátero
      dot.style.clipPath =
        "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";

      const disc = (a.disciplina || "").toLowerCase();
      let fill = "#ff8a3d";
      let glow = "rgba(255,138,61,0.7)";

      if (disc.includes("aliment")) {
        fill = "#f97316";
        glow = "rgba(249,115,22,0.7)";
      } else if (disc.includes("textil")) {
        fill = "#22c55e";
        glow = "rgba(34,197,94,0.7)";
      } else if (disc.includes("cerám") || disc.includes("ceram")) {
        fill = "#38bdf8";
        glow = "rgba(56,189,248,0.7)";
      } else if (disc.includes("madera")) {
        fill = "#eab308";
        glow = "rgba(234,179,8,0.7)";
      }

      dot.style.backgroundColor = fill;
      dot.style.boxShadow = `0 0 10px ${glow}`;

      // 🔹 Respiración: solo añadimos estas dos líneas
      dot.style.transformOrigin = "center center";
      dot.style.animation = "core-breath 2.8s ease-in-out infinite";

      markerEl.appendChild(dot);

      new mapboxgl.Marker({
        element: markerEl,
        anchor: "center",
      })
        .setLngLat([lon, lat]) // mismas coords que cuando tenías el pin rojo
        .setPopup(
          new mapboxgl.Popup({ offset: 16, className: "artenia-popup-hex" }).setHTML(
            buildPopupContent({ ...a, fill })
          )
        )
        .addTo(map);
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 60 });
    }
  }

  // filtering is handled by `filterArtisans` in src/utils/filterArtisans.ts

  return (
    <>
      <VistaToggle view={view} onToggle={setView} />
      <div
        ref={mapContainerRef}
        className="artenia-map-shell"
      />
    </>
  );
}

function buildPopupContent(a: Artesano & { fill?: string }) {
  const title = a.nombre || "Artesano sin nombre";
  const disciplina = a.disciplina || "Oficio por confirmar";
  const municipio = a.municipio || "Ubicación no especificada";
  const riesgo = a.riesgo_desaparicion || "Sin dato";
  const actividadDigital = a.actividad_digital || "Desconocida";
  const actividadArtesanal = a.actividad_artesanal || "Desconocida";
  const desc = a.descripcion || "";
  const oficio = a.oficio || disciplina;
  const subcat = a.subcategoria || "";
  const antiguedad = a.antiguedad_anos ? `${a.antiguedad_anos} años` : "";

  const web =
    a.web && a.web.trim() !== ""
      ? `<a class="popup-chip" href="${a.web}" target="_blank" rel="noreferrer">Web</a>`
      : "";
  const ig =
    a.instagram && a.instagram.trim() !== ""
      ? `<a class="popup-chip" href="${a.instagram}" target="_blank" rel="noreferrer">Instagram</a>`
      : "";
  const tel =
    a.telefono && a.telefono.trim() !== ""
      ? `<span class="popup-chip">${a.telefono}</span>`
      : "";
  const ficha =
    a.id
      ? `<a class="popup-chip popup-chip-primary" href="/artesano/${a.id}">Ficha completa</a>`
      : a.ficha_url && a.ficha_url.trim() !== ""
        ? `<a class="popup-chip popup-chip-primary" href="${a.ficha_url}" target="_blank" rel="noreferrer">Ficha completa</a>`
        : "";
  const tour =
    a.tour360_url && a.tour360_url.trim() !== ""
      ? `<a class="popup-chip" href="${a.tour360_url}" target="_blank" rel="noreferrer">Tour 360°</a>`
      : "";
  const avatar =
    a.avatar_url && a.avatar_url.trim() !== ""
      ? `<div class="artenia-popup-photo"><img src="${a.avatar_url}" alt="${title}" loading="lazy" /></div>`
      : "";

  const fill = a.fill || "#22d3ee";

  return `
    <div class="artenia-popup" style="--popup-accent: ${fill};">
      ${avatar}

      <div class="artenia-popup-header">
        <div class="artenia-popup-dot"></div>
        <div>
          <div class="artenia-popup-title">${title}</div>
          <div class="artenia-popup-subtitle">${oficio}</div>
          ${
            subcat
              ? `<div class="artenia-popup-subtitle-muted">${subcat}</div>`
              : ""
          }
        </div>
      </div>

      <div class="artenia-popup-meta">
        <span>${municipio}</span>
        <span>Riesgo: ${riesgo}</span>
        ${antiguedad ? `<span>Antigüedad: ${antiguedad}</span>` : ""}
      </div>

      <div class="artenia-popup-meta">
        <span>Actividad digital: ${actividadDigital}</span>
        <span>Actividad artesanal: ${actividadArtesanal}</span>
      </div>

      ${
        desc
          ? `<p class="artenia-popup-desc">${desc.slice(0, 160)}${
              desc.length > 160 ? "…" : ""
            }</p>`
          : ""
      }

      <div class="artenia-popup-actions">
        ${ficha}${tour}${web}${ig}${tel}
      </div>
    </div>
  `;
}
