import { useEffect } from "react";
import mapboxgl from "mapbox-gl";

type Artisan = {
  id: string;
  nombre: string;
  lat: number;
  lon: number;
  [key: string]: any;
};

interface NodeProps {
  map: mapboxgl.Map;
  data: Artisan;
  onClick: () => void;
}

export default function NodePentagon({ map, data, onClick }: NodeProps) {
  useEffect(() => {
    const el = document.createElement("div");
    el.className = "hexagon";
    el.onclick = onClick;

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([data.lon, data.lat])
      .addTo(map);

    return () => {
      marker.remove();
    };
  }, [map, data, onClick]);

  return null;
}
