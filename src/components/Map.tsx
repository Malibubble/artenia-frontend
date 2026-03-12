import { useEffect, useRef } from "react";

interface MapViewProps {
  onMapReady?: (map: google.maps.Map) => void;
}

export function MapView({ onMapReady }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current || !(window as any).google?.maps) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 39.4699, lng: -0.3763 },
      zoom: 8,
      mapTypeId: "roadmap",
      gestureHandling: "greedy",
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      backgroundColor: "#050509",
    });

    if (onMapReady) onMapReady(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = "";
      }
    };
  }, [onMapReady]);

  return (
    <div className="w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
