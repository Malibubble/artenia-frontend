import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const raw = fs.readFileSync("./TALLERES_ENRIQUECIDOS.json", "utf8");
const talleresJson = JSON.parse(raw);

// helpers
const toBool = (value) => {
  if (typeof value === "boolean") return value;
  if (!value) return false;
  const v = String(value).toLowerCase().trim();
  return v === "si" || v === "sí" || v === "true" || v === "1";
};

const toTextArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
};

const main = async () => {
  // preparamos los registros en el formato de la tabla
  const registros = talleresJson.map((t) => ({
    id_taller: t.id_taller,
    nombre_taller: t.nombre_taller,
    id_oficio_principal: t.id_oficio_principal,
    oficio: t.oficio,
    subcategoria: t.subcategoria,

    municipio: t.municipio,
    comarca: t.comarca,
    direccion: t.direccion,

    lat: t.lat,
    lng: t.lng,

    web: t.web || null,
    instagram: t.instagram || null,
    facebook: t.facebook || null,
    tiktok: t.tiktok || null,
    email: t.email || null,
    telefono: t.telefono || null,

    descripcion: t.descripcion || null,
    curiosidad: t.curiosidad || null,
    historia: t.historia || null,

    tecnicas: toTextArray(t.tecnicas),
    productos: toTextArray(t.productos),
    asociaciones: toTextArray(t.asociaciones),
    asociaciones_vinculadas: t.asociaciones_vinculadas || null,
    ferias_vinculadas: t.ferias_vinculadas || null,

    horario: t.horario || null,
    visitable: t.visitable ?? false,
    talleres_impartidos: t.talleres_impartidos ?? false,

    anio_fundacion: t.anio_fundacion ?? null,
    antiguedad_anos: t.antiguedad_anos ?? null,

    digitalizacion: t.digitalizacion || null,
    nivel_actividad: t.nivel_actividad || null,

    riesgo_desaparicion: t.riesgo_desaparicion ?? null,
    actividad_digital: t.actividad_digital ?? null,
    actividad_artesanal: t.actividad_artesanal ?? null,
    potencial_turistico: t.potencial_turistico ?? null,

    tiene_dca: toBool(t.tiene_dca),
    tienda_fisica: toBool(t.tienda_fisica),
    tienda_online: toBool(t.tienda_online),
    exporta: toBool(t.exporta),

    imagen: t.imagen || null,
    ultima_actualizacion: t.ultima_actualizacion || null,

    // flags Artenia los dejamos por defecto (true)
  }));

  // insert en lotes para no saturar
  const chunkSize = 50;
  for (let i = 0; i < registros.length; i += chunkSize) {
    const chunk = registros.slice(i, i + chunkSize);
    console.log(`Insertando registros ${i + 1} – ${i + chunk.length}...`);
    const { error } = await supabase.from("talleres").insert(chunk);
    if (error) {
      console.error("Error en el insert:", error);
      process.exit(1);
    }
  }

  console.log("Importación completada ✅");
};

main();
