// src/App.tsx
import { useState } from "react";
import { Route, Switch, Link, useLocation } from "wouter";
import {
  Activity,
  Map as MapIcon,
  Grid3X3,
  SlidersHorizontal,
  UserRound,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
  Hammer,
  MapPin,
  Layers,
  Info,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import ArtisanMap from "./components/ArtisanMap";
import Presentacion from "./pages/Presentacion";
import Landing from "./pages/Landing";
import Artesano from "./pages/Artesano";
import ArtisanHexCardTest from "./pages/ArtisanHexCardTest";
import HexagonNodeShowcase from "./pages/HexagonNodeShowcase";
import MapaHoneycomb from "./pages/MapaHoneycomb";

import "./styles/map.css";
import "./App.css";

// ---------------------- TIPOS ----------------------

export type Filters = {
  categoria: string;
  actividad: string;
  riesgo: string;
  searchQuery?: string;
  estadoOficio?: string;
  comunidad?: string;
  provincia?: string;
  comarca?: string;
  municipio?: string;
  tipoResultado?: "Todos" | "Talleres" | "Oficios" | "Rutas";
};

export type Stats = {
  total: number;
  muyActivo: number;
  activo: number;
  inactivo: number;
};

// ---------------------- HEADER ----------------------

function Header({ currentPath }: { currentPath: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menu = [
    {
      title: "Mapa",
      items: [
        { href: "/mapa", label: "Explorar mapa" },
        { href: "/mapa/geografico", label: "Mapa geográfico" },
        { href: "/colmena", label: "Vista colmena" },
      ],
      hoverText: "Descubre dónde se preservan —o se pierden— los oficios.",
    },
    // small icons mapping will be rendered per title
    {
      title: "Oficios",
      items: [
        { href: "/oficios", label: "Directorio de oficios" },
        { href: "/oficios/riesgo", label: "Oficios en riesgo" },
        { href: "/oficios/desaparecidos", label: "Oficios desaparecidos" },
      ],
    },
    {
      title: "Talleres",
      items: [
        { href: "/talleres", label: "Todos los talleres" },
        { href: "/talleres/activos", label: "Talleres activos" },
        { href: "/talleres/riesgo", label: "Talleres en riesgo" },
        { href: "/talleres/cerrados", label: "Talleres cerrados" },
      ],
    },
    {
      title: "Rutas",
      items: [
        { href: "/rutas/crear", label: "Crear rutas" },
        { href: "/rutas/comarcales", label: "Rutas comarcales" },
        { href: "/rutas/tematicas", label: "Rutas temáticas" },
      ],
      hoverText: "Diseña viajes culturales con artesanos, arquitectura y territorio.",
    },
    { title: "Presentación", href: "/presentacion" },
  ];

  return (
    <header className="artenia-header">
      <div className="artenia-brand">
        <div className="artenia-logo-hex glow-cyan animate-breathe">
          <img src="/logo.svg" alt="Artenia" className="artenia-logo-img" />
        </div>
        <div className="artenia-brand-text">
          <div className="artenia-brand-title">ARTENIA LAB</div>
          <div className="artenia-brand-subtitle">Pinacoteca viva del oficio</div>
        </div>
      </div>

      <nav className={`artenia-nav main-menu ${mobileOpen ? "is-open" : ""}`} aria-label="Main navigation">
        {menu.map((m) => {
          const Icon = (() => {
            switch (m.title) {
              case "Mapa":
                return MapIcon;
              case "Oficios":
                return BookOpen;
              case "Talleres":
                return Hammer;
              case "Rutas":
                return MapPin;
              case "Presentación":
                return Info;
              default:
                return Layers;
            }
          })();

          return (
            <div key={m.title} className={`menu-group ${m.items ? "has-dropdown" : ""}`}>
              {m.items ? (
                <div className="menu-trigger artenia-nav-item" tabIndex={0} aria-haspopup="true">
                  {Icon && <Icon size={22} className="artenia-nav-item-icon" />}
                  <span className="menu-title">{m.title}</span>
                  <div className="submenu" role="menu">
                    <div className="submenu-items">
                      {m.items.map((it) => (
                        <Link key={it.label} href={it.href} className="submenu-link" role="menuitem">
                          {it.label}
                        </Link>
                      ))}
                    </div>
                    {m.hoverText && <div className="submenu-desc">{m.hoverText}</div>}
                  </div>
                </div>
              ) : (
                <Link href={(m as any).href} className="artenia-nav-link artenia-nav-item">
                  {Icon && <Icon size={22} className="artenia-nav-item-icon" />}
                  <span className="menu-title">{m.title}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      <div className="artenia-header-right">
        <div className="mobile-menu-toggle" onClick={() => setMobileOpen((s) => !s)} aria-label="Abrir menú">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="18" height="2" rx="1" fill="#e6eef7" />
            <rect y="5" width="18" height="2" rx="1" fill="#e6eef7" opacity="0.8" />
            <rect y="10" width="18" height="2" rx="1" fill="#e6eef7" opacity="0.6" />
          </svg>
        </div>

        <div className="artenia-user-chip">
          <UserRound size={16} />
          <span>Invitado</span>
        </div>
      </div>
    </header>
  );
}

// ---------------------- VISTA MAPA ----------------------

type MapViewProps = {
  filters: Filters;
  setFilters: (f: Filters) => void;
  stats: Stats;
  setStats: (s: Stats) => void;
};

function MapView({ filters, setFilters, stats, setStats }: MapViewProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  return (
    <div className="artenia-main-layout">
      {/* Sidebar con filtros */}
      <div
        className={`sidebar-shell-wrapper ${
          isSidebarCollapsed ? "is-collapsed" : ""
        }`}
      >
        <Sidebar filters={filters} setFilters={setFilters} stats={stats} />
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          aria-label={isSidebarCollapsed ? "Expandir panel" : "Colapsar panel"}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      {/* Zona mapa */}
   <div className="artenia-map-container">
  <div className="artenia-map-shell hex-grid-bg">
    {/* Mapa */}
    <ArtisanMap filters={filters} />

          {/* Overlay superior: tarjeta + pill Mapa/Colmena + filtro */}
          <div className="artenia-map-top-overlay">
            {/* Tarjeta Talleres activos */}
            <div className="artenia-map-stat-card">
              <div className="artenia-map-stat-icon">
                <Activity size={18} />
              </div>
              <div>
                <div className="artenia-map-stat-label">Talleres activos</div>
                <div className="artenia-map-stat-value">{stats.total}</div>
              </div>
            </div>

            {/* Botón filtro flotante derecha */}
            <button className="artenia-map-filter-fab" type="button">
              <SlidersHorizontal size={20} />
            </button>
          </div>

          <div className="artenia-vignette" />
        </div>
      </div>
    </div>
  );
}

// ---------------------- APP ------------------------

export default function App() {
  const [location] = useLocation();
  const [, setLocation] = useLocation();
  const [isColmenaMode, setIsColmenaMode] = useState(false);

  const [filters, setFilters] = useState<Filters>({
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
  });

  const [stats, setStats] = useState<Stats>({
    total: 271, // valor inicial; luego lo afinaremos con datos reales
    muyActivo: 0,
    activo: 0,
    inactivo: 0,
  });

  const handleToggleView = (mode: 'mapa' | 'colmena') => {
    if (mode === 'colmena') {
      setIsColmenaMode(true);
      setTimeout(() => setLocation("/colmena"), 200);
    } else {
      setIsColmenaMode(false);
      setTimeout(() => setLocation("/mapa"), 200);
    }
  };

  return (
    <div className="app-container">
      {/* Header común para todo */}
      <Header currentPath={location} />

      {/* Toggle global Mapa/Colmena - Visible en todas las páginas */}
      {(location === "/mapa" || location === "/colmena" || location === "/honeycomb") && (
        <div className="artenia-global-toggle-wrapper">
          <div className={`artenia-map-toggle ${isColmenaMode ? 'toggle-colmena' : ''}`}>
            <button 
              className="artenia-map-toggle-option arteria-map-toggle-option--active"
              onClick={() => handleToggleView('mapa')}
            >
              <MapIcon size={18} />
              <span>Mapa</span>
            </button>
            <button 
              className="artenia-map-toggle-option"
              onClick={() => handleToggleView('colmena')}
            >
              <Grid3X3 size={18} />
              <span>Colmena</span>
            </button>
          </div>
        </div>
      )}

      <div className="artenia-content">
        <Switch>
          {/* Test HexCard */}
          <Route path="/test-hex" component={ArtisanHexCardTest} />

          {/* Showcase Hexagon Nodes - Colmena */}
          <Route path="/colmena" component={HexagonNodeShowcase} />

          {/* Mapa Honeycomb - Red viva de roles */}
          <Route path="/honeycomb" component={MapaHoneycomb} />

          {/* Presentación estratégica */}
          <Route path="/presentacion" component={Presentacion} />

          {/* Mapa vivo */}
          <Route path="/mapa">
            <MapView
              filters={filters}
              setFilters={setFilters}
              stats={stats}
              setStats={setStats}
            />
          </Route>

          {/* Ficha artesano */}
          <Route path="/artesano/:id" component={Artesano} />

          {/* Home / Landing por defecto ("/" y cualquier ruta desconocida) */}
          <Route>
            <Landing />
          </Route>
        </Switch>
      </div>
    </div>
  );
}
