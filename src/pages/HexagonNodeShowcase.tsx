import React, { useEffect, useState } from "react";
import Honeycomb, { HoneycombNode } from "../components/Honeycomb";
import { NodeDetailModal, type NodeDetail } from "@/components/NodeDetailModal";
import { fetchHoneycombNodes } from "../utils/fetchHoneycombNodes";
import "./HexagonNodeShowcase.css";

export default function HexagonNodeShowcase() {
  const [nodes, setNodes] = useState<HoneycombNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeNode, setActiveNode] = useState<NodeDetail | null>(null);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        setLoading(true);
        const fetched = await fetchHoneycombNodes();
        if (isActive) setNodes(fetched);
      } catch (err) {
        console.error("[HexagonNodeShowcase] Error cargando colmena", err);
        if (isActive) setError("No se pudieron cargar los nodos en vivo (modo demo).");
      } finally {
        if (isActive) setLoading(false);
      }
    };

    load();
    return () => {
      isActive = false;
    };
  }, []);

  function openNodeFromHex(rawNodeData: any) {
    if (!rawNodeData) return;

    const conexiones =
      rawNodeData.connections?.map((c: string, idx: number) => ({
        id: `${rawNodeData.id}-conn-${idx}`,
        nombre: c,
        tipo: undefined,
        descripcion: undefined,
      })) || [];

    const node: NodeDetail = {
      id: rawNodeData.id,
      role: rawNodeData.role || "artesano",
      nombre: rawNodeData.name,
      subtitulo: rawNodeData.subtitle || rawNodeData.oficio || rawNodeData.tipo_asociacion || "",
      imagenUrl: rawNodeData.imagen || rawNodeData.imagenUrl || null,
      avatarHexColor: rawNodeData.hex_color || "#14b8a6",
      etiquetas: [
        rawNodeData.subtitle ? { label: rawNodeData.subtitle, variant: "primary" } : null,
        rawNodeData.disciplina ? { label: rawNodeData.disciplina, variant: "secondary" } : null,
        rawNodeData.actividad_digital ? { label: "Digitalización " + rawNodeData.actividad_digital, variant: "danger" } : null,
      ].filter(Boolean) as NodeDetail["etiquetas"],
      descripcion: rawNodeData.description,
      ubicacion: rawNodeData.location || rawNodeData.municipio,
      horario: rawNodeData.horario,
      fundacion: rawNodeData.antiguedad_anos ? String(rawNodeData.antiguedad_anos) : undefined,
      visitable: rawNodeData.tienda_fisica,
      tecnicas: rawNodeData.tecnicas || [],
      productos: rawNodeData.productos || [],
      presenciaDigital: {
        web: !!rawNodeData.web,
        redes: !!(rawNodeData.instagram || rawNodeData.facebook || rawNodeData.tiktok),
        googleBusiness: rawNodeData.google_business ?? false,
        tiendaOnline: rawNodeData.tienda_online,
      },
      conexiones,
      telefono: rawNodeData.telefono,
      email: rawNodeData.email,
      web: rawNodeData.web,
    };

    setActiveNode(node);
  }

  return (
    <div className="colmena-shell">
      <div className="colmena-honeycomb">
        {loading && <div className="colmena-status">Cargando colmena en vivo…</div>}
        {error && <div className="colmena-status colmena-status--error">{error}</div>}
        <Honeycomb nodes={nodes} onNodeClick={openNodeFromHex} />
        <div className="colmena-mini-legend">
          <span className="mini-chip mini-chip--artesano">Artesanos</span>
          <span className="mini-chip mini-chip--asociacion">Asociaciones</span>
          <span className="mini-chip mini-chip--institucion">Instituciones</span>
          <span className="mini-chip mini-chip--patrocinador">Patrocinadores</span>
          <span className="mini-chip mini-chip--breathing">Latido activo</span>
        </div>
      </div>

      <footer className="colmena-footer">
        <div>
          <p className="colmena-kicker">Vista Colmena · Red Viva</p>
          <h1 className="colmena-title">Hexágonos que respiran e iluminan los roles</h1>
          <p className="colmena-lead">
            Visualiza cómo conviven artesanos, asociaciones, instituciones y patrocinadores. Pasa el
            cursor para ver tooltips y pulsa para abrir el panel lateral dinámico.
          </p>
        </div>
        <div className="colmena-legend">
          <div className="legend-chip legend-chip--artesano">Artesanos (azul)</div>
          <div className="legend-chip legend-chip--asociacion">Asociaciones (magenta)</div>
          <div className="legend-chip legend-chip--institucion">Instituciones (verde)</div>
          <div className="legend-chip legend-chip--patrocinador">Patrocinadores (dorado)</div>
          <div className="legend-chip legend-chip--breathing">Latido activo</div>
        </div>
      </footer>

      {activeNode && (
        <NodeDetailModal
          node={activeNode}
          onClose={() => setActiveNode(null)}
          onOpenOnMap={(id) => {
            console.log("Centrar mapa en nodo", id);
          }}
          onOpenConnection={(id, tipo) => {
            console.log("Abrir conexión → nodo:", id, "tipo:", tipo);
          }}
        />
      )}
    </div>
  );
}
