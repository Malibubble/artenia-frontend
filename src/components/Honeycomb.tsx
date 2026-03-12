import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Honeycomb.css";

export type HoneycombRole = "artesano" | "asociacion" | "institucion" | "patrocinador";

export type HoneycombNode = {
  id: string;
  name: string;
  role: HoneycombRole;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  isBreathing?: boolean;
  color?: string;
  subtitle?: string;
  location?: string;
  description?: string;
  tags?: string[];
  connections?: string[];
};

const ROLE_COLORS: Record<HoneycombRole, { light: string; glow: string; shadow: string }> = {
  artesano: {
    light: "#66b6ff",
    glow: "rgba(102, 182, 255, 0.45)",
    shadow: "rgba(102, 182, 255, 0.2)",
  },
  asociacion: {
    light: "#ff9fe3",
    glow: "rgba(255, 159, 227, 0.45)",
    shadow: "rgba(255, 159, 227, 0.2)",
  },
  institucion: {
    light: "#8cf5c6",
    glow: "rgba(140, 245, 198, 0.45)",
    shadow: "rgba(140, 245, 198, 0.2)",
  },
  patrocinador: {
    light: "#ffe48a",
    glow: "rgba(255, 228, 138, 0.48)",
    shadow: "rgba(255, 228, 138, 0.2)",
  },
};

const ROLE_LABEL: Record<HoneycombRole, string> = {
  artesano: "Artesano/a",
  asociacion: "Asociación",
  institucion: "Institución",
  patrocinador: "Patrocinador",
};

const SAMPLE_NODES: HoneycombNode[] = [
  {
    id: "art-1",
    name: "Rosa Ruiz",
    subtitle: "Encaje de bolillos",
    location: "Valle del Jerte",
    role: "artesano",
    x: 0,
    y: 0,
    isBreathing: true,
    description: "Maestra encajera que enseña y preserva puntillas tradicionales.",
    tags: ["Encaje", "Transmisión"],
    connections: ["Instituto Artesanía", "Fondo Horizonte"],
  },
  {
    id: "asoc-1",
    name: "Asociación Oficios Vivos",
    subtitle: "Red de artesanos comarcales",
    location: "Las Hurdes",
    role: "asociacion",
    x: -140,
    y: 90,
    description: "Coordina talleres, ferias y mentorías entre artesanos vecinos.",
    tags: ["Mentoría", "Ferias"],
    connections: ["Rosa Ruiz", "Instituto Artesanía"],
  },
  {
    id: "inst-1",
    name: "Instituto Artesanía",
    subtitle: "Programa de becas y transmisión",
    location: "Madrid",
    role: "institucion",
    x: 140,
    y: 40,
    description: "Becas, residencias y digitalización para talleres rurales.",
    tags: ["Becas", "Digitalización"],
    connections: ["Asociación Oficios Vivos", "Taller Mudéjar"],
  },
  {
    id: "pat-1",
    name: "Fondo Horizonte",
    subtitle: "Patrocinio cultural",
    location: "Bilbao",
    role: "patrocinador",
    x: 0,
    y: 160,
    isBreathing: true,
    description: "Capital paciente para restauraciones y nuevas rutas de oficio.",
    tags: ["Impacto", "Restauración"],
    connections: ["Rosa Ruiz", "Instituto Artesanía"],
  },
  {
    id: "art-2",
    name: "Taller Mudéjar",
    subtitle: "Yesería y azulejo",
    location: "Toledo",
    role: "artesano",
    x: 140,
    y: -80,
    isBreathing: true,
    description: "Recupera piezas arquitectónicas con técnicas mudéjares.",
    tags: ["Yeso", "Azulejo"],
    connections: ["Fondo Horizonte", "Instituto Artesanía"],
  },
  {
    id: "asoc-2",
    name: "Colectivo Textil Vega",
    subtitle: "Laboratorio colaborativo",
    location: "Cuenca",
    role: "asociacion",
    x: -60,
    y: -150,
    description: "Agrupa telares manuales y conecta con diseñadores locales.",
    tags: ["Co-diseño", "Textil"],
    connections: ["Taller Mudéjar", "Consejería de Cultura"],
  },
  {
    id: "inst-2",
    name: "Consejería de Cultura",
    subtitle: "Apoyo institucional",
    location: "Mérida",
    role: "institucion",
    x: -200,
    y: 10,
    description: "Financia museografía y rutas demostrativas por comarcas.",
    tags: ["Museografía", "Rutas"],
    connections: ["Colectivo Textil Vega", "Asociación Oficios Vivos"],
  },
  {
    id: "pat-2",
    name: "Fundación Ámbar",
    subtitle: "Patrocinio de residencias",
    location: "Barcelona",
    role: "patrocinador",
    x: 200,
    y: -10,
    description: "Beca residencias de aprendizaje y compra primeras colecciones.",
    tags: ["Residencias", "Coleccionismo"],
    connections: ["Rosa Ruiz", "Colectivo Textil Vega"],
  },
];

