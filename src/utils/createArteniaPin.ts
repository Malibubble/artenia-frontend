import type { ArtesanoLab } from "../types/artesano";

// Crea un elemento DOM que se usará como pin/marker en Mapbox o en otras capas.
// - Añade clases según riesgo/tipo
// - Añade estructura visual (halo + punto)
// - Expone eventos personalizados: "artenia-select" y "artenia-hover"
export function createArteniaPin(artesano: ArtesanoLab): HTMLElement {
  const el = document.createElement("div");
  el.className = "artenia-pin";

  // Modificadores de color según riesgo o tipo
  const riesgo = (artesano.riesgo_desaparicion || "").toLowerCase();
  const tipo = (artesano.disciplina || "").toLowerCase();

  if (riesgo === "alto") {
    el.classList.add("artenia-pin--riesgo-alto");
  } else if (riesgo === "medio") {
    el.classList.add("artenia-pin--riesgo-medio");
  } else {
    el.classList.add("artenia-pin--riesgo-bajo");
  }

  // ejemplo: asociaciones en verde
  if (tipo.includes("asociaci") || tipo.includes("asociaciÃ³n")) {
    el.classList.add("artenia-pin--asociacion");
  }

  // Palette mapping by discipline (retro-futuristic minimal ARTENIA palette)
  const palette: Record<string, string> = {
    ceramica: "#FF7A7A",
    vidrio: "#7AE3FF",
    madera: "#FFB86B",
    textil: "#C58CFF",
    metal: "#9FE2C0",
    alimentacion: "#FFD36B",
    default: "#41e1ff",
  };

  const key = (tipo || "").toLowerCase();
  let color = palette.default;
  Object.keys(palette).forEach((k) => {
    if (k !== "default" && key.includes(k)) color = palette[k];
  });

  // Activity level: look for several possible properties
  const activityRaw = artesano.actividad ?? artesano.nivel_actividad ?? artesano.activity ?? artesano.activity_level ?? artesano.activityLevel ?? 1;
  const activity = Number(activityRaw) || 1; // default 1
  // normalize glow intensity (0.08 - 0.9)
  const glow = Math.min(0.9, Math.max(0.08, activity / 10));

  // set CSS variables for color and glow so styles can use them
  el.style.setProperty("--artenia-color", color);
  el.style.setProperty("--artenia-glow", String(glow));

  // Por si quieres usarlo para abrir ficha:
  el.dataset.artesanoId = String(artesano.id ?? "");

  // Estructura visual interna: halo + core dot
  el.innerHTML = `
    <span class="artenia-pin__halo" aria-hidden="true"></span>
    <span class="artenia-pin__dot" aria-hidden="true"></span>
  `;

  // Accesibilidad
  const labelParts = [artesano.nombre, artesano.disciplina, artesano.municipio]
    .filter(Boolean)
    .join(" — ");
  el.setAttribute("role", "button");
  el.setAttribute("tabindex", "0");
  el.setAttribute("aria-label", labelParts || "Artesano");

  // Eventos: dispatch custom events to allow parent code to react
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    el.dispatchEvent(new CustomEvent("artenia-select", { detail: { artesano }, bubbles: true }));
  });

  // Hover: dispatch hover start/stop with small debounce to avoid flicker
  let hoverTimer: number | null = null;
  el.addEventListener("mouseenter", (e) => {
    if (hoverTimer) window.clearTimeout(hoverTimer);
    hoverTimer = window.setTimeout(() => {
      el.dispatchEvent(new CustomEvent("artenia-hover", { detail: { artesano }, bubbles: true }));
      hoverTimer = null;
    }, 100);
  });
  el.addEventListener("mouseleave", () => {
    if (hoverTimer) {
      window.clearTimeout(hoverTimer);
      hoverTimer = null;
    }
    // small delay before sending null so mouse can move to panel
    window.setTimeout(() => {
      el.dispatchEvent(new CustomEvent("artenia-hover", { detail: { artesano: null }, bubbles: true }));
    }, 220);
  });

  // Keyboard support: Enter/Space to activate
  el.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      el.dispatchEvent(new CustomEvent("artenia-select", { detail: { artesano }, bubbles: true }));
    }
  });

  return el;
}
