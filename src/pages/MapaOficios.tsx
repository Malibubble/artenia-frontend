// src/pages/MapaOficios.tsx
// Vista antigua de Manus. De momento no se usa en esta versión de Artenia.
// La dejamos como stub para que TypeScript no se queje y podamos trabajar tranquilos.

export default function MapaOficios() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 12% 0%, #191933 0%, #050509 60%)",
        color: "#fff",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>
          Mapa de oficios (vista antigua)
        </h1>
        <p style={{ opacity: 0.8, fontSize: "0.95rem" }}>
          Esta pantalla pertenece a la versión Manus.  
          Ahora el mapa vivo está integrado directamente en la home de Artenia.
        </p>
      </div>
    </div>
  );
}
