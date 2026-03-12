import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { APP_LOGO } from "@/const";
import { Hexagon, Loader2, Mail, Key, Phone, User, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

type Rol = "visitante" | "artesano" | "asociacion" | "institucion" | "promotor";

const preguntasPorRol: Record<Rol, { id: string; label: string; type: "text" | "textarea"; required: boolean }[]> = {
  visitante: [
    { id: "que_te_trae", label: "¿Qué te trae a Artenia?", type: "textarea", required: true },
    { id: "oficios_interes", label: "¿Qué tipo de oficios o experiencias te interesa descubrir?", type: "textarea", required: true },
    { id: "contribucion", label: "¿Cómo crees que podrías contribuir a la comunidad? (opcional)", type: "textarea", required: false },
  ],
  artesano: [
    { id: "nombre_taller", label: "Nombre del taller o marca", type: "text", required: true },
    { id: "oficio", label: "¿Qué oficio practicas?", type: "text", required: true },
    { id: "años_ejerciendo", label: "¿Cuántos años llevas ejerciendo?", type: "text", required: true },
    { id: "ubicacion_taller", label: "¿Dónde está tu taller? (dirección + ciudad + país)", type: "text", required: true },
    { id: "tecnicas", label: "¿Cuáles son tus técnicas principales?", type: "textarea", required: true },
    { id: "certificacion", label: "¿Tienes registro de artesano o certificación? (sí/no + cuál)", type: "text", required: true },
    { id: "experiencias", label: "¿Quieres activar experiencias o talleres presenciales en tu taller? (sí/no)", type: "text", required: true },
  ],
  asociacion: [
    { id: "nombre_asociacion", label: "Nombre de la asociación", type: "text", required: true },
    { id: "ambito", label: "Ámbito (local / comarcal / autonómico)", type: "text", required: true },
    { id: "num_artesanos", label: "Número de artesanos asociados", type: "text", required: true },
    { id: "oficios_representados", label: "Oficios principales representados", type: "textarea", required: true },
    { id: "objetivo", label: "Objetivo actual de la asociación", type: "textarea", required: true },
    { id: "eventos", label: "¿Gestionan eventos o ferias? (sí/no)", type: "text", required: true },
  ],
  institucion: [
    { id: "nombre_institucion", label: "Nombre de la institución", type: "text", required: true },
    { id: "tipo", label: "Tipo de institución (ayuntamiento, cámara, museo, centro de artesanía, etc.)", type: "text", required: true },
    { id: "territorio", label: "Territorio bajo su competencia", type: "text", required: true },
    { id: "objetivos", label: "¿Cuáles son sus objetivos en relación al patrimonio artesanal?", type: "textarea", required: true },
    { id: "colaboracion", label: "¿Está interesada en datos, informes o colaboración cultural? (sí/no)", type: "text", required: true },
  ],
  promotor: [
    { id: "nombre_empresa", label: "Nombre de la empresa o identidad del mecenas", type: "text", required: true },
    { id: "motivacion", label: "Motivación para apoyar el legado artesanal", type: "textarea", required: true },
    { id: "oficios_apoyar", label: "¿Qué tipos de oficios desea apoyar?", type: "textarea", required: true },
    { id: "rango_aportacion", label: "Rango de aportación o nivel de patrocinio previsto", type: "text", required: true },
    { id: "reporting", label: "¿Qué espera del programa de impacto y reporting RSC?", type: "textarea", required: true },
  ],
};

export default function SolicitarAcceso() {
  const [, setLocation] = useLocation();
  // Mostrar formulario directamente, sin pantalla previa
  
  // Campos del formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState<Rol | "">("");
  const [codigo, setCodigo] = useState("");
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const validarCodigoMutation = trpc.invitaciones.validarCodigo.useMutation();
  const registrarSolicitudMutation = trpc.invitaciones.registrarSolicitud.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !email || !telefono || !rol || !codigo) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    if (!aceptaTerminos) {
      toast.error("Debes aceptar que tu solicitud será revisada manualmente");
      return;
    }

    // Validar que se respondieron todas las preguntas obligatorias del rol
    const preguntasRol = preguntasPorRol[rol as Rol];
    const preguntasObligatorias = preguntasRol.filter(p => p.required);
    const faltantes = preguntasObligatorias.filter(p => !respuestas[p.id]);
    
    if (faltantes.length > 0) {
      toast.error(`Por favor responde todas las preguntas obligatorias de tu rol`);
      return;
    }

    try {
      // Validar código
      const codigoValido = await validarCodigoMutation.mutateAsync({
        codigo,
        email,
      });

      if (!codigoValido.valido) {
        toast.error("Código inválido. Solicita uno válido a Artenia.");
        return;
      }

      // Registrar solicitud
      await registrarSolicitudMutation.mutateAsync({
        nombre,
        email,
        telefono,
        rol: rol as Rol,
        codigo,
        respuestasRol: JSON.stringify(respuestas),
      });

      // Guardar en localStorage
      localStorage.setItem("codigo_invitacion_valido", codigo);
      localStorage.setItem("email_aprobado", email);
      localStorage.setItem("nombre_usuario", nombre);
      localStorage.setItem("rol_seleccionado", rol);

      // Redirigir a pantalla de confirmación
      setLocation("/confirmacion-solicitud");
    } catch (error: any) {
      toast.error(error.message || "Error al enviar solicitud");
    }
  };

  const handleRespuestaChange = (preguntaId: string, valor: string) => {
    setRespuestas(prev => ({ ...prev, [preguntaId]: valor }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-4 hex-grid-bg">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2 font-tech">
            SOLICITUD DE ACCESO
          </h1>
          <p className="text-gray-300">
            Completa el formulario para unirte a ARTENIA LAB
          </p>
        </div>

        {/* Formulario */}
        <Card className="bg-gray-800/50 border-cyan-500/30 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Datos básicos */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Datos Básicos
                </h3>

                <div>
                  <Label htmlFor="nombre" className="text-gray-300">
                    Nombre completo *
                  </Label>
                  <Input
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="bg-gray-900/50 border-cyan-500/30 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-900/50 border-cyan-500/30 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="telefono" className="text-gray-300 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-cyan-400" />
                    Teléfono *
                  </Label>
                  <Input
                    id="telefono"
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="bg-gray-900/50 border-cyan-500/30 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="rol" className="text-gray-300">
                    Selecciona tu rol en Artenia *
                  </Label>
                  <Select value={rol} onValueChange={(value) => {
                    setRol(value as Rol);
                    setRespuestas({}); // Limpiar respuestas al cambiar rol
                  }}>
                    <SelectTrigger className="bg-gray-900/50 border-cyan-500/30 text-white">
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visitante">Visitante (curioso / público general)</SelectItem>
                      <SelectItem value="artesano">Artesano</SelectItem>
                      <SelectItem value="asociacion">Asociación</SelectItem>
                      <SelectItem value="institucion">Institución</SelectItem>
                      <SelectItem value="promotor">Promotor / Protector de legado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="codigo" className="text-gray-300 flex items-center gap-2">
                    <Key className="w-4 h-4 text-cyan-400" />
                    Código de invitación *
                  </Label>
                  <Input
                    id="codigo"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                    className="bg-gray-900/50 border-cyan-500/30 text-white font-mono"
                    placeholder="ARTENIA2024"
                    required
                  />
                  
                  {/* Botón de WhatsApp para solicitar código */}
                  <div className="mt-3">
                    <a
                      href={`https://wa.me/34676861795?text=${encodeURIComponent(
                        `Hola, soy ${nombre || '[Tu nombre]'} y necesito un código de acceso para ARTENIA LAB.\n\n` +
                        `📧 Email: ${email || '[Tu email]'}\n` +
                        `📞 Teléfono: ${telefono || '[Tu teléfono]'}\n` +
                        `🎭 Rol: ${rol || '[Tu rol]'}\n\n` +
                        `¿Podrías proporcionarme un código de invitación?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      ¿No tienes código? Solicítalo por WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Preguntas dinámicas por rol */}
              {rol && preguntasPorRol[rol as Rol] && (
                <div className="border-t border-cyan-500/30 pt-8 space-y-6">
                  <h3 className="text-xl font-bold text-cyan-400 mb-4">
                    Preguntas específicas para {rol}
                  </h3>
                  {preguntasPorRol[rol as Rol].map((pregunta) => (
                    <div key={pregunta.id}>
                      <Label htmlFor={pregunta.id} className="text-gray-300">
                        {pregunta.label} {pregunta.required && "*"}
                      </Label>
                      {pregunta.type === "text" ? (
                        <Input
                          id={pregunta.id}
                          value={respuestas[pregunta.id] || ""}
                          onChange={(e) => handleRespuestaChange(pregunta.id, e.target.value)}
                          className="bg-gray-900/50 border-cyan-500/30 text-white"
                          required={pregunta.required}
                        />
                      ) : (
                        <Textarea
                          id={pregunta.id}
                          value={respuestas[pregunta.id] || ""}
                          onChange={(e) => handleRespuestaChange(pregunta.id, e.target.value)}
                          className="bg-gray-900/50 border-cyan-500/30 text-white min-h-[120px]"
                          required={pregunta.required}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Checkbox de términos */}
              <div className="flex items-start gap-3 border-t border-cyan-500/30 pt-8">
                <Checkbox
                  id="terminos"
                  checked={aceptaTerminos}
                  onCheckedChange={(checked) => setAceptaTerminos(checked as boolean)}
                  className="border-cyan-500/50 mt-1"
                />
                <Label htmlFor="terminos" className="text-gray-300 text-sm leading-relaxed cursor-pointer">
                  Acepto que mi solicitud será revisada manualmente y que recibiré un email de aprobación o rechazo.
                </Label>
              </div>

              {/* Botón de envío */}
              <Button
                type="submit"
                disabled={validarCodigoMutation.isPending || registrarSolicitudMutation.isPending}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-lg py-8 glow-cyan"
              >
                {(validarCodigoMutation.isPending || registrarSolicitudMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Enviando solicitud...
                  </>
                ) : (
                  "Enviar Solicitud"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Volver */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => setMostrarFormulario(false)}
            className="text-gray-400 hover:text-cyan-400"
          >
            ← Volver
          </Button>
        </div>
      </div>
    </div>
  );
}
