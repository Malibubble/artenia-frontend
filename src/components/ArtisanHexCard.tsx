import React from "react";
import "./ArtisanHexCard.css";

type ArtisanHexCardProps = {
  nombre: string;
  oficio: string;
  localidad: string;
};

export default function ArtisanHexCard({
  nombre,
  oficio,
  localidad,
}: ArtisanHexCardProps) {
  return (
    <div className="hex-screen">
      <div className="hex-card">
        <div className="hex-border" />
        <div className="hex-content">
          <p className="hex-eyebrow">{localidad}</p>
          <h1 className="hex-title">{nombre}</h1>
          <p className="hex-subtitle">{oficio}</p>
        </div>
      </div>
    </div>
  );
}
