import React from "react";
import { useLocation } from "wouter";
import "./Landing.css";

export default function Landing() {
  const [, setLocation] = useLocation();

  const handleEnterMap = () => {
    setLocation("/mapa");
  };

  return (
    <div className="screen-home">
      {/* Fondo animado con hexágonos sutiles */}
      <div className="screen-home__bg">
        <div className="hexagon-bg hexagon-bg--1"></div>
        <div className="hexagon-bg hexagon-bg--2"></div>
        <div className="hexagon-bg hexagon-bg--3"></div>
        <div className="hexagon-bg hexagon-bg--4"></div>
        <div className="hexagon-bg hexagon-bg--5"></div>
      </div>

      {/* Contenido principal */}
      <div className="screen-home__content">
        {/* Logo */}
        <div className="screen-home__logo">
          <svg
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
            className="artenia-logo"
          >
            {/* Hexágono externo */}
            <polygon
              points="60,10 110,35 110,85 60,110 10,85 10,35"
              fill="none"
              stroke="url(#gradientLogo)"
              strokeWidth="2"
            />
            {/* Hexágono interno */}
            <polygon
              points="60,30 95,50 95,80 60,100 25,80 25,50"
              fill="none"
              stroke="url(#gradientLogoReverse)"
              strokeWidth="1.5"
              opacity="0.6"
            />
            {/* Punto central con glow */}
            <circle cx="60" cy="60" r="8" fill="#41e1ff" opacity="0.8" />
            <circle
              cx="60"
              cy="60"
              r="8"
              fill="none"
              stroke="#41e1ff"
              strokeWidth="1.5"
              opacity="0.4"
            />
            {/* Defs para gradientes */}
            <defs>
              <linearGradient id="gradientLogo" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#41e1ff" />
                <stop offset="100%" stopColor="#ffb468" />
              </linearGradient>
              <linearGradient id="gradientLogoReverse" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ffb468" />
                <stop offset="100%" stopColor="#41e1ff" />
              </linearGradient>
            </defs>
          </svg>
          <div className="artenia-text">ARTENIA</div>
        </div>

        {/* Claim principal */}
        <h1 className="screen-home__title">
          El ecosistema vivo de los oficios del Mediterráneo
        </h1>

        {/* Subtítulo poético */}
        <p className="screen-home__subtitle">
          Un mapa que respira. Un territorio que se ilumina. Un conocimiento que perdura.
        </p>

        {/* Descripción adicional */}
        <p className="screen-home__description">
          Descubre la red de artesanos, asociaciones, instituciones y patrocinadores que mantienen viva
          la tradición del Mediterráneo. Una plataforma colaborativa para conocer, conectar y potenciar
          los oficios ancestrales.
        </p>

        {/* CTA Principal */}
        <button
          className="screen-home__btn screen-home__btn--primary"
          onClick={handleEnterMap}
        >
          <span>Entrar al Mapa</span>
          <span className="btn-icon">→</span>
        </button>

        {/* CTAs secundarios */}
        <div className="screen-home__secondary-actions">
          <button className="screen-home__btn screen-home__btn--secondary">
            Conocer más
          </button>
          <button className="screen-home__btn screen-home__btn--secondary">
            Contacto
          </button>
        </div>
      </div>

      {/* Indicador scroll */}
      <div className="screen-home__scroll-hint">
        <div className="scroll-indicator">
          <div className="scroll-dot"></div>
        </div>
        <span>Desplázate para descubrir</span>
      </div>
    </div>
  );
}
