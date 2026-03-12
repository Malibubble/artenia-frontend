// src/pages/Home.tsx

export default function Home() {
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
          Home temporal
        </h1>
        <p style={{ opacity: 0.8, fontSize: "0.95rem" }}>
          La vista principal de Artenia ahora es el mapa en <code>/</code> y{" "}
          <code>/presentacion</code> para la parte estratégica.
        </p>
      </div>
    </div>
  );
}
