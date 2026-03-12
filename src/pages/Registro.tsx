import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";


const CATEGORIAS = [
  { value: "alimentación", label: "Alimentación" },
  { value: "cerámica", label: "Cerámica" },
  { value: "fibra_vegetal", label: "Fibra Vegetal" },
  { value: "instrumentos_musicales", label: "Instrumentos Musicales" },
  { value: "joyería", label: "Joyería" },
  { value: "madera", label: "Madera" },
  { value: "metal", label: "Metal" },
  { value: "papel", label: "Papel" },
  { value: "piedra", label: "Piedra" },
  { value: "piel_cuero", label: "Piel y Cuero" },
  { value: "textil", label: "Textil" },
  { value: "varios", label: "Varios" },
  { value: "vidrio", label: "Vidrio" },
];

const NIVELES_ACTIVIDAD = [
  { value: "muy_activo", label: "Muy Activo" },
  { value: "activo", label: "Activo" },
  { value: "inactivo", label: "Inactivo" },
  { value: "en_riesgo", label: "En Riesgo" },
];

export default function Registro() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [paso, setPaso] = useState(1);
  
  // Formulario de datos
  const [formData, setFormData] = useState({
    // Paso 1: Datos básicos
    nombre: "",
    oficio: "",
    categoria: "",
    descripcion: "",
    
    // Paso 2: Ubicación
    direccion: "",
    poblacion: "",
    provincia: "",
    codigoPostal: "",
    latitud: "",
    longitud: "",
    
    // Paso 3: Contacto y redes
    telefono: "",
    email: "",
    web: "",
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    
    // Paso 4: Nivel de actividad
    nivelActividad: "activo" as const,
  });

  const crearTallerMutation = trpc.talleres.crear.useMutation({
    onSuccess: () => {
      toast.success("¡Taller registrado exitosamente!");
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Error al registrar el taller");
    },
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.nombre || !formData.oficio || !formData.categoria) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    crearTallerMutation.mutate(formData);
  };

  const siguientePaso = () => {
    if (paso === 1 && (!formData.nombre || !formData.oficio || !formData.categoria)) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }
    setPaso(prev => Math.min(prev + 1, 4));
  };

  const pasoAnterior = () => {
    setPaso(prev => Math.max(prev - 1, 1));
  };

  // Redirigir si no está autenticado
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/bienvenida";
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">Registro de Artesano</h1>
          <p className="text-gray-400">Completa tu perfil para unirte a la Pinacoteca Viva</p>
        </div>

        {/* Indicador de pasos */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  paso >= num
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {paso > num ? <Check className="w-5 h-5" /> : num}
              </div>
              {num < 4 && (
                <div
                  className={`h-1 w-16 mx-2 transition-all ${
                    paso > num ? "bg-cyan-500" : "bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card className="bg-gray-800/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-400">
              {paso === 1 && "Datos Básicos"}
              {paso === 2 && "Ubicación"}
              {paso === 3 && "Contacto y Redes Sociales"}
              {paso === 4 && "Nivel de Actividad"}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {paso === 1 && "Información fundamental de tu taller"}
              {paso === 2 && "¿Dónde se encuentra tu taller?"}
              {paso === 3 && "Cómo pueden contactarte"}
              {paso === 4 && "Estado actual de tu actividad artesanal"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Paso 1: Datos básicos */}
            {paso === 1 && (
              <>
                <div>
                  <Label htmlFor="nombre" className="text-cyan-400">Nombre del Taller *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    className="bg-gray-900/50 border-cyan-500/30 text-white"
                    placeholder="Ej: Cerámica Artesana Valencia"
                  />
                </div>

                <div>
                  <Label htmlFor="oficio" className="text-cyan-400">Oficio *</Label>
                  <Input
                    id="oficio"
                    value={formData.oficio}
                    onChange={(e) => handleChange("oficio", e.target.value)}
                    className="bg-gray-900/50 border-cyan-500/30 text-white"
                    placeholder="Ej: Ceramista, Alfarero, Vidriero..."
                  />
                </div>

                <div>
                  <Label htmlFor="categoria" className="text-cyan-400">Categoría *</Label>
                  <Select value={formData.categoria} onValueChange={(value) => handleChange("categoria", value)}>
                    <SelectTrigger className="bg-gray-900/50 border-cyan-500/30 text-white">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-cyan-500/30">
                      {CATEGORIAS.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-cyan-500/20">
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="descripcion" className="text-cyan-400">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => handleChange("descripcion", e.target.value)}
                    className="bg-gray-900/50 border-cyan-500/30 text-white min-h-[100px]"
                    placeholder="Cuéntanos sobre tu taller, técnicas y productos..."
                  />
                </div>
              </>
            )}

            {/* Paso 2: Ubicación */}
            {paso === 2 && (
              <>
                <div>
                  <Label htmlFor="direccion" className="text-cyan-400">Dirección</Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => handleChange("direccion", e.target.value)}
                    className="bg-gray-900/50 border-cyan-500/30 text-white"
                    placeholder="Calle, número..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="poblacion" className="text-cyan-400">Población</Label>
                    <Input
                      id="poblacion"
                      value={formData.poblacion}
                      onChange={(e) => handleChange("poblacion", e.target.value)}
                      className="bg-gray-900/50 border-cyan-500/30 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="provincia" className="text-cyan-400">Provincia</Label>
                    <Input
                      id="provincia"
                      value={formData.provincia}
                      onChange={(e) => handleChange("provincia", e.target.value)}
                      className="bg-gray-900/50 border-cyan-500/30 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="codigoPostal" className="text-cyan-400">Código Postal</Label>
                  <Input
                    id="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={(e) => handleChange("codigoPostal", e.target.value)}
                    className="bg-gray-900/50 border-cyan-500/30 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitud" className="text-cyan-400">Latitud</Label>
                    <Input
                      id="latitud"
                      value={formData.latitud}
                      onChange={(e) => handleChange("latitud", e.target.value)}
                      className="bg-gray-900/50 border-cyan-500/30 text-white"
                      placeholder="39.4699"
                    />
                  </div>

                  <div>
                    <Label htmlFor="longitud" className="text-cyan-400">Longitud</Label>
                    <Input
                      id="longitud"
                      value={formData.longitud}
                      onChange={(e) => handleChange("longitud", e.target.value)}
                      className="bg-gray-900/50 border-cyan-500/30 text-white"
                      placeholder="-0.3763"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Paso 3: Contacto y redes */}
            {paso === 3 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefono" className="text-cyan-400">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => handleChange("telefono", e.target.value)}
                      className="bg-gray-900/50 border-cyan-500/30 text-white"
                      placeholder="+34 600 000 000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-cyan-400">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="bg-gray-900/50 border-cyan-500/30 text-white"
                      placeholder="contacto@taller.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="web" className="text-cyan-400">Sitio Web</Label>
                  <Input
                    id="web"
                    type="url"
                    value={formData.web}
                    onChange={(e) => handleChange("web", e.target.value)}
                    className="bg-gray-900/50 border-cyan-500/30 text-white"
                    placeholder="https://www.mitaller.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instagram" className="text-cyan-400">Instagram</Label>
                    <Input
                      id="instagram"
                      value={formData.instagram}
                      onChange={(e) => handleChange("instagram", e.target.value)}
                      className="bg-gray-900/50 border-cyan-500/30 text-white"
                      placeholder="@mitaller"
                    />
                  </div>

                  <div>
                    <Label htmlFor="facebook" className="text-cyan-400">Facebook</Label>
                    <Input
                      id="facebook"
                      value={formData.facebook}
                      onChange={(e) => handleChange("facebook", e.target.value)}
                      className="bg-gray-900/50 border-cyan-500/30 text-white"
                      placeholder="facebook.com/mitaller"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="twitter" className="text-cyan-400">Twitter/X</Label>
                    <Input
                      id="twitter"
                      value={formData.twitter}
                      onChange={(e) => handleChange("twitter", e.target.value)}
                      className="bg-gray-900/50 border-cyan-500/30 text-white"
                      placeholder="@mitaller"
                    />
                  </div>

                  <div>
                    <Label htmlFor="linkedin" className="text-cyan-400">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={(e) => handleChange("linkedin", e.target.value)}
                      className="bg-gray-900/50 border-cyan-500/30 text-white"
                      placeholder="linkedin.com/in/mitaller"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Paso 4: Nivel de actividad */}
            {paso === 4 && (
              <>
                <div>
                  <Label htmlFor="nivelActividad" className="text-cyan-400">Nivel de Actividad</Label>
                  <Select value={formData.nivelActividad} onValueChange={(value) => handleChange("nivelActividad", value)}>
                    <SelectTrigger className="bg-gray-900/50 border-cyan-500/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-cyan-500/30">
                      {NIVELES_ACTIVIDAD.map((nivel) => (
                        <SelectItem key={nivel.value} value={nivel.value} className="text-white hover:bg-cyan-500/20">
                          {nivel.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-400 mt-2">
                    Indica el estado actual de tu actividad artesanal
                  </p>
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mt-6">
                  <h3 className="text-cyan-400 font-semibold mb-2">Resumen de tu registro</h3>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p><span className="text-gray-400">Taller:</span> {formData.nombre}</p>
                    <p><span className="text-gray-400">Oficio:</span> {formData.oficio}</p>
                    <p><span className="text-gray-400">Categoría:</span> {CATEGORIAS.find(c => c.value === formData.categoria)?.label}</p>
                    {formData.poblacion && <p><span className="text-gray-400">Ubicación:</span> {formData.poblacion}, {formData.provincia}</p>}
                  </div>
                </div>
              </>
            )}

            {/* Botones de navegación */}
            <div className="flex justify-between pt-6">
              <Button
                onClick={pasoAnterior}
                disabled={paso === 1}
                variant="outline"
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              {paso < 4 ? (
                <Button
                  onClick={siguientePaso}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={crearTallerMutation.isPending}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {crearTallerMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Completar Registro
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
