import React from "react";

export default function StatsPanel({ total }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "85px",
        left: "320px",
        background: "rgba(0,0,0,0.75)",
        color: "#fff",
        padding: "12px 18px",
        borderRadius: "10px",
        fontSize: "15px",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(4px)"
      }}
    >
      <strong style={{ fontSize: "22px", display: "block", marginBottom: "4px" }}>
        {total}
      </strong>
      Talleres activos
    </div>
  );
}
