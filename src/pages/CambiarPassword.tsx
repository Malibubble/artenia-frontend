import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Eye, EyeOff, Loader2, Shield } from "lucide-react";

export default function CambiarPassword() {
  const [, setLocation] = useLocation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const changePasswordMutation = trpc.auth.changePassword.useMutation({
    onSuccess: () => {
      toast.success("Contraseña actualizada correctamente");
      
      // Actualizar flag en localStorage
      localStorage.setItem("must_change_password", "false");
      
      // Redirigir al mapa
      setLocation("/");
    },
    onError: (error) => {
      toast.error(error.message || "Error al cambiar contraseña");
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error("Por favor, completa todos los campos");
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    
    setIsLoading(true);
    changePasswordMutation.mutate({ newPassword });
  };

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
      
      <Card className="w-full max-w-md bg-gray-800/50 border-cyan-500/30 backdrop-blur-sm relative z-10">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <CardTitle className="text-2xl text-cyan-400 text-center">
            Cambiar Contraseña
          </CardTitle>
          <CardDescription className="text-gray-400 text-center">
            Por seguridad, debes cambiar tu contraseña temporal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-gray-300">
                Nueva Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-gray-900/50 border-cyan-500/30 text-white pr-10"
                  disabled={isLoading}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Usa al menos 8 caracteres con una combinación de letras, números y símbolos
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">
                Confirmar Nueva Contraseña
              </Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-900/50 border-cyan-500/30 text-white"
                disabled={isLoading}
                required
              />
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 space-y-2">
              <p className="text-sm text-cyan-400 font-semibold">
                💡 Consejos de seguridad:
              </p>
              <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                <li>No uses contraseñas que hayas usado antes</li>
                <li>No compartas tu contraseña con nadie</li>
                <li>Usa una contraseña única para cada servicio</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Actualizando contraseña...
                </>
              ) : (
                "Actualizar Contraseña"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
