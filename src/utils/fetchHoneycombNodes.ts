import { supabase } from "../supabase/client";
import type { HoneycombNode, HoneycombRole } from "../components/Honeycomb";

type ArtesanoRow = {
  id: number | string;
  nombre: string | null;
  oficio?: string | null;
  municipio?: string | null;
  comarca?: string | null;
};

type AsociacionRow = {
  id: number | string;
  nombre: string | null;
  municipio?: string | null;
  comarca?: string | null;
  publico?: boolean | null;
};

type InstitucionRow = {
  id: number | string;
  nombre: string | null;
  municipio?: string | null;
  comarca?: string | null;
  publico?: boolean | null;
};

type PatrocinadorRow = {
  id: number | string;
  nombre: string | null;
  tipo?: string | null;
  publico?: boolean | null;
};

const MAX_NODES = 72;
const env = import.meta.env as { VITE_SUPABASE_URL?: string; VITE_SUPABASE_ANON_KEY?: string };
const hasSupabaseEnv = Boolean(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY);

const FALLBACK_NODES: HoneycombNode[] = [
  {
    id: "art-1",
    name: "Rosa Ruiz",
    subtitle: "Encaje de bolillos",
    location: "Valle del Jerte",
    role: "artesano",
    x: 0,
    y: 0,
    isBreathing: true,
    description: "Maestra encajera que enseña y preserva puntillas tradicionales.",
    tags: ["Encaje", "Transmisión"],
    connections: ["Instituto Artesanía", "Fondo Horizonte"],
  },
  {
    id: "asoc-1",
    name: "Asociación Oficios Vivos",
    subtitle: "Red de artesanos comarcales",
    location: "Las Hurdes",
    role: "asociacion",
    x: -140,
    y: 90,
    description: "Coordina talleres, ferias y mentorías entre artesanos vecinos.",
    tags: ["Mentoría", "Ferias"],
    connections: ["Rosa Ruiz", "Instituto Artesanía"],
  },
  {
    id: "inst-1",
    name: "Instituto Artesanía",
    subtitle: "Programa de becas y transmisión",
    location: "Madrid",
    role: "institucion",
    x: 140,
    y: 40,
    description: "Becas, residencias y digitalización para talleres rurales.",
    tags: ["Becas", "Digitalización"],
    connections: ["Asociación Oficios Vivos", "Taller Mudéjar"],
  },
  {
    id: "pat-1",
    name: "Fondo Horizonte",
    subtitle: "Patrocinio cultural",
    location: "Bilbao",
    role: "patrocinador",
    x: 0,
    y: 160,
    isBreathing: true,
    description: "Capital paciente para restauraciones y nuevas rutas de oficio.",
    tags: ["Impacto", "Restauración"],
    connections: ["Rosa Ruiz", "Instituto Artesanía"],
  },
  {
    id: "art-2",
    name: "Taller Mudéjar",
    subtitle: "Yesería y azulejo",
    location: "Toledo",
    role: "artesano",
    x: 140,
    y: -80,
    isBreathing: true,
    description: "Recupera piezas arquitectónicas con técnicas mudéjares.",
    tags: ["Yeso", "Azulejo"],
    connections: ["Fondo Horizonte", "Instituto Artesanía"],
  },
  {
    id: "asoc-2",
    name: "Colectivo Textil Vega",
    subtitle: "Laboratorio colaborativo",
    location: "Cuenca",
    role: "asociacion",
    x: -60,
    y: -150,
    description: "Agrupa telares manuales y conecta con diseñadores locales.",
    tags: ["Co-diseño", "Textil"],
    connections: ["Taller Mudéjar", "Consejería de Cultura"],
  },
  {
    id: "inst-2",
    name: "Consejería de Cultura",
    subtitle: "Apoyo institucional",
    location: "Mérida",
    role: "institucion",
    x: -200,
    y: 10,
    description: "Financia museografía y rutas demostrativas por comarcas.",
    tags: ["Museografía", "Rutas"],
    connections: ["Colectivo Textil Vega", "Asociación Oficios Vivos"],
  },
  {
    id: "pat-2",
    name: "Fundación Ámbar",
    subtitle: "Patrocinio de residencias",
    location: "Barcelona",
    role: "patrocinador",
    x: 200,
    y: -10,
    description: "Beca residencias de aprendizaje y compra primeras colecciones.",
    tags: ["Residencias", "Coleccionismo"],
    connections: ["Rosa Ruiz", "Colectivo Textil Vega"],
  },
];

const applyHexPositions = (nodes: HoneycombNode[]): HoneycombNode[] => {
  if (!nodes.length) return nodes;

  const cols = Math.max(6, Math.ceil(Math.sqrt(nodes.length)));
  const rows = Math.ceil(nodes.length / cols);
  const spacingX = 140;
  const spacingY = 120;
  const startX = -((cols - 1) * spacingX) / 2;
  const startY = -((rows - 1) * spacingY) / 2;

  return nodes.map((node, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const offset = row % 2 === 0 ? 0 : spacingX / 2;

    return {
      ...node,
      x: startX + col * spacingX + offset,
      y: startY + row * spacingY,
    };
  });
};

