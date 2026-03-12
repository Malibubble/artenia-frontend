import React from "react";
import {
  X,
  MapPin,
  Clock,
  Calendar,
  Globe,
  Phone,
  Mail,
  Users,
  Link2,
  Info,
  Map as MapIcon,
  Image as ImageIcon,
} from "lucide-react";

export type NodeRole = "artesano" | "asociacion" | "institucion" | "patrocinador";

export type PresenciaDigital = {
  web?: boolean;
  redes?: boolean;
  googleBusiness?: boolean;
  tiendaOnline?: boolean;
};

export type NodeTag = {
  label: string;
  variant?: "primary" | "secondary" | "danger" | "neutral";
};

export type NodeConnection = {
  id: string;
  nombre: string;
  tipo?: string;
  descripcion?: string;
};

export type NodeDetail = {
  id: string;
  role: NodeRole;
  nombre: string;
  subtitulo?: string;
  imagenUrl?: string;
  avatarHexColor?: string;
  etiquetas?: NodeTag[];
  descripcion?: string;
  ubicacion?: string;
  horario?: string;
  fundacion?: string;
  visitable?: boolean;
  tecnicas?: string[];
  productos?: string[];
  presenciaDigital?: PresenciaDigital;
  conexiones?: NodeConnection[];
  telefono?: string;
  email?: string;
  web?: string;
};

interface NodeDetailModalProps {
  node: NodeDetail | null;
  onClose: () => void;
  onOpenOnMap?: (id: string) => void;
  onOpenConnection?: (connectionId: string, tipo?: string) => void;
}

const tagVariantClasses: Record<NonNullable<NodeTag["variant"]>, string> = {
  primary: "bg-teal-500/15 text-teal-200 border-teal-400/60",
  secondary: "bg-sky-500/15 text-sky-100 border-sky-400/60",
  danger: "bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-400/60",
  neutral: "bg-slate-700/60 text-slate-100 border-slate-500/60",
};

