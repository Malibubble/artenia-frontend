import React from "react";

export default function Header() {
  return (
    <header
      style={{
        width: "100%",
        padding: "18px 28px",
        background: "rgba(0,0,0,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: "blur(6px)"
      }}
    >
      <div style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "1px" }}>
        ARTENIA LAB
      </div>

      <nav style={{ display: "flex", gap: "18px", fontSize: "14px" }}>
        <a style={{ opacity: 0.9 }} href="#">Mapa</a>
        <a style={{ opacity: 0.9 }} href="#">Colmena</a>
        <a style={{ opacity: 0.9 }} href="#">Presentación Estratégica</a>
      </nav>
    </header>
  );
}