const sanitizeLocation = (municipio?: string | null, comarca?: string | null) => {
  const parts = [municipio, comarca].filter(Boolean) as string[];
  return parts.join(" · ") || undefined;
};

const buildDescription = (role: HoneycombRole, row: any): string | undefined => {
  switch (role) {
    case "artesano":
      return row.oficio
        ? `Oficio: ${row.oficio}. ${sanitizeLocation(row.municipio, row.comarca) || "Territorio vivo"}.`
        : "Artesano activo en la red.";
    case "asociacion":
      return "Asociación que conecta talleres, ferias y mentores en territorio.";
    case "institucion":
      return "Institución que apoya becas, rutas y mediación cultural.";
    case "patrocinador":
      return row.tipo ? `Patrocinio (${row.tipo}) con capital paciente.` : "Patrocinio cultural.";
    default:
      return undefined;
  }
};

const buildTags = (role: HoneycombRole, row: any): string[] | undefined => {
  const base: string[] = [];
  if (role === "artesano" && row.oficio) base.push(row.oficio);
  if (row.tipo && role === "patrocinador") base.push(row.tipo);
  if (row.municipio) base.push(row.municipio);
  if (row.comarca) base.push(row.comarca);
  return base.length ? base : undefined;
};

const mapRowsToNodes = <T extends { id: number | string; nombre: string | null }>(
  rows: T[] | null,
  role: HoneycombRole,
  buildSubtitle: (row: T) => string | undefined
): HoneycombNode[] => {
  if (!rows) return [];

  return rows
    .filter((row: any) => row.publico !== false)
    .slice(0, MAX_NODES)
    .map((row, idx) => ({
      id: `${role}-${row.id}`,
      name: row.nombre || `Nodo ${role}`,
      subtitle: buildSubtitle(row),
      location: sanitizeLocation((row as any).municipio, (row as any).comarca),
      role,
      isBreathing: role === "artesano" ? idx < 12 : idx < 6,
      description: buildDescription(role, row),
      tags: buildTags(role, row),
    }));
};

const wireConnections = (nodes: HoneycombNode[]): HoneycombNode[] => {
  if (nodes.length < 2) return nodes;

  const byRole: Record<HoneycombRole, HoneycombNode[]> = {
    artesano: [],
    asociacion: [],
    institucion: [],
    patrocinador: [],
  };
  nodes.forEach((n) => byRole[n.role].push(n));

  const pick = (list: HoneycombNode[], excludeId: string, count: number) =>
    list.filter((n) => n.id !== excludeId).slice(0, count).map((n) => n.name);

  return nodes.map((node) => {
    const connections: string[] = [];

    const otherRoles = Object.keys(byRole).filter((r) => r !== node.role) as HoneycombRole[];
    otherRoles.forEach((role) => {
      const picked = pick(byRole[role], node.id, 1);
      connections.push(...picked);
    });

    if (!connections.length) {
      connections.push(...pick(nodes, node.id, 2));
    }

    return { ...node, connections };
  });
};

export async function fetchHoneycombNodes(): Promise<HoneycombNode[]> {
  if (!hasSupabaseEnv || !supabase) {
    return applyHexPositions(FALLBACK_NODES);
  }

  const [{ data: artesanos, error: artErr }, { data: asociaciones, error: asocErr }, { data: instituciones, error: instErr }, { data: patrocinadores, error: patErr }] =
    await Promise.all([
      supabase.from("artesanos_lab").select("id, nombre, oficio, municipio, comarca").limit(MAX_NODES),
      supabase.from("asociaciones_lab").select("id, nombre, municipio, comarca, publico").limit(MAX_NODES),
      supabase.from("instituciones_lab").select("id, nombre, municipio, comarca, publico").limit(MAX_NODES),
      supabase.from("patrocinadores_lab").select("id, nombre, tipo, publico").limit(MAX_NODES),
    ]);

  if (artErr || asocErr || instErr || patErr) {
    console.warn("[Honeycomb] Supabase error:", artErr || asocErr || instErr || patErr);
  }

  const artisanNodes = mapRowsToNodes<ArtesanoRow>(artesanos as ArtesanoRow[] | null, "artesano", (row) =>
    row.oficio || undefined
  );
  const associationNodes = mapRowsToNodes<AsociacionRow>(asociaciones as AsociacionRow[] | null, "asociacion", () => undefined);
  const institutionNodes = mapRowsToNodes<InstitucionRow>(instituciones as InstitucionRow[] | null, "institucion", () => undefined);
  const sponsorNodes = mapRowsToNodes<PatrocinadorRow>(patrocinadores as PatrocinadorRow[] | null, "patrocinador", (row) =>
    row.tipo || undefined
  );

  const nodes = [...artisanNodes, ...associationNodes, ...institutionNodes, ...sponsorNodes];

  if (!nodes.length) {
    return applyHexPositions(FALLBACK_NODES);
  }

  const withConnections = wireConnections(nodes);
  return applyHexPositions(withConnections);
}
