// src/components/Sidebar.tsx
import React, { useEffect, useState } from "react";
import type { Filters, Stats } from "../App";

type SidebarProps = {
  filters: Filters;
  setFilters: (next: Filters) => void;
  stats: Stats;
};

export default function Sidebar({ filters, setFilters, stats }: SidebarProps) {
  const [searchLocal, setSearchLocal] = useState(filters.searchQuery || "");

  // debounce applying search to global filters (250ms)
  useEffect(() => {
    const id = window.setTimeout(() => {
      const next = { ...filters, searchQuery: searchLocal } as Filters;
      setFilters(next);
      try {
        (window as any).__ARTENIA_FILTERS = next;
        window.dispatchEvent(new CustomEvent("artenia-filters-changed", { detail: next }));
      } catch (err) {
        // ignore
      }
    }, 250);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchLocal]);
  const handleSelectChange =
    (field: keyof Filters) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const next = {
        ...filters,
        [field]: e.target.value,
      } as Filters;
      setFilters(next);
      try {
        (window as any).__ARTENIA_FILTERS = next;
        window.dispatchEvent(new CustomEvent("artenia-filters-changed", { detail: next }));
      } catch (err) {
        // ignore
      }
    };

  const handleReset = () => {
    const next: Filters = {
      categoria: "Todos",
      actividad: "Todos",
      riesgo: "Todos",
      searchQuery: "",
      estadoOficio: "Todos",
      comunidad: "Todos",
      provincia: "Todos",
      comarca: "Todos",
      municipio: "Todos",
      tipoResultado: "Todos",
    };
    setFilters(next);
    try {
      (window as any).__ARTENIA_FILTERS = next;
      window.dispatchEvent(new CustomEvent("artenia-filters-changed", { detail: next }));
    } catch (err) {
      // ignore
    }
  };

  // TODO: cuando tengamos estos datos en Stats, se sustituyen
  const riesgoStats = {
    critico: 2,
    alto: 2,
    medio: 2,
    bajo: 102,
  };

  return (
    <aside className="sidebar-shell">
{/* === BUSCADOR (arriba del todo) === */}
<section className="sidebar-section sidebar-section-search">
  <div className="sidebar-section-title">Buscar talleres, oficios…</div>

  <div className="sidebar-search-wrapper">
    <span className="sidebar-search-icon">🔍</span>

    <input
      className="sidebar-input"
      type="text"
      placeholder="Buscar talleres, oficios, ciudades, productos o rutas…"
      value={searchLocal}
      onChange={(e) => setSearchLocal(e.target.value)}
      aria-label="Búsqueda global"
    />

    <button
      type="button"
      className="sidebar-search-btn"
      onClick={() => setFilters({ ...filters })}
      aria-label="Aplicar búsqueda"
    >
      Buscar
    </button>
  </div>
</section>

      {/* === TARJETA OFICIOS EN RIESGO === */}
      <section className="sidebar-section">
        <div className="sidebar-card-alert">
          <div className="sidebar-card-alert-header">
            <span className="sidebar-card-alert-icon">!</span>
            <div>
              <div className="sidebar-card-alert-title">Oficios en Riesgo</div>
              <p className="sidebar-card-alert-subtitle">
                4 oficios en peligro de extinción
              </p>
            </div>
          </div>

          <div className="sidebar-card-alert-list">
            <div className="sidebar-card-alert-item">
              <span className="sidebar-card-alert-name">
                Carpintero/a de ribera
              </span>
              <span className="sidebar-card-alert-count">(1 activos)</span>
            </div>
            <div className="sidebar-card-alert-item">
              <span className="sidebar-card-alert-name">
                Espartero/Espartera
              </span>
              <span className="sidebar-card-alert-count">(3 activos)</span>
            </div>
            <div className="sidebar-card-alert-item">
              <span className="sidebar-card-alert-name">Tejedor/Tejedora</span>
              <span className="sidebar-card-alert-count">(2 activos)</span>
            </div>
          </div>
        </div>
      </section>

      {/* === FILTROS === */}
      <section className="sidebar-section">
        <div className="sidebar-section-title sidebar-section-title-upper">
          Filtros
        </div>

        <label className="block mb-3">
          <div className="text-xs text-slate-300 mb-1">Categoría</div>
          <select
            className="sidebar-select"
            value={filters.categoria}
            onChange={handleSelectChange("categoria")}
          >
            <option value="Todos">Todas</option>
            <option value="Artesanía tradicional">Artesanía tradicional</option>
            <option value="Arte contemporáneo">Arte contemporáneo</option>
            <option value="Oficio industrial">Oficio industrial</option>
          </select>
        </label>

        <label className="block mb-3">
          <div className="text-xs text-slate-300 mb-1">Nivel de actividad</div>
          <select
            className="sidebar-select"
            value={filters.actividad}
            onChange={handleSelectChange("actividad")}
          >
            <option value="Todos">Todos</option>
            <option value="Muy activo">Muy activo</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </label>

        <label className="block">
          <div className="text-xs text-slate-300 mb-1">Riesgo del oficio</div>
          <select
            className="sidebar-select"
            value={filters.riesgo}
            onChange={handleSelectChange("riesgo")}
          >
            <option value="Todos">Todos</option>
            <option value="Crítico">Crítico</option>
            <option value="Alto">Alto</option>
            <option value="Medio">Medio</option>
            <option value="Bajo">Bajo</option>
          </select>
        </label>

        <label className="block mt-4">
          <div className="text-xs text-slate-300 mb-1">Tipo de resultado</div>
          <select
            className="sidebar-select"
            value={filters.tipoResultado || "Todos"}
            onChange={handleSelectChange("tipoResultado")}
          >
            <option value="Todos">Todos</option>
            <option value="Talleres">Talleres</option>
            <option value="Oficios">Oficios</option>
            <option value="Rutas">Rutas</option>
          </select>
        </label>

        <label className="block mt-4">
          <div className="text-xs text-slate-300 mb-1">Municipio</div>
          <select
            className="sidebar-select"
            value={filters.municipio || "Todos"}
            onChange={handleSelectChange("municipio")}
          >
            <option value="Todos">Todos</option>
            <option value="Alicante">Alicante</option>
            <option value="Valencia">Valencia</option>
            <option value="Castellón">Castellón</option>
          </select>
        </label>

        <button
          type="button"
          className="sidebar-reset-btn"
          onClick={handleReset}
        >
          Reset filtros
        </button>
      </section>

      {/* === ESTADÍSTICAS === */}
      {/* === INSIGHTS (bloque nuevo) === */}
      <section className="sidebar-section">
        <div className="sidebar-section-title sidebar-section-title-upper">Insights</div>

        <div className="sidebar-insights-grid">
          <div className="sidebar-insight-card">
            <div className="sidebar-insight-title">Ecosistema actual</div>
            <div className="sidebar-insight-values">
              <div>
                <div className="sidebar-insight-number">{stats.total}</div>
                <div className="sidebar-insight-label">Talleres</div>
              </div>
              <div>
                <div className="sidebar-insight-number">{stats.muyActivo}</div>
                <div className="sidebar-insight-label">Muy activos</div>
              </div>
            </div>
            <button className="sidebar-insight-cta" onClick={() => window.dispatchEvent(new CustomEvent('artenia-open-insights'))}>
              Ver análisis completo
            </button>
          </div>

          <div className="sidebar-insight-card">
            <div className="sidebar-insight-title">Oficios críticos</div>
            <div className="sidebar-insight-meta">
              <div className="sidebar-insight-small">Crítico: {riesgoStats.critico}</div>
              <div className="sidebar-insight-small">Alto: {riesgoStats.alto}</div>
            </div>
            <button className="sidebar-insight-cta" onClick={() => window.dispatchEvent(new CustomEvent('artenia-open-risk-list'))}>
              Ver lista
            </button>
          </div>
        </div>
      </section>
      <section className="sidebar-section sidebar-section-stats">
        <div className="sidebar-stats-title">Estadísticas</div>

        {/* Bloque talleres */}
        <div className="sidebar-stats-card">
          <div className="sidebar-stats-header">
            <span>Talleres</span>
            <span className="sidebar-stats-pill">{stats.total}</span>
          </div>

          <div className="sidebar-stat-row">
            <span>Muy activo</span>
            <span>{stats.muyActivo}</span>
          </div>
          <div className="sidebar-stat-row">
            <span>Activo</span>
            <span>{stats.activo}</span>
          </div>
          <div className="sidebar-stat-row">
            <span>Inactivo</span>
            <span>{stats.inactivo}</span>
          </div>
        </div>

        {/* Bloque oficios en riesgo */}
        <div className="sidebar-stats-card sidebar-stats-card-risk">
          <div className="sidebar-stats-header">
            <span>Oficios (Riesgo)</span>
          </div>

          <div className="sidebar-stat-row sidebar-stat-row-critical">
            <span>Crítico</span>
            <span>{riesgoStats.critico}</span>
          </div>
          <div className="sidebar-stat-row sidebar-stat-row-high">
            <span>Alto</span>
            <span>{riesgoStats.alto}</span>
          </div>
          <div className="sidebar-stat-row sidebar-stat-row-medium">
            <span>Medio</span>
            <span>{riesgoStats.medio}</span>
          </div>
          <div className="sidebar-stat-row sidebar-stat-row-low">
            <span>Bajo</span>
            <span>{riesgoStats.bajo}</span>
          </div>
        </div>
      </section>

      {/* === BOTÓN ASOCIACIONES === */}
      <button
        type="button"
        className="sidebar-assoc-btn"
      >
        <span className="sidebar-assoc-icon">👥</span>
        <span>
          Mostrar Asociaciones{" "}
          <span className="sidebar-assoc-count">(7)</span>
        </span>
      </button>
    </aside>
  );
}
