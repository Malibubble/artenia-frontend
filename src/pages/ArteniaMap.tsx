import { useEffect, useRef, useState } from "react";
import { createArteniaPin } from "../utils/createArteniaPin";
import { filterArtisans } from "../utils/filterArtisans";
import type { Filters } from "../App";

// allow using require() in this file without TS node types
declare const require: any;
type Taller = {
  id_taller: string;
  nombre_taller?: string;
  lat: number;
  lng: number;
  municipio?: string;
  [key: string]: any;
};

export default function ArteniaMap() {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    let overlay: google.maps.OverlayView | null = null;
    let dataPoints: Taller[] = [];

    async function init() {
      if (!mapDivRef.current) return;

      const mapInstance = new google.maps.Map(mapDivRef.current, {
        center: { lat: 38.345, lng: -0.481 }, // Alicante
        zoom: 8,
        mapTypeId: "roadmap",
        disableDefaultUI: false,
        zoomControl: true,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        gestureHandling: "greedy",
      });

      setMap(mapInstance);

      try {
        const resp = await fetch("/datos/TALLERES_CV_final.json");
        dataPoints = await resp.json();
      } catch (err) {
        console.warn("No se pudieron cargar datos de talleres:", err);
        dataPoints = [];
      }

      // Overlay para renderizar DOM markers (hexágonos) y clusters
      class MarkersOverlay extends google.maps.OverlayView {
        container: HTMLDivElement;
        markers: { data: Taller; el: HTMLElement }[] = [];
        index: any = null;
        tooltip: HTMLDivElement | null = null;
        constructor(private mapRef: google.maps.Map, points: Taller[]) {
          super();
          this.container = document.createElement("div");
          this.container.className = "artenia-overlay";
          this.setMap(mapRef);

          // initialize with given points
          this.updatePoints(points);
        }

        // rebuild index + markers from new points
        updatePoints(points: Taller[]) {
          // clear existing
          this.markers = [];
          this.index = null;
          this.container.innerHTML = "";

          // Build features for supercluster
          const features = points.map((p) => ({
            type: "Feature",
            properties: {
              id: p.id_taller ?? p.id_taller,
              nombre: p.nombre_taller ?? p.nombre_taller,
              disciplina: p.id_oficio_principal ?? p.disciplina ?? "",
              actividad: p.actividad ?? p.nivel_actividad ?? p.activity ?? 1,
              original: p,
            },
            geometry: { type: "Point", coordinates: [p.lng, p.lat] },
          }));

          // lazy require supercluster to avoid TS/ESM complexities; mark as any
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const Supercluster = require("supercluster");
          this.index = new Supercluster({ radius: 60, maxZoom: 16 });
          this.index.load(features);

          // create markers elements (use createArteniaPin) and store them
          points.forEach((p) => {
            const artesanoLike: any = {
              id: p.id_taller ?? p.id_taller,
              nombre: p.nombre_taller ?? p.nombre_taller ?? "Taller",
              disciplina: p.id_oficio_principal ?? "",
              municipio: p.municipio ?? "",
              lat: p.lat,
              lng: p.lng,
              riesgo_desaparicion: p.riesgo_desaparicion ?? "",
            };

            const el = createArteniaPin(artesanoLike as any);
            el.classList.add("artenia-hexagon");

            // forward custom events to window
            el.addEventListener("artenia-select", (ev: Event) => {
              const detail = (ev as CustomEvent).detail;
              window.dispatchEvent(new CustomEvent("artenia-select", { detail, bubbles: true }));
            });
            el.addEventListener("artenia-hover", (ev: Event) => {
              const detail = (ev as CustomEvent).detail;
              window.dispatchEvent(new CustomEvent("artenia-hover", { detail, bubbles: true }));
            });

            // Add local tooltip trigger: show a small preview on hover
            el.addEventListener("mouseenter", (ev) => {
              const proj = this.getProjection();
              if (!proj) return;
              const latLng = new google.maps.LatLng(p.lat, p.lng);
              const pt = proj.fromLatLngToDivPixel(latLng);
              this.showTooltip(p.nombre_taller ?? p.id_taller ?? "Taller", pt.x, pt.y);
            });
            el.addEventListener("mouseleave", () => {
              this.hideTooltip();
            });

            this.markers.push({ data: p, el });
          });

          // tooltip element
          this.tooltip = document.createElement("div");
          this.tooltip.className = "artenia-tooltip";
          this.tooltip.style.position = "absolute";
          this.tooltip.style.pointerEvents = "none";
          this.tooltip.style.display = "none";
          this.container.appendChild(this.tooltip);
        }

        onAdd() {
          (this.getPanes()?.overlayMouseTarget as HTMLDivElement | null)?.appendChild(this.container);
        }

        onRemove() {
          this.container.remove();
        }

        draw() {
          const proj = this.getProjection();
          if (!proj) return;

          // Clear container
          this.container.innerHTML = "";

          // Use supercluster to compute clusters for current viewport and zoom
          const gm = this.getMap() as google.maps.Map | null;
          if (!gm || !this.index) return;

          const bounds = gm.getBounds();
          if (!bounds) return;
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          const bbox = [sw.lng(), sw.lat(), ne.lng(), ne.lat()];
          const zoom = Math.floor(gm.getZoom() ?? 8);

          const clusters = this.index.getClusters(bbox, zoom);

          clusters.forEach((c: any) => {
            const [lng, lat] = c.geometry.coordinates;
            const pixel = proj.fromLatLngToDivPixel(new google.maps.LatLng(lat, lng));

            if (c.properties.cluster) {
              const count = c.properties.point_count;
              const clusterEl = document.createElement("div");
              clusterEl.className = "artenia-cluster";
              clusterEl.innerHTML = `<div class="count">${count}</div>`;
              clusterEl.style.position = "absolute";
              clusterEl.style.transform = `translate(${pixel.x - 18}px, ${pixel.y - 18}px)`;

              // compute average activity and predominant discipline from leaves
              try {
                const leaves = this.index.getLeaves(c.id, 1000) || [];
                let totalAct = 0;
                const discCount: Record<string, number> = {};
                leaves.forEach((lf: any) => {
                  const act = Number(lf.properties.actividad) || 1;
                  totalAct += act;
                  const d = (lf.properties.disciplina || "").toLowerCase();
                  if (d) discCount[d] = (discCount[d] || 0) + 1;
                });
                const avgActivity = leaves.length ? totalAct / leaves.length : 1;
                // pick predominant discipline
                const entries = Object.entries(discCount).sort((a, b) => b[1] - a[1]);
                const predominant = entries.length ? entries[0][0] : "";

                // small local palette to match createArteniaPin
                const palette: Record<string, string> = {
                  ceramica: "#FF7A7A",
                  vidrio: "#7AE3FF",
                  madera: "#FFB86B",
                  textil: "#C58CFF",
                  metal: "#9FE2C0",
                  alimentacion: "#FFD36B",
                  default: "#41e1ff",
                };
                let clusterColor = palette.default;
                Object.keys(palette).forEach((k) => {
                  if (k !== "default" && predominant.includes(k)) clusterColor = palette[k];
                });

                const glow = Math.min(0.9, Math.max(0.08, avgActivity / 10));
                clusterEl.style.setProperty("--cluster-color", clusterColor);
                clusterEl.style.setProperty("--cluster-glow", String(glow));
              } catch (e) {
                // ignore errors computing leaves
              }

              clusterEl.addEventListener("click", () => {
                try {
                  const expansionZoom = this.index.getClusterExpansionZoom(c.id);
                  if (typeof expansionZoom === "number") {
                    gm.setCenter({ lat, lng });
                    gm.setZoom(expansionZoom);
                  }
                } catch (err) {
                  // fallback: zoom one level
                  gm.setCenter({ lat, lng });
                  gm.setZoom(gm.getZoom()! + 1);
                }
              });

              clusterEl.addEventListener("mouseenter", () => {
                this.showTooltip(`${count} talleres`, pixel.x, pixel.y);
              });
              clusterEl.addEventListener("mouseleave", () => this.hideTooltip());

              this.container.appendChild(clusterEl);
            } else {
              // single point - find marker element by id
              const id = c.properties.id;
              const found = this.markers.find((mm) => mm.data.id_taller === id || mm.data.id_taller === String(id));
              if (found) {
                const el = found.el;
                el.style.transform = `translate(${pixel.x - 12}px, ${pixel.y - 12}px)`;
                el.style.position = "absolute";
                this.container.appendChild(el);
              }
            }
          });
        }

        showTooltip(text: string, px: number, py: number) {
          if (!this.tooltip) return;
          this.tooltip.textContent = text;
          this.tooltip.style.left = `${px + 14}px`;
          this.tooltip.style.top = `${py - 10}px`;
          this.tooltip.style.display = "block";
        }

        hideTooltip() {
          if (!this.tooltip) return;
          this.tooltip.style.display = "none";
        }
      }

      // apply initial filters if any set on window (App may dispatch these)
      const initialFilters = (window as any).__ARTENIA_FILTERS as Filters | undefined;
      const initialPoints = initialFilters ? filterArtisans(dataPoints as any[], initialFilters) as Taller[] : dataPoints;

      overlay = new MarkersOverlay(mapInstance, initialPoints);

      // listen for global filter changes dispatched by the Sidebar/App
      const filtersListener = (ev: Event) => {
        const detail = (ev as CustomEvent).detail as Filters;
        try {
          const next = filterArtisans(dataPoints as any[], detail) as Taller[];
          (overlay as any)?.updatePoints(next);
          (overlay as any)?.draw();
        } catch (e) {
          // ignore
        }
      };

      window.addEventListener("artenia-filters-changed", filtersListener as EventListener);

      // rerender clusters on idle / zoom
      const idleListener = mapInstance.addListener("idle", () => {
        overlay?.draw();
      });

      // initial draw after tiles loaded
      mapInstance.addListener("tilesloaded", () => {
        overlay?.draw();
      });

      // cleanup on unmount
      (mapInstance as any)._arteniaCleanup = () => {
        google.maps.event.removeListener(idleListener);
        overlay?.setMap(null);
        // remove global filter listener
        try {
          window.removeEventListener("artenia-filters-changed", filtersListener as EventListener);
        } catch (e) {
          // ignore
        }
      };
    }

    init();

    return () => {
      if (map) {
        const fn = (map as any)._arteniaCleanup;
        if (fn) fn();
      }
    };
  }, []);

  return (
    <div className="flex h-screen bg-[#050509] text-white overflow-hidden">
      {/* SIDEBAR IZQUIERDO */}
      <aside
        className={`border-r border-white/10 bg-black/40 backdrop-blur-md z-20 flex flex-col transition-all duration-300 ease-out ${
          collapsed ? "w-16" : "w-80"
        }`}
      >
        {/* CABECERA + BOTÓN COLAPSAR */}
        <header className="px-3 py-3 border-b border-white/10 flex items-center justify-between">
          {!collapsed && (
            <div className="flex flex-col">
              <h1 className="text-xs font-semibold tracking-[0.18em] uppercase text-cyan-300">
                Artenia Lab
              </h1>
              <p className="mt-1 text-xs text-white/70">
                Mapa vivo de oficios · CV
              </p>
            </div>
          )}

          <button
            onClick={() => setCollapsed((c) => !c)}
            className="h-7 w-7 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-[10px] hover:bg-white/10 hover:border-cyan-300/70 transition-colors"
            aria-label={collapsed ? "Expandir panel" : "Colapsar panel"}
          >
            {collapsed ? "›" : "‹"}
          </button>
        </header>

        {/* CONTENIDO COMPLETO (se oculta al colapsar) */}
        {!collapsed && (
          <div className="p-4 text-xs space-y-4 flex-1 overflow-auto">
            <section className="space-y-2">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                Filtros
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <button className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-300/70">
                  Cerámica
                </button>
                <button className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-300/70">
                  Alimentación
                </button>
                <button className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-300/70">
                  En riesgo
                </button>
                <button className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-300/70">
                  Alta digital
                </button>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                Vista rápida
              </h2>
              <div className="flex flex-col gap-2">
                <button className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-300/70 text-left">
                  Comunitat Valenciana
                </button>
                <button className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-300/70 text-left">
                  Alicante
                </button>
                <button className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-300/70 text-left">
                  Castellón
                </button>
              </div>
            </section>

            <section className="space-y-1 text-[11px] text-white/60">
              <p>
                Aquí irán los controles de capas, filtros avanzados y la vista
                Colmena sobre el mapa.
              </p>
            </section>
          </div>
        )}

        {/* MODO ICONOS CUANDO ESTÁ COLAPSADO */}
        {collapsed && (
          <div className="flex-1 flex flex-col items-center pt-4 gap-4 text-[9px] text-white/60">
            <div className="flex flex-col items-center gap-1">
              <span className="h-6 w-6 rounded-lg border border-white/20 flex items-center justify-center text-xs">
                F
              </span>
              <span>Filtros</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="h-6 w-6 rounded-lg border border-white/20 flex items-center justify-center text-xs">
                M
              </span>
              <span>Mapa</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="h-6 w-6 rounded-lg border border-white/20 flex items-center justify-center text-xs">
                C
              </span>
              <span>Colmena</span>
            </div>
          </div>
        )}
      </aside>

      {/* ZONA DE MAPA */}
      <div className="relative flex-1">
        {/* CONTENEDOR DEL MAPA */}
        <div ref={mapDivRef} className="absolute inset-0" />

        {/* CONTROLES FLOTÁNDO SOBRE EL MAPA */}
        <div className="absolute top-4 left-4 z-[900] flex flex-col gap-2 pointer-events-auto">
        </div>

        {/* Aquí es donde, más adelante, montaremos ColmenaOverMap encima:
        {showColmena && map && (
          <ColmenaOverMap
            map={map}
            talleres={talleres}
            onClose={() => setShowColmena(false)}
          />
        )}
        */}
      </div>
    </div>
  );
}
