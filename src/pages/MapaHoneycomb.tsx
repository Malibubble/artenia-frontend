import React, { useEffect, useState } from "react";
import Honeycomb, { HoneycombNode } from "../components/Honeycomb";
import { fetchHoneycombNodes } from "../utils/fetchHoneycombNodes";

export default function MapaHoneycomb() {
  const [nodes, setNodes] = useState<HoneycombNode[]>([]);
  const [loading, setLoading] = useState(true);

  const handleNodeClick = (node: HoneycombNode) => {
    console.log("Nodo seleccionado:", node);
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      const data = await fetchHoneycombNodes();
      if (isMounted) {
        setNodes(data);
        setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      {loading && <div className="colmena-status">Cargando colmena…</div>}
      <Honeycomb nodes={nodes} onNodeClick={handleNodeClick} />
    </div>
  );
}
