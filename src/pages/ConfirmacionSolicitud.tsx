import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APP_LOGO } from "@/const";
import { Hexagon, CheckCircle2, Mail, Clock } from "lucide-react";
import { useLocation } from "wouter";

export default function ConfirmacionSolicitud() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 hex-grid-bg">
      <Card className="max-w-3xl w-full bg-gray-800/50 border-cyan-500/30 backdrop-blur-sm">
        <CardContent className="p-8 md:p-16">
          {/* Icono de éxito con diseño hexagonal */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
              <div className="relative w-32 h-32 flex items-center justify-center">
                <Hexagon className="w-32 h-32 text-green-500/30 absolute animate-pulse-slow" />
                <CheckCircle2 className="w-16 h-16 text-green-400 relative z-10" />
              </div>
            </div>
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-4 font-tech">
              ¡SOLICITUD ENVIADA!
            </h1>
            <p className="text-gray-300 text-lg">
              Gracias por tu interés en unirte a ARTENIA LAB
            </p>
          </div>

          {/* Hexágonos decorativos */}
          <div className="flex justify-center gap-2 mb-8 opacity-30">
            <Hexagon className="w-6 h-6 text-cyan-500" />
            <Hexagon className="w-6 h-6 text-green-400" />
            <Hexagon className="w-6 h-6 text-cyan-500" />
            <Hexagon className="w-6 h-6 text-green-400" />
            <Hexagon className="w-6 h-6 text-cyan-500" />
          </div>

          {/* Mensaje principal */}
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <Mail className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-cyan-400 mb-2">
                  Hemos recibido tu solicitud
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Solicitud enviada. Te contactaremos por email cuando sea aprobada.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-green-400 mb-2">
                  ¿Qué sigue ahora?
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">1.</span>
                    <span>Nuestro equipo revisará tu solicitud manualmente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">2.</span>
                    <span>Recibirás un email con la decisión (aprobación o rechazo)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">3.</span>
                    <span>Si es aprobada, podrás acceder a tu panel y completar tu perfil</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">
              📧 Revisa tu bandeja de entrada
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Te enviaremos un email a la dirección que proporcionaste con los siguientes pasos. 
              Si no lo recibes en las próximas 24 horas, revisa tu carpeta de spam o contacta con nosotros en{" "}
              <a
                href="mailto:hello@artenialab.com"
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                hello@artenialab.com
              </a>
            </p>
          </div>

          {/* Botón de volver */}
          <div className="text-center">
            <Button
              onClick={() => setLocation("/bienvenida")}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-lg px-12 py-6 glow-cyan"
            >
              Volver al Inicio
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-cyan-500/20">
            <p className="text-gray-400 text-sm">
              © 2025 ARTENIA LAB - Pinacoteca Viva del Oficio Humano
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
