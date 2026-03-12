import { Card, CardContent } from "@/components/ui/card";
import { Hexagon, Eye, Hammer, Users, Building2, Briefcase, Shield } from "lucide-react";
import { useLocation } from "wouter";

interface RolOption {
  id: string;
  nombre: string;
  descripcion: string;
  permisos: string[];
  icon: React.ElementType;
  color: string;
}

const roles: RolOption[] = [
  {
    id: "visitante",
    nombre: "Visitante",
    descripcion: "Explora el ecosistema artesanal",
    permisos: ["Ver mapa básico", "Ver fichas de artesanos"],
    icon: Eye,
    color: "text-blue-400",
  },
  {
    id: "artesano",
    nombre: "Artesano",
    descripcion: "Gestiona tu taller y conecta con la red",
    permisos: [
      "Dashboard personal",
      "Nivel de actividad",
      "Puntos de conexión",
      "Potencial de red",
    ],
    icon: Hammer,
    color: "text-amber-400",
  },
  {
    id: "asociacion",
    nombre: "Asociación",
    descripcion: "Gestiona tu asociación y miembros",
    permisos: [
      "Dar alta artesanos",
      "Gestión de miembros",
      "Estadísticas de asociación",
    ],
    icon: Users,
    color: "text-green-400",
  },
  {
    id: "institucion",
    nombre: "Institución Pública",
    descripcion: "Monitorea la salud del ecosistema",
    permisos: [
      "Mapa general",
      "Salud del ecosistema",
      "Nivel de actividad",
      "Exportar reportes",
    ],
    icon: Building2,
    color: "text-purple-400",
  },
  {
    id: "promotor",
    nombre: "Promotor Cultural",
    descripcion: "Acceso completo para gestión y promoción",
    permisos: [
      "Acceso completo al mapa",
      "Análisis avanzado de red",
      "Todas las estadísticas",
      "Herramientas de promoción",
    ],
    icon: Briefcase,
    color: "text-cyan-400",
  },
  {
    id: "admin",
    nombre: "Administrador",
    descripcion: "Gestión completa del sistema",
    permisos: [
      "Gestión de usuarios",
      "Códigos de invitación",
      "Panel de administración",
      "Control total",
    ],
    icon: Shield,
    color: "text-red-400",
  },
];

export default function SeleccionRol() {
  const [, setLocation] = useLocation();

  const handleSelectRol = (rolId: string) => {
    // Guardar rol seleccionado en localStorage
    localStorage.setItem("rol_seleccionado", rolId);
    
    // Redirigir al formulario de registro correspondiente
    setLocation(`/registro/${rolId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 hex-grid-bg">
      <div className="max-w-7xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/10 blur-2xl rounded-full" />
              <Hexagon className="w-20 h-20 text-cyan-500 animate-pulse-slow relative" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4 font-tech">
            SELECCIONA TU ROL
          </h1>
          <p className="text-gray-400 text-lg">
            Elige el tipo de acceso que mejor se adapte a tu perfil
          </p>
        </div>

        {/* Grid de roles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((rol) => {
            const Icon = rol.icon;
            return (
              <Card
                key={rol.id}
                className="bg-gray-800/50 border-cyan-500/30 backdrop-blur-sm hover:border-cyan-500 transition-all duration-300 cursor-pointer group"
                onClick={() => handleSelectRol(rol.id)}
              >
                <CardContent className="p-6">
                  {/* Icono hexagonal */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <Hexagon className={`w-16 h-16 ${rol.color} opacity-30 absolute`} />
                      <Icon className={`w-8 h-8 ${rol.color} relative z-10 translate-x-4 translate-y-4`} />
                    </div>
                  </div>

                  {/* Nombre y descripción */}
                  <h3 className={`text-xl font-bold ${rol.color} mb-2 text-center group-hover:scale-105 transition-transform`}>
                    {rol.nombre}
                  </h3>
                  <p className="text-gray-400 text-sm text-center mb-4">
                    {rol.descripcion}
                  </p>

                  {/* Lista de permisos */}
                  <div className="space-y-2">
                    {rol.permisos.map((permiso, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                        <p className="text-gray-300 text-sm">{permiso}</p>
                      </div>
                    ))}
                  </div>

                  {/* Botón hover */}
                  <div className="mt-6 text-center">
                    <span className="text-cyan-400 text-sm font-semibold group-hover:underline">
                      Seleccionar →
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            ¿Tienes dudas sobre qué rol elegir?{" "}
            <a
              href="mailto:hello@artenialab.com"
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
