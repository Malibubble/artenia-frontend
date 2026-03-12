import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APP_LOGO } from "@/const";
import { Hexagon, LogIn, FileText } from "lucide-react";
import { useLocation } from "wouter";
import LoginForm from "@/components/LoginForm";
import { useState } from "react";

export default function Bienvenida() {
  const [, setLocation] = useLocation();
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleIniciarSesion = () => {
    setShowLoginForm(true);
  };

  const handleSolicitarAcceso = () => {
    // Redirigir al formulario de solicitud
    setLocation("/solicitar-acceso");
  };
  
  if (showLoginForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 hex-grid-bg relative overflow-hidden">
        {/* Logo orgánico de colmena como marca de agua */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img 
            src="/artenia_glowing.png" 
            alt="" 
            className="w-[600px] h-[600px] object-contain opacity-[0.03]" 
          />
        </div>
        
        <div className="relative z-10 w-full max-w-md">
          <LoginForm />
          
          <div className="text-center mt-4">
            <button
              onClick={() => setShowLoginForm(false)}
              className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 hex-grid-bg relative overflow-hidden">
      {/* Logo orgánico de colmena como marca de agua */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img 
          src="/artenia_glowing.png" 
          alt="" 
          className="w-[600px] h-[600px] object-contain opacity-[0.03]" 
        />
      </div>
      <Card className="max-w-3xl w-full bg-gray-800/50 border-cyan-500/30 backdrop-blur-sm">
        <CardContent className="p-8 md:p-16">
          {/* Logo y diseño hexagonal */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/10 blur-2xl rounded-full" />
              <div className="relative flex items-center gap-4">
                <Hexagon className="w-16 h-16 md:w-20 md:h-20 text-cyan-500 animate-pulse-slow" />
                {APP_LOGO && (
                  <img src={APP_LOGO} alt="ARTENIA LAB" className="h-12 md:h-16 object-contain" />
                )}
              </div>
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4 font-tech tracking-wider">
              BIENVENIDO A ARTENIA LAB
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
              Pinacoteca Viva del Oficio Humano
            </p>
          </div>

          {/* Hexágonos decorativos */}
          <div className="flex justify-center gap-2 mb-12 opacity-30">
            <Hexagon className="w-6 h-6 text-cyan-500" />
            <Hexagon className="w-6 h-6 text-cyan-400" />
            <Hexagon className="w-6 h-6 text-cyan-500" />
            <Hexagon className="w-6 h-6 text-cyan-400" />
            <Hexagon className="w-6 h-6 text-cyan-500" />
          </div>

          {/* Botones principales */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Botón Iniciar sesión */}
            <Card className="bg-gray-900/50 border-cyan-500/30 hover:border-cyan-500/60 transition-all cursor-pointer group">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-all">
                    <LogIn className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-cyan-400 mb-3">
                  Iniciar sesión
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Accede con tu cuenta existente
                </p>
                <Button
                  onClick={handleIniciarSesion}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-6 glow-cyan"
                >
                  Entrar
                </Button>
              </CardContent>
            </Card>

            {/* Botón Solicitar acceso */}
            <Card className="bg-gray-900/50 border-orange-500/30 hover:border-orange-500/60 transition-all cursor-pointer group">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-all">
                    <FileText className="w-8 h-8 text-orange-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-orange-400 mb-3">
                  Solicitar acceso
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Completa el formulario de solicitud
                </p>
                <Button
                  onClick={handleSolicitarAcceso}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-6"
                  style={{ boxShadow: "0 0 20px rgba(255, 107, 53, 0.4)" }}
                >
                  Solicitar
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-6 border-t border-cyan-500/20">
            <p className="text-gray-400 text-sm">
              ¿Necesitas ayuda? Contacta con{" "}
              <a
                href="mailto:hello@artenialab.com"
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                hello@artenialab.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
