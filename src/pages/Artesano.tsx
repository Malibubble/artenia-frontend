import { useEffect, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink, MapPin, Globe2, Phone, Compass, Sparkles } from "lucide-react";

type ArtesanoRecord = {
  id: number;
  nombre: string;
  disciplina?: string | null;
  oficio?: string | null;
  subcategoria?: string | null;
  imagen?: string | null;
  galeria?: string[] | null;
  municipio?: string | null;
  descripcion?: string | null;
  actividad_digital?: string | null;
  actividad_artesanal?: string | null;
  riesgo_desaparicion?: string | null;
  antiguedad_anos?: number | null;
  web?: string | null;
  instagram?: string | null;
  telefono?: string | null;
  ficha_url?: string | null;
  avatar_url?: string | null;
  tour360_url?: string | null;
  asociaciones_vinculadas?: string[] | string | null;
  ferias_vinculadas?: string[] | string | null;
};

const env = (import.meta as any).env as {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
};

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const TABLE_NAME = "artesanos_lab";

type Props = {
  params: {
    id: string;
  };
};

export default function Artesano({ params }: Props) {
  const [data, setData] = useState<ArtesanoRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError("No se ha configurado Supabase.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const { data: record, error: err } = await supabase
        .from(TABLE_NAME)
        .select(
          [
            "id",
            "nombre",
            "disciplina",
            "oficio",
            "subcategoria",
            "municipio",
            "descripcion",
            "imagen",
            "galeria",
            "actividad_digital",
            "actividad_artesanal",
            "riesgo_desaparicion",
            "antiguedad_anos",
            "web",
            "instagram",
            "telefono",
            "ficha_url",
            "avatar_url",
            "tour360_url",
            "asociaciones_vinculadas",
            "ferias_vinculadas",
          ].join(",")
        )
        .eq("id", Number(params.id))
        .single();

      if (err) {
        setError("No pudimos cargar esta ficha.");
        setLoading(false);
        return;
      }

      setData(record as ArtesanoRecord);
      setLoading(false);
    };

    fetchData();
  }, [params.id]);

  const accent = "#22d3ee";
  const bgImage =
    data?.avatar_url && data.avatar_url.trim() !== ""
      ? `linear-gradient(180deg, rgba(5,10,17,0.4) 0%, rgba(5,10,17,0.8) 60%), url(${data.avatar_url})`
      : "radial-gradient(circle at 20% 20%, rgba(34,211,238,0.2), rgba(5,8,20,0.95))";

  return (
    <div className="artesano-shell">
      <div className="artesano-hero" style={{ backgroundImage: bgImage }}>
        <div className="artesano-hero-overlay" />
        <div className="artesano-hero-inner">
          <div className="artesano-hero-top">
            <Link href="/mapa" className="artesano-back">
              <ArrowLeft size={18} />
              Volver al mapa
            </Link>
          </div>

          <div className="artesano-hero-body">
            <div className="artesano-hero-meta">
              <span className="eyebrow">Artenia · Ficha viva</span>
              <h1 className="artesano-title">{data?.nombre || "Artesano"}</h1>
              <p className="artesano-subtitle">
                {data?.disciplina || data?.oficio || "Oficio por confirmar"}
              </p>
              <div className="artesano-chips">
                {data?.municipio && (
                  <span className="artesano-chip">
                    <MapPin size={14} />
                    {data.municipio}
                  </span>
                )}
                {data?.riesgo_desaparicion && (
                  <span className="artesano-chip">
                    <Sparkles size={14} />
                    Riesgo: {data.riesgo_desaparicion}
                  </span>
                )}
                {data?.antiguedad_anos != null && (
                  <span className="artesano-chip">
                    Antigüedad: {data.antiguedad_anos} años
                  </span>
                )}
              </div>
            </div>
            {data?.avatar_url && (
              <div className="artesano-hero-photo">
                <img src={data.avatar_url} alt={data.nombre} loading="lazy" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="artesano-content">
        {loading && <div className="artesano-card">Cargando ficha…</div>}
        {error && <div className="artesano-card error">{error}</div>}

        {data && (
          <div className="artesano-grid">
            <div className="artesano-card">
              <p className="eyebrow">Relato</p>
              <p className="artesano-lede">
                {data.descripcion ||
                  "Esta ficha está en proceso de documentación dentro de Artenia Lab."}
              </p>
            </div>

            {(data.imagen || (data.galeria && data.galeria.length > 0)) && (
              <div className="artesano-card">
                <p className="eyebrow">Imágenes</p>
                <div className="artesano-gallery">
                  {data.imagen && (
                    <div className="artesano-gallery-item featured">
                      <img src={data.imagen} alt={data.nombre} loading="lazy" />
                    </div>
                  )}
                  {data.galeria?.map((url, idx) => (
                    <div className="artesano-gallery-item" key={`${url}-${idx}`}>
                      <img src={url} alt={`${data.nombre} ${idx + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="artesano-card">
              <p className="eyebrow">Ficha técnica</p>
              <div className="artesano-meta-grid">
                <div>
                  <div className="artesano-meta-label">Oficio</div>
                  <div className="artesano-meta-value">
                    {data.oficio || data.disciplina || "—"}
                  </div>
                </div>
                <div>
                  <div className="artesano-meta-label">Subcategoría</div>
                  <div className="artesano-meta-value">
                    {data.subcategoria || "—"}
                  </div>
                </div>
                <div>
                  <div className="artesano-meta-label">Actividad digital</div>
                  <div className="artesano-meta-value">
                    {data.actividad_digital || "—"}
                  </div>
                </div>
                <div>
                  <div className="artesano-meta-label">Actividad artesanal</div>
                  <div className="artesano-meta-value">
                    {data.actividad_artesanal || "—"}
                  </div>
                </div>
                <div>
                  <div className="artesano-meta-label">Riesgo</div>
                  <div className="artesano-meta-value">
                    {data.riesgo_desaparicion || "—"}
                  </div>
                </div>
                <div>
                  <div className="artesano-meta-label">Antigüedad</div>
                  <div className="artesano-meta-value">
                    {data.antiguedad_anos != null
                      ? `${data.antiguedad_anos} años`
                      : "—"}
                  </div>
                </div>
              </div>
            </div>

            <div className="artesano-card">
              <p className="eyebrow">Conexiones</p>
              <div className="artesano-actions">
                {data.web && (
                  <a
                    className="artesano-action-btn"
                    href={data.web}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Globe2 size={16} />
                    Web
                    <ExternalLink size={14} />
                  </a>
                )}
                {data.instagram && (
                  <a
                    className="artesano-action-btn"
                    href={data.instagram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    @ Instagram
                    <ExternalLink size={14} />
                  </a>
                )}
                {data.telefono && (
                  <a className="artesano-action-btn" href={`tel:${data.telefono}`}>
                    <Phone size={16} />
                    {data.telefono}
                  </a>
                )}
                {data.tour360_url && (
                  <a
                    className="artesano-action-btn"
                    href={data.tour360_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Compass size={16} />
                    Tour 360°
                  </a>
                )}
                {data.ficha_url && (
                  <a
                    className="artesano-action-btn"
                    href={data.ficha_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Dossier
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>

            {(data.asociaciones_vinculadas || data.ferias_vinculadas) && (
              <div className="artesano-card">
                <p className="eyebrow">Redes y ferias</p>
                <div className="artesano-tag-grid">
                  {toList(data.asociaciones_vinculadas).map((item) => (
                    <span className="artesano-tag" key={`assoc-${item}`}>
                      Asociado: {item}
                    </span>
                  ))}
                  {toList(data.ferias_vinculadas).map((item) => (
                    <span className="artesano-tag" key={`feria-${item}`}>
                      Feria: {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function toList(value: string[] | string | null | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return value
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
