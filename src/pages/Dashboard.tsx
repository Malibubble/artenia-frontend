// src/pages/Dashboard.tsx
// Dashboard original de Manus desactivado.
// De momento no se usa en esta versión de Artenia.

export default function Dashboard() {
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
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>
          Dashboard (en pausa)
        </h1>
        <p style={{ opacity: 0.8, fontSize: "0.95rem" }}>
          El panel de taller se reconstruirá más adelante con nuestra propia
          lógica. Ahora mismo el corazón de Artenia es el mapa vivo que ya está
          integrado en la Home.
        </p>
      </div>
    </div>
  );
}
