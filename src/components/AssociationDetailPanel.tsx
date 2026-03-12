import React from "react";
import {
  X,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Calendar,
  Link2,
  Info,
} from "lucide-react";

export type EventoAsociacion = {
  nombre: string;
  tipo?: string;
  descripcion?: string;
  fecha_inicio?: string; // ISO
  fecha_fin?: string;    // ISO
  recurrencia?: string;  // anual, mensual, único...
  lugar?: string;
};

export type ConexionInstitucion = {
  institucion: string;
  tipo?: string; // colaboración, coorganizacion, federada...
  peso?: number; // 0–1
};

export type ArtesanoResumen = {
  id: string;
  nombre: string;
  oficio?: string;
  municipio?: string;
  tipo_vinculo?: string; // socio, feria, colaborador...
  peso?: number;
};

export type AsociacionDetail = {
  id: string;
  nombre: string;
  siglas?: string;
  descripcion?: string;
  tipo_asociacion?: string;
  ambito?: string;
  actividad_actual?: "alta" | "media" | "baja" | "inactiva" | "en_reactivacion" | string;
  direccion?: string;
  municipio?: string;
  comarca?: string;
  telefono?: string;
  email?: string;
  web?: string;
  numero_miembros?: number;
  potencial_de_impacto?: number; // 1–5
  riesgo_desaparicion?: "bajo" | "medio" | "alto" | string | null;
  eventos_programados?: EventoAsociacion[];
  conexiones_instituciones?: ConexionInstitucion[];
  artesanos_conectados?: ArtesanoResumen[];
  notas?: string;
};

interface AssociationDetailPanelProps {
  association: AsociacionDetail | null;
  onClose: () => void;
  onFocusOnMap?: (associationId: string) => void;
  onOpenRouteWithArtisans?: (associationId: string) => void;
  onOpenArtisan?: (artesanoId: string) => void;
}

function getActividadBadgeColor(actividad?: string) {
  switch (actividad) {
    case "alta":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/40";
    case "media":
      return "bg-amber-500/15 text-amber-300 border-amber-500/40";
    case "baja":
    case "en_reactivacion":
      return "bg-orange-500/15 text-orange-300 border-orange-500/40";
    case "inactiva":
      return "bg-slate-500/15 text-slate-300 border-slate-500/40";
    default:
      return "bg-slate-500/10 text-slate-200 border-slate-500/20";
  }
}

function getRiesgoChipColor(riesgo?: string | null) {
  switch (riesgo) {
    case "alto":
      return "bg-red-500/15 text-red-300 border-red-500/40";
    case "medio":
      return "bg-amber-500/15 text-amber-300 border-amber-500/40";
    case "bajo":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/40";
    default:
      return "bg-slate-500/10 text-slate-200 border-slate-500/20";
  }
}

const formatFecha = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString();
};

