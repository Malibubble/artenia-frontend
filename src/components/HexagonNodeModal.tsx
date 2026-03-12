import React from "react";
import "./HexagonNodeModal.css";
import { Artesano } from "./HexagonNode";

type HexagonNodeModalProps = {
  artesano: Artesano;
  onClose: () => void;
};

export default function HexagonNodeModal({
  artesano,
  onClose,
}: HexagonNodeModalProps) {
  const avatarSrc = artesano.avatar || `/avatars/default-artesano.jpg`;

  return (
    <>
      {/* Overlay oscuro */}
      <div className="hexagon-modal__overlay" onClick={onClose} />

      {/* Modal */}
      <div className="hexagon-modal">
        <button
          className="hexagon-modal__close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>

        <div className="hexagon-modal__content">
          {/* Sección avatar */}
          <div className="hexagon-modal__avatar-section">
            <img
              src={avatarSrc}
              alt={artesano.nombre}
              className="hexagon-modal__avatar"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/avatars/default-artesano.jpg";
              }}
            />
            <div className="hexagon-modal__status-badge">
              {artesano.estado === "activo" && (
                <span className="status-active">● Activo</span>
              )}
              {artesano.estado === "riesgo" && (
                <span className="status-risk">⚠ En riesgo</span>
              )}
              {artesano.estado === "historico" && (
                <span className="status-historic">✱ Histórico</span>
              )}
            </div>
          </div>

          {/* Información principal */}
          <div className="hexagon-modal__info">
            <h2 className="hexagon-modal__name">{artesano.nombre}</h2>

            <div className="hexagon-modal__discipline">
              <strong>{artesano.disciplina}</strong>
              {artesano.subdisciplina && (
                <span className="hexagon-modal__subdiscipline">
                  {artesano.subdisciplina}
                </span>
              )}
            </div>

            {artesano.descripcion && (
              <p className="hexagon-modal__description">
                {artesano.descripcion}
              </p>
            )}

            {/* Ubicación */}
            <div className="hexagon-modal__location">
              {artesano.localidad && (
                <div className="location-item">
                  <span className="location-label">📍 Localidad:</span>
                  <span className="location-value">{artesano.localidad}</span>
                </div>
              )}
              {artesano.comarca && (
                <div className="location-item">
                  <span className="location-label">🗺️ Comarca:</span>
                  <span className="location-value">{artesano.comarca}</span>
                </div>
              )}
            </div>

            {/* Conexiones */}
            {(artesano.asociaciones?.length ||
              artesano.ferias?.length ||
              artesano.rutas?.length) && (
              <div className="hexagon-modal__connections">
                {artesano.asociaciones && artesano.asociaciones.length > 0 && (
                  <div className="connection-group">
                    <span className="connection-label">Asociaciones:</span>
                    <div className="connection-tags">
                      {artesano.asociaciones.map((asoc, idx) => (
                        <span key={idx} className="connection-tag">
                          {asoc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {artesano.ferias && artesano.ferias.length > 0 && (
                  <div className="connection-group">
                    <span className="connection-label">Ferias:</span>
                    <div className="connection-tags">
                      {artesano.ferias.map((feria, idx) => (
                        <span key={idx} className="connection-tag">
                          {feria}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {artesano.rutas && artesano.rutas.length > 0 && (
                  <div className="connection-group">
                    <span className="connection-label">Rutas:</span>
                    <div className="connection-tags">
                      {artesano.rutas.map((ruta, idx) => (
                        <span key={idx} className="connection-tag">
                          {ruta}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Botones de acción */}
            <div className="hexagon-modal__actions">
              <button className="hexagon-modal__btn hexagon-modal__btn--primary">
                Ver Taller 360°
              </button>
              <button className="hexagon-modal__btn hexagon-modal__btn--secondary">
                Ficha Completa
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
