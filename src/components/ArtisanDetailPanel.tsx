import React, { useEffect, useRef } from "react";
import styles from "./ArtisanDetailPanel.module.css";
import Badge from "./Badge";

interface Artesano {
  id?: string | number;
  nombre?: string;
  avatar_url?: string;
  disciplina?: string;
  municipio?: string;
  comarca?: string;
  riesgo?: string;
  actividad_digital?: string[];
  actividad_artesanal?: string[];
  tour360_url?: string;
}

interface Props {
  artesano: Artesano;
  onClose: () => void;
  // optional callback to notify parent when mouse enters/leaves the panel
  onHoverChange?: (hovering: boolean) => void;
}

export default function ArtisanDetailPanel({ artesano, onClose, onHoverChange }: Props) {
  const name = artesano.nombre || "No especificado";
  const disciplina = artesano.disciplina || "No especificado";
  const location = [artesano.municipio, artesano.comarca].filter(Boolean).join(" · ") || "No especificado";

  const riesgo = artesano.riesgo || null;

  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    // Focus first focusable element inside the panel (close button or first link)
    const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector));
    const first = focusable[0];
    if (first) first.focus();

    // Keydown handler for Escape and Tab focus trap
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        // Focus trap: keep focus within the panel
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const focused = document.activeElement as HTMLElement | null;
        const currentIndex = focusable.indexOf(focused as HTMLElement);
        if (e.shiftKey) {
          // shift+tab
          if (currentIndex === 0 || focused === panel) {
            e.preventDefault();
            focusable[focusable.length - 1].focus();
          }
        } else {
          // tab
          if (currentIndex === focusable.length - 1) {
            e.preventDefault();
            focusable[0].focus();
          }
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Ficha de ${name}`}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <div className={styles.panel} ref={panelRef}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar panel">
          ×
        </button>

        <div className={styles.headerRow}>
          <div className={styles.avatarWrap}>
            <img
              src={artesano.avatar_url || "/default-avatar.png"}
              alt={name}
              className={styles.avatar}
            />
          </div>

          <div className={styles.titleCol}>
            <h2 className={styles.name}>{name}</h2>
            <div className={styles.discipline}>{disciplina}</div>
            <div className={styles.location}>{location}</div>
            <div className={styles.badgeRow}>
              {riesgo ? (
                <Badge variant={riesgo.toLowerCase() === "alto" ? "warning" : "info"}>{riesgo}</Badge>
              ) : (
                <Badge variant="muted">No especificado</Badge>
              )}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Actividad digital</div>
          <div className={styles.chipsRow}>
            {artesano.actividad_digital && artesano.actividad_digital.length > 0 ? (
              artesano.actividad_digital.map((a, i) => (
                <Badge key={i} variant="info">{a}</Badge>
              ))
            ) : (
              <Badge variant="muted">No especificado</Badge>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Actividad artesanal</div>
          <div className={styles.chipsRow}>
            {artesano.actividad_artesanal && artesano.actividad_artesanal.length > 0 ? (
              artesano.actividad_artesanal.map((a, i) => (
                <Badge key={i} variant="neutral">{a}</Badge>
              ))
            ) : (
              <Badge variant="muted">No especificado</Badge>
            )}
          </div>
        </div>

        <div className={styles.actionsRow}>
          <a className={`${styles.pill} ${styles.primary}`} href={`/artesano/${artesano.id ?? ""}`}>
            Ficha completa
          </a>

          {artesano.tour360_url ? (
            <a className={`${styles.pill} ${styles.secondary}`} href={artesano.tour360_url} target="_blank" rel="noreferrer">
              Ver taller
            </a>
          ) : (
            <button className={`${styles.pill} ${styles.secondary} ${styles.disabled}`} disabled>
              Ver taller
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
