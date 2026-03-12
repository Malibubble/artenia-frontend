// src/components/VistaToggle.tsx
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type Vista = "mapa" | "colmena";

type VistaToggleProps = {
  view: Vista;
  onToggle: (view: Vista) => void;
};

export function VistaToggle({ view, onToggle }: VistaToggleProps) {
  const [pos, setPos] = useState(() => ({
    x: 16,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 200,
  }));
  const [dragging, setDragging] = useState(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPos((p) => ({ ...p, y: window.innerHeight / 2 }));
  }, []);

  const handlePointerMove = (e: PointerEvent) => {
    setPos({
      x: e.clientX - offsetRef.current.x,
      y: e.clientY - offsetRef.current.y,
    });
  };

  const endDrag = () => {
    setDragging(false);
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", endDrag);
  };

  const startDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    setDragging(true);
    offsetRef.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", endDrag);
  };

  return (
    <div
      className={`vista-toggle${dragging ? " is-dragging" : ""}`}
      style={{ left: pos.x, top: pos.y }}
      onPointerDown={startDrag}
    >
      <button
        className={`vista-toggle__btn${view === "mapa" ? " is-active" : ""}`}
        onClick={() => onToggle("mapa")}
      >
        Mapa
      </button>
      <button
        className={`vista-toggle__btn${view === "colmena" ? " is-active" : ""}`}
        onClick={() => onToggle("colmena")}
      >
        Colmena
      </button>
    </div>
  );
}
