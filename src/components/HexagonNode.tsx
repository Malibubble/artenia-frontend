import React, { useState } from "react";
import "./HexagonNode.css";
import HexagonNodeModal from "./HexagonNodeModal";

export type Artesano = {
  id: string;
  nombre: string;
  disciplina: string;
  subdisciplina?: string;
  avatar?: string;
  localidad?: string;
  comarca?: string;
  estado?: "activo" | "riesgo" | "historico";
  descripcion?: string;
  asociaciones?: string[];
  ferias?: string[];
  rutas?: string[];
  breathing?: boolean;
};

type HexagonNodeProps = {
  artesano: Artesano;
  // onSelect accepts an Artesano to open selection, or null to clear selection
  onSelect?: (artesano: Artesano | null) => void;
};

const disciplinaIcons: Record<string, string> = {
  cerámica: "🏺",
  encaje: "🪡",
  vidrio: "✨",
  forja: "⚒️",
  madera: "🪵",
  textil: "🧵",
  cuero: "🎒",
  metales: "🔧",
  alfarería: "🏺",
  orfebrería: "👑",
};

export default function HexagonNode({
  artesano,
  onSelect,
}: HexagonNodeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimer = React.useRef<number | null>(null);
  const leaveTimer = React.useRef<number | null>(null);

  const handleClick = () => {
    if (onSelect) {
      onSelect(artesano);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    // schedule selection after a small delay to avoid flicker
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      if (onSelect) onSelect(artesano);
    }, 120);
    // cancel any leave timer
    if (leaveTimer.current) {
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // clear pending hover timer
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    // schedule deselect after a short delay so user can move to panel
    if (onSelect) {
      if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
      leaveTimer.current = window.setTimeout(() => {
        onSelect(null);
      }, 260);
    }
  };

  const getDisciplinaIcon = (disciplina: string): string => {
    const lower = disciplina.toLowerCase();
    return (
      Object.entries(disciplinaIcons).find(([key]) =>
        lower.includes(key)
      )?.[1] || "🎨"
    );
  };

  const avatarSrc = artesano.avatar || `/avatars/default-artesano.jpg`;
  const disciplinaIcon = getDisciplinaIcon(artesano.disciplina);
  const estadoClass = artesano.estado
    ? `hexagon-node--${artesano.estado}`
    : "";
  const breathingClass = artesano.breathing ? "hexagon-node--breathing" : "";

  return (
    <>
      <div
        className={`hexagon-node ${estadoClass} ${breathingClass}`}
        data-artesano-id={artesano.id}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-label={`Ficha de ${artesano.nombre}`}
      >
        {/* Borde luminoso externo */}
        <div className="hexagon-node__border" />

        {/* Contenido */}
        <div className="hexagon-node__content">
          {/* Avatar */}
          <img
            src={avatarSrc}
            alt={artesano.nombre}
            className="hexagon-node__avatar"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/avatars/default-artesano.jpg";
            }}
          />

          {/* Nombre */}
          <div className="hexagon-node__name">{artesano.nombre}</div>

          {/* Disciplina */}
          <div className="hexagon-node__discipline">
            <span className="hexagon-node__discipline-icon">
              {disciplinaIcon}
            </span>
            <span className="hexagon-node__discipline-text">
              {artesano.disciplina}
            </span>
          </div>

          {/* Indicador de estado */}
          {artesano.estado && (
            <div className={`hexagon-node__status hexagon-node__status--${artesano.estado}`}>
              {artesano.estado === "activo" && "●"}
              {artesano.estado === "riesgo" && "⚠"}
              {artesano.estado === "historico" && "✱"}
            </div>
          )}
        </div>

        {/* Línea de conexión en hover */}
        {isHovering && <div className="hexagon-node__connection-line" />}
      </div>

      {/* Modal expandido (solo si no hay delegado onSelect) */}
      {!onSelect && isModalOpen && (
        <HexagonNodeModal
          artesano={artesano}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