const PresenciaBadge: React.FC<{ active?: boolean; label: string }> = ({
  active,
  label,
}) => (
  <span
    className={
      "px-3 py-1 rounded-full text-[11px] border " +
      (active
        ? "bg-teal-500/15 text-teal-100 border-teal-400/70"
        : "bg-slate-900/80 text-slate-400 border-slate-700/80")
    }
  >
    {label}
  </span>
);

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  node,
  onClose,
  onOpenOnMap,
  onOpenConnection,
}) => {
  if (!node) return null;

  const {
    id,
    role,
    nombre,
    subtitulo,
    imagenUrl,
    avatarHexColor = "#14b8a6",
    etiquetas = [],
    descripcion,
    ubicacion,
    horario,
    fundacion,
    visitable,
    tecnicas = [],
    productos = [],
    presenciaDigital,
    conexiones = [],
    telefono,
    email,
    web,
  } = node;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl">
      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 my-6 rounded-3xl border border-teal-500/40 bg-slate-950 shadow-[0_0_60px_rgba(20,184,166,0.35)] overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-4 px-8 pt-6 pb-4 border-b border-teal-500/25">
          {/* Avatar / Imagen con marco hexagonal */}
          <div className="relative shrink-0">
            <div
              className="w-20 h-20 grid place-items-center rounded-2xl border-2 shadow-inner"
              style={{
                borderColor: avatarHexColor,
                boxShadow: `0 0 24px ${avatarHexColor}55`,
                background:
                  "radial-gradient(circle at 30% 0%, #0f172a 0%, #020617 55%)",
              }}
            >
              {imagenUrl ? (
                <img
                  src={imagenUrl}
                  alt={nombre}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-teal-300" />
              )}
            </div>
          </div>

          {/* Título + etiquetas */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <h2 className="text-2xl font-semibold text-slate-50 truncate">
                  {nombre}
                </h2>
                {subtitulo && (
                  <p className="text-sm text-slate-300 truncate">{subtitulo}</p>
                )}
              </div>

              <button
                onClick={onClose}
                className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full
                           bg-slate-900/80 border border-slate-700/80 text-slate-300
                           hover:bg-slate-800 hover:text-slate-50 hover:border-teal-400/70
                           transition-colors"
                aria-label="Cerrar ficha"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* etiquetas */}
            {etiquetas.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {etiquetas.map((tag, idx) => (
                  <span
                    key={`${tag.label}-${idx}`}
                    className={
                      "px-2.5 py-0.5 rounded-full text-[11px] border uppercase tracking-wide " +
                      tagVariantClasses[tag.variant ?? "secondary"]
                    }
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="px-8 pb-6 pt-4 space-y-6 text-sm text-slate-100">
          {/* Descripción */}
          {descripcion && (
            <section>
              <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wide text-teal-300 uppercase mb-1.5">
                <Info className="w-3.5 h-3.5" />
                Descripción
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                {descripcion}
              </p>
            </section>
          )}

          {/* Datos básicos */}
          {(ubicacion || horario || fundacion || visitable !== undefined) && (
            <section>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4 text-xs">
                {ubicacion && (
                  <div>
                    <div className="flex items-center gap-1.5 text-teal-300 mb-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="font-semibold uppercase tracking-wide">
                        Ubicación
                      </span>
                    </div>
                    <p className="text-slate-200">{ubicacion}</p>
                  </div>
                )}
                {horario && (
                  <div>
                    <div className="flex items-center gap-1.5 text-teal-300 mb-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-semibold uppercase tracking-wide">
                        Horario
                      </span>
                    </div>
                    <p className="text-slate-200">{horario}</p>
                  </div>
                )}
                {fundacion && (
                  <div>
                    <div className="flex items-center gap-1.5 text-teal-300 mb-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="font-semibold uppercase tracking-wide">
                        Fundación
                      </span>
                    </div>
                    <p className="text-slate-200">{fundacion}</p>
                  </div>
                )}
                {visitable !== undefined && (
                  <div>
                    <div className="flex items-center gap-1.5 text-teal-300 mb-0.5">
                      <Users className="w-3.5 h-3.5" />
                      <span className="font-semibold uppercase tracking-wide">
                        Visitable
                      </span>
                    </div>
                    <p
                      className={
                        "font-medium " +
                        (visitable ? "text-teal-200" : "text-slate-300")
                      }
                    >
                      {visitable ? "Sí, con cita" : "No visitable"}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Técnicas / Productos */}
          {(tecnicas.length > 0 || productos.length > 0) && (
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {tecnicas.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold tracking-wide text-teal-300 uppercase mb-1.5">
                    Técnicas
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {tecnicas.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-600/80 text-[11px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {productos.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold tracking-wide text-teal-300 uppercase mb-1.5">
                    Productos
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {productos.map((p) => (
                      <span
                        key={p}
                        className="px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-600/80 text-[11px]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Presencia digital */}
          {presenciaDigital && (
            <section>
              <h3 className="text-xs font-semibold tracking-wide text-teal-300 uppercase mb-1.5">
                Presencia digital
              </h3>
              <div className="flex flex-wrap gap-2">
                <PresenciaBadge
                  active={presenciaDigital.web}
                  label="Web propia"
                />
                <PresenciaBadge
                  active={presenciaDigital.redes}
                  label="Redes sociales"
                />
                <PresenciaBadge
                  active={presenciaDigital.googleBusiness}
                  label="Google Business"
                />
                <PresenciaBadge
                  active={presenciaDigital.tiendaOnline}
                  label="Tienda online"
                />
              </div>
            </section>
          )}

          {/* Conexiones */}
          {conexiones.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wide text-teal-300 uppercase">
                  <Link2 className="w-3.5 h-3.5" />
                  Conexiones
                </h3>
                <span className="text-[11px] text-slate-400">
                  {conexiones.length} nodos conectados
                </span>
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {conexiones.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() =>
                      onOpenConnection && onOpenConnection(c.id, c.tipo)
                    }
                    className="w-full text-left px-2.5 py-1.5 rounded-xl border border-slate-700/80 bg-slate-950/80
                               hover:border-teal-400/70 hover:bg-slate-900/80 transition-colors flex items-center justify-between gap-2 group text-[11px]"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-slate-50 font-medium">
                        {c.nombre}
                      </span>
                      <span className="text-slate-300">
                        {c.tipo && <>{c.tipo}</>}{" "}
                        {c.descripcion && (
                          <span className="text-slate-400">
                            · {c.descripcion}
                          </span>
                        )}
                      </span>
                    </div>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-teal-400/60 text-teal-200 group-hover:bg-teal-500/20">
                      <Link2 className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Contacto + botones inferiores */}
          {(telefono || email || web || onOpenOnMap) && (
            <section className="pt-2 border-t border-slate-800/80">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-4 text-xs text-slate-200">
                  {telefono && (
                    <a
                      href={`tel:${telefono.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-1.5 hover:text-teal-200"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {telefono}
                    </a>
                  )}
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-1.5 hover:text-teal-200"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {email}
                    </a>
                  )}
                  {web && (
                    <a
                      href={web}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 hover:text-teal-200"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Web
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {onOpenOnMap && (
                    <button
                      onClick={() => onOpenOnMap(id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs
                                 bg-slate-900 border border-teal-500/70 text-teal-100
                                 hover:bg-teal-500 hover:text-slate-950 transition-colors"
                    >
                      <MapIcon className="w-3.5 h-3.5" />
                      Ver en el mapa
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs
                               bg-teal-500 text-slate-950 font-medium hover:bg-teal-400 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