export const AssociationDetailPanel: React.FC<AssociationDetailPanelProps> = ({
  association,
  onClose,
  onFocusOnMap,
  onOpenRouteWithArtisans,
  onOpenArtisan,
}) => {
  if (!association) return null;

  const {
    id,
    nombre,
    siglas,
    descripcion,
    tipo_asociacion,
    ambito,
    actividad_actual,
    direccion,
    municipio,
    comarca,
    telefono,
    email,
    web,
    numero_miembros,
    potencial_de_impacto,
    riesgo_desaparicion,
    eventos_programados = [],
    conexiones_instituciones = [],
    artesanos_conectados = [],
    notas,
  } = association;

  return (
    <aside
      className="relative w-full max-w-md h-full bg-slate-950/95 border-l border-sky-500/20 shadow-2xl shadow-sky-900/40
                 backdrop-blur-xl flex flex-col"
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-sky-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-semibold text-sky-100 leading-snug">
              {nombre}
            </h2>
            {siglas && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide
                               bg-sky-500/15 text-sky-200 border border-sky-400/40">
                {siglas}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            {tipo_asociacion && (
              <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-100 border border-slate-600/70">
                {tipo_asociacion.replace(/_/g, " ")}
              </span>
            )}
            {ambito && (
              <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-sky-100 border border-sky-500/40">
                Ámbito: {ambito}
              </span>
            )}
            {actividad_actual && (
              <span
                className={
                  "px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wide " +
                  getActividadBadgeColor(actividad_actual)
                }
              >
                Actividad {actividad_actual}
              </span>
            )}
            {riesgo_desaparicion && (
              <span
                className={
                  "px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wide " +
                  getRiesgoChipColor(riesgo_desaparicion)
                }
              >
                Riesgo {riesgo_desaparicion}
              </span>
            )}
          </div>

          {descripcion && (
            <p className="text-xs text-slate-200/80 max-w-xl leading-snug">
              {descripcion}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full
                     bg-slate-900/80 border border-slate-700/70 text-slate-300
                     hover:bg-slate-800 hover:text-sky-100 hover:border-sky-500/60
                     transition-colors"
          aria-label="Cerrar ficha de asociación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* CONTENIDO SCROLL */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 pt-2 space-y-4">
        {/* CONTACTO & LOCALIZACIÓN */}
        <section className="rounded-2xl border border-sky-500/20 bg-slate-950/60 p-3.5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-semibold text-sky-100 uppercase tracking-wide flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-sky-300" />
              Localización y contacto
            </h3>
            {(municipio || comarca) && (
              <span className="text-[11px] text-slate-300">
                {municipio && <span>{municipio}</span>}
                {municipio && comarca && <span> · </span>}
                {comarca && <span>{comarca}</span>}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            {/* Datos */}
            <div className="space-y-1.5">
              {direccion && (
                <div className="flex gap-2">
                  <span className="mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-300" />
                  </span>
                  <span className="text-slate-100 leading-snug">
                    {direccion}
                  </span>
                </div>
              )}
              {telefono && (
                <div className="flex gap-2">
                  <span className="mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-sky-300" />
                  </span>
                  <a
                    href={`tel:${telefono.replace(/\s/g, "")}`}
                    className="text-sky-200 hover:text-sky-100 underline-offset-2 hover:underline"
                  >
                    {telefono}
                  </a>
                </div>
              )}
              {email && (
                <div className="flex gap-2">
                  <span className="mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-sky-300" />
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className="text-sky-200 hover:text-sky-100 underline-offset-2 hover:underline break-all"
                  >
                    {email}
                  </a>
                </div>
              )}
              {web && (
                <div className="flex gap-2">
                  <span className="mt-0.5">
                    <Globe className="w-3.5 h-3.5 text-sky-300" />
                  </span>
                  <a
                    href={web}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-200 hover:text-sky-100 underline-offset-2 hover:underline break-all"
                  >
                    {web}
                  </a>
                </div>
              )}
              {numero_miembros != null && (
                <div className="flex gap-2">
                  <span className="mt-0.5">
                    <Users className="w-3.5 h-3.5 text-sky-300" />
                  </span>
                  <span className="text-slate-100">
                    {numero_miembros} miembros estimados
                  </span>
                </div>
              )}
            </div>

            {/* Mini mapa / acciones de mapa */}
            <div className="flex flex-col gap-2">
              <div className="relative h-24 rounded-xl border border-sky-500/25 bg-gradient-to-br
                              from-slate-900/80 via-slate-950/95 to-sky-950/50 overflow-hidden">
                {/* Aquí puedes meter un mini canvas/mapa real más adelante */}
                <div className="absolute inset-0 opacity-70">
                  <div className="w-full h-full bg-[radial-gradient(circle_at_10%_0%,#1e293b_0,#020617_60%)]" />
                </div>
                <div className="relative z-10 flex flex-col h-full items-start justify-between p-2.5 text-[11px]">
                  <div className="space-y-0.5">
                    <div className="inline-flex items-center gap-1.5 rounded-full
                                    bg-black/30 px-2 py-0.5 border border-sky-500/30 text-sky-100">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[10rem]">
                        {municipio || "Nodo sin municipio"}
                      </span>
                    </div>
                    {comarca && (
                      <div className="text-slate-200/80">
                        {comarca}
                      </div>
                    )}
                  </div>
                  {onFocusOnMap && (
                    <button
                      onClick={() => onFocusOnMap(id)}
                      className="inline-flex items-center gap-1.5 self-end text-[11px]
                                 px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-100 border border-sky-400/60
                                 hover:bg-sky-500/30 transition-colors"
                    >
                      <MapPin className="w-3 h-3" />
                      Ver en mapa
                    </button>
                  )}
                </div>
              </div>
              {potencial_de_impacto != null && (
                <div className="flex items-center justify-between text-[11px] text-slate-200">
                  <span>Potencial de impacto</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={
                          "w-2.5 h-1 rounded-full " +
                          (i < (potencial_de_impacto || 0)
                            ? "bg-sky-400"
                            : "bg-slate-600")
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CONEXIONES CON ARTESANOS */}
        <section className="rounded-2xl border border-sky-500/20 bg-slate-950/60 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-semibold text-sky-100 uppercase tracking-wide flex items-center gap-2">
              <Link2 className="w-3.5 h-3.5 text-sky-300" />
              Conexiones con artesanos
            </h3>
            <span className="text-[11px] text-slate-300">
              {artesanos_conectados.length} artesanos conectados
            </span>
          </div>

          {artesanos_conectados.length === 0 ? (
            <p className="text-[11px] text-slate-400 italic">
              Todavía no hay artesanos vinculados en Artenia. Este nodo está listo para tejer red.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {artesanos_conectados.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => onOpenArtisan && onOpenArtisan(a.id)}
                  className="w-full text-left rounded-xl border border-slate-700/80 bg-slate-950/60
                             px-2.5 py-1.5 text-[11px] flex items-center justify-between gap-2
                             hover:border-sky-500/60 hover:bg-slate-900/80 transition-colors group"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-slate-50 font-medium truncate">
                      {a.nombre}
                    </span>
                    <span className="text-slate-300">
                      {a.oficio || "Oficio sin especificar"}
                      {a.municipio && ` · ${a.municipio}`}
                    </span>
                    {a.tipo_vinculo && (
                      <span className="text-[10px] text-sky-200">
                        Vínculo: {a.tipo_vinculo}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {a.peso != null && (
                      <span className="text-[10px] text-sky-300">
                        {Math.round(a.peso * 100)}%
                      </span>
                    )}
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full
                                     border border-sky-500/50 text-sky-200 group-hover:bg-sky-500/20">
                      <Link2 className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {onOpenRouteWithArtisans && artesanos_conectados.length > 0 && (
            <button
              onClick={() => onOpenRouteWithArtisans(id)}
              className="mt-1 inline-flex items-center justify:center w-full text-[11px]
                         px-2.5 py-1.5 rounded-xl border border-sky-500/50 text-sky-100
                         bg-sky-500/15 hover:bg-sky-500/25 transition-colors"
            >
              <Link2 className="w-3 h-3 mr-1.5" />
              Ver ruta con sus artesanos
            </button>
          )}
        </section>

        {/* EVENTOS Y ACTIVIDAD */}
        <section className="rounded-2xl border border-sky-500/20 bg-slate-950/60 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xs font-semibold text-sky-100 uppercase tracking-wide flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-sky-300" />
              Eventos y actividad
            </h3>
            <span className="text-[11px] text-slate-300">
              {eventos_programados.length} eventos
            </span>
          </div>

          {eventos_programados.length === 0 ? (
            <p className="text-[11px] text-slate-400 italic">
              No hay eventos registrados todavía. Perfecto para empezar a documentar ferias, talleres y muestras.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {eventos_programados.map((e, idx) => (
                <div
                  key={`${e.nombre}-${idx}`}
                  className="rounded-xl border border-slate-700/80 bg-slate-950/60 px-2.5 py-1.5 text-[11px]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-50 font-medium">
                      {e.nombre}
                    </span>
                    {e.tipo && (
                      <span className="px-1.5 py-0.5 rounded-full bg-slate-800/80 text-slate-100 border border-slate-600/70">
                        {e.tipo}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5 text-slate-300">
                    {(e.fecha_inicio || e.fecha_fin) && (
                      <span>
                        {e.fecha_inicio && formatFecha(e.fecha_inicio)}
                        {e.fecha_fin &&
                          ` – ${formatFecha(e.fecha_fin)}`}
                      </span>
                    )}
                    {e.recurrencia && (
                      <span className="text-sky-200">
                        · {e.recurrencia}
                      </span>
                    )}
                    {e.lugar && (
                      <span className="text-slate-300">
                        · {e.lugar}
                      </span>
                    )}
                  </div>
                  {e.descripcion && (
                    <p className="mt-0.5 text-slate-200/80 leading-snug">
                      {e.descripcion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CURIOSIDADES / NOTAS */}
        {(notas || conexiones_instituciones.length > 0) && (
          <section className="rounded-2xl border border-sky-500/20 bg-slate-950/60 p-3.5 space-y-2.5">
            <h3 className="text-xs font-semibold text-sky-100 uppercase tracking-wide flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-sky-300" />
              Contexto y alianzas
            </h3>

            {notas && (
              <p className="text-[11px] text-slate-200 leading-snug">
                {notas}
              </p>
            )}

            {conexiones_instituciones.length > 0 && (
              <div className="space-y-1">
                {conexiones_instituciones.map((c, idx) => (
                  <div
                    key={`${c.institucion}-${idx}`}
                    className="text-[11px] text-slate-200 flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400/80" />
                    <span className="font-medium">
                      {c.institucion}
                    </span>
                    {c.tipo && (
                      <span className="text-sky-200">
                        · {c.tipo}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </aside>
  );
};