interface HoneycombProps {
  nodes?: HoneycombNode[];
  onNodeClick?: (node: HoneycombNode) => void;
}

export default function Honeycomb({
  nodes = SAMPLE_NODES,
  onNodeClick,
}: HoneycombProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ node: HoneycombNode; x: number; y: number } | null>(null);
  const [selectedNode, setSelectedNode] = useState<HoneycombNode | null>(null);
  const nodesRef = useRef<HoneycombNode[]>([]);
  const connectionsRef = useRef<{ from: HoneycombNode; to: HoneycombNode; color: string }[]>([]);
  const pulsesRef = useRef<
    {
      fromId: string;
      toId: string;
      progress: number;
      speed: number;
      color: string;
      cooldown: number;
    }
  >([]);
  const lastTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    nodesRef.current = nodes.map((node) => ({
      ...node,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }));
    const mapById = new Map<string, HoneycombNode>();
    const mapByName = new Map<string, HoneycombNode>();
    nodesRef.current.forEach((n) => {
      mapById.set(n.id, n);
      mapByName.set(n.name, n);
    });

    const connections: { from: HoneycombNode; to: HoneycombNode; color: string }[] = [];
    nodesRef.current.forEach((n) => {
      const targets = n.connections || [];
      targets.forEach((conn) => {
        const target =
          mapById.get(conn) || mapByName.get(conn) || mapById.get(conn.replace(/-.+$/, "")) || null;
        if (target) {
          connections.push({
            from: n,
            to: target,
            color: ROLE_COLORS[n.role].light,
          });
        }
      });
    });
    connectionsRef.current = connections;
    pulsesRef.current = connections.map((c) => {
      const connCount = (c.from.connections?.length || 0) as number;
      const activity = (c.from.isBreathing ? 0.6 : 0.3) + Math.min(connCount / 4, 1) * 0.6;
      const speed = 0.02 + activity * 0.06; // base lento, sube suavemente con actividad
      return {
        fromId: c.from.id,
        toId: c.to.id,
        progress: Math.random(),
        speed,
        color: c.color,
        cooldown: Math.random() * 1.2,
      };
    });
    setSelectedNode(nodes[0] ?? null);
  }, [nodes]);

  const drawHexagon = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    fillColor: string,
    strokeColor: string,
    glowColor: string,
    isHovered: boolean,
    isBreathing: boolean,
    breathePhase: number
  ) => {
    const angles = [0, 60, 120, 180, 240, 300].map((a) => (a * Math.PI) / 180);
    const breatheScale = isBreathing ? 1 + Math.sin(breathePhase) * 0.07 : 1;
    const currentSize = size * breatheScale;

    ctx.save();
    const gradient = ctx.createRadialGradient(x, y, currentSize * 0.35, x, y, currentSize);
    gradient.addColorStop(0, fillColor);
    gradient.addColorStop(1, "rgba(2, 6, 8, 0.35)");
    ctx.fillStyle = gradient;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = isHovered ? 3 : 2;

    ctx.beginPath();
    angles.forEach((angle, i) => {
      const px = x + currentSize * Math.cos(angle);
      const py = y + currentSize * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.closePath();
    ctx.fill();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = isHovered || isBreathing ? 22 : 12;
    ctx.stroke();
    ctx.restore();
  };

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const nowMs = Date.now();
    const time = nowMs / 1000;
    const delta = Math.min(0.05, (nowMs - lastTimeRef.current) / 1000);
    lastTimeRef.current = nowMs;

    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGradient.addColorStop(0, "#020608");
    bgGradient.addColorStop(1, "#0a0f1a");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 120) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 120) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.restore();

    connectionsRef.current.forEach(({ from, to, color }) => {
      const x1 = centerX + from.x;
      const y1 = centerY + from.y;
      const x2 = centerX + to.x;
      const y2 = centerY + to.y;

      ctx.save();
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, `${color}aa`);
      gradient.addColorStop(1, `${ROLE_COLORS[to.role].light}aa`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    });

    pulsesRef.current.forEach((pulse) => {
      const fromNode = nodesRef.current.find((n) => n.id === pulse.fromId);
      const toNode = nodesRef.current.find((n) => n.id === pulse.toId);
      if (!fromNode || !toNode) return;

      if (pulse.cooldown > 0) {
        pulse.cooldown = Math.max(0, pulse.cooldown - delta);
        return;
      }

      pulse.progress += pulse.speed * delta;
      if (pulse.progress >= 1) {
        pulse.progress = 0;
        pulse.cooldown = 0.6 + Math.random() * 1.2; // pausa entre pulsos
      }
      const x1 = centerX + fromNode.x;
      const y1 = centerY + fromNode.y;
      const x2 = centerX + toNode.x;
      const y2 = centerY + toNode.y;

      const px = x1 + (x2 - x1) * pulse.progress;
      const py = y1 + (y2 - y1) * pulse.progress;

      ctx.save();
      const grad = ctx.createRadialGradient(px, py, 0, px, py, 12);
      grad.addColorStop(0, pulse.color);
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Flotar suavemente dentro del canvas
    const maxX = Math.max(120, canvas.width / 2 - 160);
    const maxY = Math.max(120, canvas.height / 2 - 160);
    nodesRef.current.forEach((node) => {
      node.x += node.vx ?? 0;
      node.y += node.vy ?? 0;
      if (node.x > maxX || node.x < -maxX) node.vx = -(node.vx ?? 0);
      if (node.y > maxY || node.y < -maxY) node.vy = -(node.vy ?? 0);
    });

    const breathePhase = time * 2;
    nodesRef.current.forEach((node) => {
      const palette = ROLE_COLORS[node.role];
      const isHovered = hoveredNode === node.id;
      const isSelected = selectedNode?.id === node.id;
      const x = centerX + node.x;
      const y = centerY + node.y;

      const focusBoost = isHovered ? 1.12 : isSelected ? 1.06 : 1;
      const size = 36 * focusBoost;
      const idNumber = parseInt(node.id.replace(/\D/g, ""), 10) || 0;

      drawHexagon(
        ctx,
        x,
        y,
        size,
        `${palette.light}22`,
        node.color || palette.light,
        palette.glow,
        isHovered || isSelected,
        node.isBreathing ?? false,
        breathePhase + idNumber * 0.12
      );

      ctx.save();
      ctx.fillStyle = palette.light;
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const displayName = node.name.length > 16 ? `${node.name.slice(0, 15)}…` : node.name;
      ctx.fillText(displayName, x, y - 4);

      if (node.subtitle) {
        ctx.font = "10px Inter, sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.68)";
        const subtitle = node.subtitle.length > 18 ? `${node.subtitle.slice(0, 17)}…` : node.subtitle;
        ctx.fillText(subtitle, x, y + 10);
      }

      ctx.font = "bold 9px Inter, sans-serif";
      ctx.fillStyle = palette.light;
      const roleSymbol =
        node.role === "artesano"
          ? "◆"
          : node.role === "asociacion"
          ? "●"
          : node.role === "institucion"
          ? "■"
          : "▲";
      ctx.fillText(roleSymbol, x, y + 24);
      ctx.restore();
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [hoveredNode, selectedNode]);

  useEffect(() => {
    animate();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const findNodeAtPosition = (px: number, py: number): HoneycombNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (const node of nodesRef.current) {
      const x = centerX + node.x;
      const y = centerY + node.y;
      const dist = Math.hypot(px - x, py - y);
      if (dist < 48) return node;
    }
    return null;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const node = findNodeAtPosition(clickX, clickY);
    if (node) {
      setSelectedNode(node);
      onNodeClick?.(node);
    } else {
      setSelectedNode(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const moveY = e.clientY - rect.top;

    const node = findNodeAtPosition(moveX, moveY);
    if (node) {
      setHoveredNode(node.id);
      setTooltip({ node, x: moveX + 18, y: moveY - 10 });
      canvas.style.cursor = "pointer";
    } else {
      setHoveredNode(null);
      setTooltip(null);
      canvas.style.cursor = "default";
    }
  };

  const handleCanvasMouseLeave = () => {
    setHoveredNode(null);
    setTooltip(null);
  };

  return (
    <div className="honeycomb-container">
      <canvas
        ref={canvasRef}
        className="honeycomb-canvas"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={handleCanvasMouseLeave}
      />

      <div className="honeycomb-legend">
        <div className="legend-item">
          <span className="legend-indicator" style={{ background: ROLE_COLORS.artesano.light }} />
          <span>Artesanos</span>
        </div>
        <div className="legend-item">
          <span className="legend-indicator" style={{ background: ROLE_COLORS.asociacion.light }} />
          <span>Asociaciones</span>
        </div>
        <div className="legend-item">
          <span className="legend-indicator" style={{ background: ROLE_COLORS.institucion.light }} />
          <span>Instituciones</span>
        </div>
        <div className="legend-item">
          <span className="legend-indicator" style={{ background: ROLE_COLORS.patrocinador.light }} />
          <span>Patrocinadores</span>
        </div>
      </div>

      {tooltip && (
        <div
          className="honeycomb-tooltip"
          style={{ left: tooltip.x, top: tooltip.y, borderColor: ROLE_COLORS[tooltip.node.role].light }}
        >
          <div className="tooltip-role" style={{ color: ROLE_COLORS[tooltip.node.role].light }}>
            {ROLE_LABEL[tooltip.node.role]}
          </div>
          <div className="tooltip-name">{tooltip.node.name}</div>
          {tooltip.node.location && <div className="tooltip-location">{tooltip.node.location}</div>}
        </div>
      )}

      <div className={`honeycomb-panel ${selectedNode ? "is-visible" : ""}`}>
        {selectedNode ? (
          <>
            <div className="honeycomb-panel__header">
              <div className="panel-pulse" style={{ background: ROLE_COLORS[selectedNode.role].light }} />
              <div>
                <p className="honeycomb-panel__eyebrow">{ROLE_LABEL[selectedNode.role]}</p>
                <h3 className="honeycomb-panel__name">{selectedNode.name}</h3>
                {selectedNode.subtitle && (
                  <p className="honeycomb-panel__subtitle">{selectedNode.subtitle}</p>
                )}
              </div>
              <button className="honeycomb-panel__close" onClick={() => setSelectedNode(null)}>
                ✕
              </button>
            </div>

            {selectedNode.location && (
              <p className="honeycomb-panel__location">{selectedNode.location}</p>
            )}
            <p className="honeycomb-panel__description">
              {selectedNode.description || "Nodo conectado en la red de Artenia."}
            </p>

            {selectedNode.tags && selectedNode.tags.length > 0 && (
              <div className="honeycomb-panel__tags">
                {selectedNode.tags.map((tag) => (
                  <span key={tag} className="panel-chip">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {selectedNode.connections && selectedNode.connections.length > 0 && (
              <div className="honeycomb-panel__block">
                <p className="honeycomb-panel__block-title">Conexiones</p>
                <div className="honeycomb-panel__connections">
                  {selectedNode.connections.map((conn) => (
                    <span key={conn} className="panel-connection">
                      {conn}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="honeycomb-panel__empty">
            <p className="honeycomb-panel__eyebrow">Panel vivo</p>
            <h3 className="honeycomb-panel__name">Explora la colmena</h3>
            <p className="honeycomb-panel__description">
              Pasa el cursor por cualquier hexágono para ver el tooltip y haz clic para abrir su ficha lateral.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
