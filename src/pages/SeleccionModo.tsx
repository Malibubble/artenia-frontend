import { useLocation } from "wouter";
import { User, Eye, Route, Shield, Info } from "lucide-react";
import { APP_LOGO } from "@/const";

export default function SeleccionModo() {
  const [, setLocation] = useLocation();
  const userEmail = localStorage.getItem("email_usuario") || "";
  const isAdmin = userEmail === "artenialab@gmail.com";

  const modos = [
    {
      id: "visitante",
      titulo: "Modo Visitante",
      descripcion: "Explora el mapa, descubre artesanos, rutas y experiencias culturales",
      icono: Eye,
      color: "from-cyan-500 to-blue-600",
      ruta: "/mapa",
    },
    {
      id: "artesano",
      titulo: "Modo Artesano",
      descripcion: "Gestiona tu ficha, contenidos, tour 360, productos y experiencias",
      icono: User,
      color: "from-purple-500 to-pink-600",
      ruta: "/dashboard",
    },
    {
      id: "creador",
      titulo: "Creador de Rutas",
      descripcion: "Diseña itinerarios culturales arrastrando artesanos, arquitectura y experiencias",
      icono: Route,
      color: "from-orange-500 to-red-600",
      ruta: "/creador-rutas",
    },
  ];

  if (isAdmin) {
    modos.push({
      id: "admin",
      titulo: "Modo Admin",
      descripcion: "Acceso total: gestión, vista global de la colmena y herramientas avanzadas",
      icono: Shield,
      color: "from-green-500 to-emerald-600",
      ruta: "/admin",
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f1419] to-[#000000] flex flex-col items-center justify-center p-6">
      {/* Logo y título */}
      <div className="text-center mb-12 animate-fade-in">
        <img 
          src={APP_LOGO} 
          alt="Artenia Lab" 
          className="w-24 h-24 mx-auto mb-6 drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]"
        />
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Artenia Regis
        </h1>
        <p className="text-xl text-cyan-400 font-light">
          Sistema Operativo Cultural
        </p>
      </div>

      {/* Mensaje de seguridad */}
      <div className="max-w-2xl w-full mb-8 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
          <div className="text-sm text-gray-300 leading-relaxed">
            <p className="font-semibold text-cyan-400 mb-2">Por tu seguridad y la de Artenia</p>
            <p>
              No compartas tu código de acceso ni tu contraseña. Cada sesión requiere identificarte de nuevo 
              y nunca te pediremos tus claves por email. Protegemos el legado cultural y tus datos con el 
              máximo cuidado.
            </p>
          </div>
        </div>
      </div>

      {/* Selección de modos */}
      <div className="max-w-5xl w-full">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          Elige tu modo de acceso
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modos.map((modo, index) => {
            const Icono = modo.icono;
            return (
              <button
                key={modo.id}
                onClick={() => {
                  localStorage.setItem("modo_actual", modo.id);
                  setLocation(modo.ruta);
                }}
                className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/50 rounded-2xl p-8 text-left transition-all duration-300 hover:scale-105 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] animate-fade-in-up"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                {/* Gradiente de fondo al hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${modo.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                
                {/* Contenido */}
                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${modo.color} mb-4`}>
                    <Icono className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {modo.titulo}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed">
                    {modo.descripcion}
                  </p>
                </div>

                {/* Indicador de hover */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-cyan-400 text-sm font-semibold">
                    Acceder →
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Acceso directo al mapa */}
      <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: '1s' }}>
        <p className="text-gray-400 mb-4">¿Solo quieres explorar el mapa?</p>
        <button
          onClick={() => setLocation("/mapa")}
          className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 transition-colors"
        >
          Ir directamente al Mapa
        </button>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
